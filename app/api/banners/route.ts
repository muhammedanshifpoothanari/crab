import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    // Fetch all banners, sorted by order if available, or just by _id
    const banners = await db.collection("banners").find({}).sort({ createdAt: -1 }).toArray()
    
    // Map _id to id for easier frontend usage
    const formattedBanners = banners.map(banner => ({
      ...banner,
      id: banner._id.toString(),
      _id: undefined
    }))

    return NextResponse.json(formattedBanners)
  } catch (error: any) {
    console.error("GET banners error:", error)
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { image, link, isActive } = body

    if (!image) {
      return NextResponse.json(
        { error: "Missing required fields: image is required." },
        { status: 400 }
      )
    }

    const newBanner = {
      image,
      link: link || "",
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date(),
    }

    const result = await db.collection("banners").insertOne(newBanner)
    
    return NextResponse.json({ ...newBanner, id: result.insertedId.toString() }, { status: 201 })
  } catch (error: any) {
    console.error("POST banner error:", error)
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 })
  }
}
