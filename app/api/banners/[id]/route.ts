import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"
import { invalidateCache } from "@/lib/cache"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { tag, header, description, image, link, isActive } = body

    const updateFields: any = {}
    if (tag !== undefined) updateFields.tag = tag
    if (header !== undefined) updateFields.header = header
    if (description !== undefined) updateFields.description = description
    if (image !== undefined) updateFields.image = image
    if (link !== undefined) updateFields.link = link
    if (isActive !== undefined) updateFields.isActive = isActive

    const result = await db.collection("banners").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    // Invalidate banners cache
    invalidateCache("banners_list")

    return NextResponse.json({ message: "Banner updated successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("PUT banner error:", error)
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()

    const result = await db.collection("banners").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    // Invalidate banners cache
    invalidateCache("banners_list")

    return NextResponse.json({ message: "Banner deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("DELETE banner error:", error)
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 })
  }
}
