import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { name, icon, image } = body

    if (!name || !icon) {
      return NextResponse.json(
        { error: "Missing required fields: name and icon are required." },
        { status: 400 }
      )
    }

    const result = await db.collection("collections").updateOne(
      { id: id },
      {
        $set: {
          name,
          icon,
          image: image || "/placeholder.svg",
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, id, name, icon, image })
  } catch (error: any) {
    console.error("PUT collection error:", error)
    return NextResponse.json({ error: "Failed to update collection" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()

    const result = await db.collection("collections").deleteOne({ id: id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Collection deleted successfully" })
  } catch (error: any) {
    console.error("DELETE collection error:", error)
    return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 })
  }
}
