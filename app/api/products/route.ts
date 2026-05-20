import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { allProducts } from "@/lib/product-data"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    let products = await db.collection("products").find({}).toArray()

    // Auto-seed collection if empty
    if (products.length === 0) {
      console.log("Seeding products into MongoDB Atlas...")
      await db.collection("products").insertMany(allProducts)
      products = await db.collection("products").find({}).toArray()
    }

    return NextResponse.json(products)
  } catch (error: any) {
    console.error("GET products error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
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
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error: any) {
    console.error("POST product error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
