import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()

    const result = await db.collection("contacts").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Message deleted successfully" })
  } catch (error: any) {
    console.error("DELETE contact error:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}
