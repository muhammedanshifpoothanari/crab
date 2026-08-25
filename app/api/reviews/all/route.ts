import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

// Admin-only: returns ALL reviews (pending + approved + rejected)
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const reviews = await db
      .collection("reviews")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    return NextResponse.json(reviews)
  } catch (error: any) {
    console.error("GET all reviews error:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
