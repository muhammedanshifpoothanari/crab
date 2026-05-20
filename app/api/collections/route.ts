import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { collections as initialCollections } from "@/lib/product-data"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    let collections = await db.collection("collections").find({}).sort({ sortOrder: 1 }).toArray()

    // Auto-seed if empty
    if (collections.length === 0) {
      console.log("Seeding collections into MongoDB Atlas...")
      await db.collection("collections").insertMany(initialCollections)
      collections = await db.collection("collections").find({}).toArray()
    }

    return NextResponse.json(collections)
  } catch (error: any) {
    console.error("GET collections error:", error)
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 })
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
    return NextResponse.json(newCollection, { status: 201 })
  } catch (error: any) {
    console.error("POST collection error:", error)
    return NextResponse.json({ error: "Failed to create collection" }, { status: 500 })
  }
}
