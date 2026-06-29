import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const leads = await db.collection("abandoned_wishlists").find({}).sort({ updatedAt: -1 }).toArray()
    return NextResponse.json(leads)
  } catch (error: any) {
    console.error("GET abandoned wishlists error:", error)
    return NextResponse.json({ error: "Failed to fetch abandoned wishlists" }, { status: 500 })
  }
}
