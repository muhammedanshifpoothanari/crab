import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const reviews = await db
      .collection("reviews")
      .find({ status: "approved" })
      .sort({ createdAt: -1 })
      .toArray()
    return NextResponse.json(reviews)
  } catch (error: any) {
    console.error("GET reviews error:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { name, role, content, rating } = body

    if (!name || !content || !rating) {
      return NextResponse.json(
        { error: "Name, review content, and rating are required" },
        { status: 400 }
      )
    }

    const newReview = {
      name: name.trim(),
      role: role?.trim() || "Customer",
      content: content.trim(),
      rating: Math.min(5, Math.max(1, Number(rating))),
      status: "pending",
      createdAt: new Date(),
    }

    await db.collection("reviews").insertOne(newReview)

    return NextResponse.json(
      { success: true, message: "Review submitted! It will appear after admin approval." },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("POST review error:", error)
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}
