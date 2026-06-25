import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { collections as initialCollections } from "@/lib/product-data"
import { getCache, setCache, invalidateCache } from "@/lib/cache"

const CACHE_KEY = "collections_list"
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=600",
}

export async function GET() {
  try {
    // 1. Check in-memory cache first
    const cachedCollections = getCache(CACHE_KEY)
    if (cachedCollections) {
      return NextResponse.json(cachedCollections, { headers: CACHE_HEADERS })
    }

    // 2. Cache miss: Query database
    const { db } = await connectToDatabase()
    let collections = await db.collection("collections").find({}).sort({ sortOrder: 1 }).toArray()

    // Auto-seed if empty
    if (collections.length === 0) {
      console.log("Seeding collections into MongoDB Atlas...")
      await db.collection("collections").insertMany(initialCollections)
      collections = await db.collection("collections").find({}).toArray()
    }

    // 3. Set cache for 5 minutes
    setCache(CACHE_KEY, collections, 300)

    return NextResponse.json(collections, { headers: CACHE_HEADERS })
  } catch (error: any) {
    console.error("GET collections error (falling back to static collections):", error)
    return NextResponse.json(initialCollections, { headers: CACHE_HEADERS })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { id, name, icon, image } = body

    if (!id || !name || !icon) {
      return NextResponse.json(
        { error: "Missing required fields: id, name, and icon are required." },
        { status: 400 }
      )
    }

    // Format ID to clean slug
    const cleanId = id.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "-")

    const newCollection = {
      id: cleanId,
      name,
      icon,
      image: image || "/placeholder.svg",
      count: 0,
      createdAt: new Date(),
    }

    await db.collection("collections").insertOne(newCollection)

    // Invalidate collections cache key
    invalidateCache(CACHE_KEY)

    return NextResponse.json(newCollection, { status: 201 })
  } catch (error: any) {
    console.error("POST collection error:", error)
    return NextResponse.json({ error: "Failed to create collection" }, { status: 500 })
  }
}
