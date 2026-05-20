import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { orderedIds } = body

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: "orderedIds array is required." },
        { status: 400 }
      )
    }

    // Bulk update each collection's sortOrder based on its position in the array
    const bulkOps = orderedIds.map((id: string, index: number) => ({
      updateOne: {
        filter: { id },
        update: { $set: { sortOrder: index } },
      },
    }))

    await db.collection("collections").bulkWrite(bulkOps)

    return NextResponse.json({ success: true, message: "Collections reordered successfully" })
  } catch (error: any) {
    console.error("POST reorder error:", error)
    return NextResponse.json({ error: "Failed to reorder collections" }, { status: 500 })
  }
}
