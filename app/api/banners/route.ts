import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getCache, setCache, invalidateCache } from "@/lib/cache"

const CACHE_KEY = "banners_list"
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=600",
}

export async function GET() {
  try {
    // 1. Check in-memory cache first
    const cachedBanners = getCache(CACHE_KEY)
    if (cachedBanners) {
      return NextResponse.json(cachedBanners, { headers: CACHE_HEADERS })
    }

    // 2. Cache miss: Query MongoDB Atlas
    const { db } = await connectToDatabase()
    const banners = await db.collection("banners").find({}).sort({ createdAt: -1 }).toArray()
    
    // Map _id to id for easier frontend usage
    const formattedBanners = banners.map(banner => ({
      ...banner,
      id: banner._id.toString(),
      _id: undefined
    }))

    // 3. Set cache for 5 minutes
    setCache(CACHE_KEY, formattedBanners, 300)

    return NextResponse.json(formattedBanners, { headers: CACHE_HEADERS })
  } catch (error: any) {
    console.error("GET banners error:", error)
    return NextResponse.json([], { headers: CACHE_HEADERS }) // Fallback to empty array on DB error
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { tag, header, description, image, link, isActive } = body

    if (!image) {
      return NextResponse.json(
        { error: "Missing required fields: image is required." },
        { status: 400 }
      )
    }

    const newBanner = {
      tag: tag || "",
      header: header || "",
      description: description || "",
      image,
      link: link || "",
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date(),
    }

    const result = await db.collection("banners").insertOne(newBanner)
    
    // Invalidate banners cache
    invalidateCache(CACHE_KEY)

    return NextResponse.json({ ...newBanner, id: result.insertedId.toString() }, { status: 201 })
  } catch (error: any) {
    console.error("POST banner error:", error)
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 })
  }
}
