import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { allProducts } from "@/lib/product-data"
import { getCache, setCache, invalidateCache } from "@/lib/cache"

const CACHE_KEY = "products_list"
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=600",
}

export async function GET() {
  try {
    // 1. Check in-memory cache first
    const cachedProducts = getCache(CACHE_KEY)
    if (cachedProducts) {
      return NextResponse.json(cachedProducts, { headers: CACHE_HEADERS })
    }

    // 2. Cache miss: Query MongoDB Atlas
    const { db } = await connectToDatabase()
    let products = await db.collection("products").find({}).toArray()

    // Auto-seed collection if empty
    if (products.length === 0) {
      console.log("Seeding products into MongoDB Atlas...")
      await db.collection("products").insertMany(allProducts)
      products = await db.collection("products").find({}).toArray()
    }

    // 3. Store in cache for 5 minutes (300 seconds)
    setCache(CACHE_KEY, products, 300)

    return NextResponse.json(products, { headers: CACHE_HEADERS })
  } catch (error: any) {
    console.error("GET products error (falling back to static products):", error)
    return NextResponse.json(allProducts, { headers: CACHE_HEADERS })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { name, description, price, originalPrice, image, additionalImages, category, details, features, barcode } = body

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, and category are required." },
        { status: 400 }
      )
    }

    // Find the next incrementing numeric ID
    const lastProduct = await db.collection("products").findOne({}, { sort: { id: -1 } })
    const newId = lastProduct && lastProduct.id ? lastProduct.id + 1 : 1

    const finalBarcode = barcode && barcode.trim() ? barcode.trim() : Math.floor(1000000000000 + Math.random() * 9000000000000).toString().substring(0, 13)

    const newProduct = {
      id: newId,
      name,
      description: description || "",
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price),
      image: image || "/placeholder.svg",
      additionalImages: Array.isArray(additionalImages) ? additionalImages : [],
      category,
      details: details || "",
      features: Array.isArray(features) ? features : [],
      barcode: finalBarcode,
      createdAt: new Date(),
    }

    await db.collection("products").insertOne(newProduct)

    // Invalidate the cache to ensure next GET loads the fresh product list
    invalidateCache(CACHE_KEY)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error: any) {
    console.error("POST product error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
