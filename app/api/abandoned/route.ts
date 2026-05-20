import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get("phone")
    const { db } = await connectToDatabase()

    if (phone) {
      const lead = await db.collection("abandoned_carts").findOne({ phone: phone.trim() })
      return NextResponse.json(lead || null)
    }

    const leads = await db.collection("abandoned_carts").find({}).sort({ updatedAt: -1 }).toArray()
    return NextResponse.json(leads)
  } catch (error: any) {
    console.error("GET abandoned carts error:", error)
    return NextResponse.json({ error: "Failed to fetch abandoned carts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { phone, items, total } = body

    if (!phone) {
      return NextResponse.json({ error: "Missing phone number" }, { status: 400 })
    }

    const cleanPhone = phone.trim()

    if (!items || items.length === 0) {
      await db.collection("abandoned_carts").deleteOne({ phone: cleanPhone })
      return NextResponse.json({ success: true, message: "Cleared abandoned cart lead" })
    }

    // Save or update the abandoned cart linked to this mobile number
    const result = await db.collection("abandoned_carts").updateOne(
      { phone: cleanPhone },
      {
        $set: {
          phone: cleanPhone,
          items,
          total: Number(total),
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true, message: "Abandoned cart synchronized" })
  } catch (error: any) {
    console.error("POST abandoned cart error:", error)
    return NextResponse.json({ error: "Failed to record abandoned cart" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get("phone")

    if (phone) {
      await db.collection("abandoned_carts").deleteOne({ phone: phone.trim() })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("DELETE abandoned cart error:", error)
    return NextResponse.json({ error: "Failed to delete abandoned cart" }, { status: 500 })
  }
}
