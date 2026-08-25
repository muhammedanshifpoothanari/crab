import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { status } = body // "approved" | "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Status must be 'approved' or 'rejected'" }, { status: 400 })
    }

    const result = await db.collection("reviews").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after" }
    )

    if (!result) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("PUT review error:", error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()

    const result = await db.collection("reviews").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Review deleted" })
  } catch (error: any) {
    console.error("DELETE review error:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}
