import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

// GET: Validate a specific code or return all coupons
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const { db } = await connectToDatabase()

    if (code) {
      const coupon = await db.collection("coupons").findOne({
        code: code.trim().toUpperCase(),
        isActive: true
      })
      if (!coupon) {
        return NextResponse.json({ error: "Invalid or expired promo code" }, { status: 404 })
      }
      return NextResponse.json(coupon)
    }

    const coupons = await db.collection("coupons").find({}).toArray()
    return NextResponse.json(coupons)
  } catch (error: any) {
    console.error("GET coupons error:", error)
    return NextResponse.json({ error: "Failed to load coupons" }, { status: 500 })
  }
}

// POST: Create or update a coupon code
export async function POST(request: Request) {
  try {
    const { id, code, discountPct, isActive } = await request.json()
    const { db } = await connectToDatabase()

    if (!code || typeof discountPct !== "number") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const payload = {
      code: code.trim().toUpperCase(),
      discountPct: Math.min(100, Math.max(1, discountPct)),
      isActive: isActive ?? true,
      updatedAt: new Date()
    }

    if (id) {
      await db.collection("coupons").updateOne(
        { _id: new ObjectId(id) },
        { $set: payload }
      )
      return NextResponse.json({ success: true, message: "Coupon updated successfully" })
    } else {
      // Check duplicate
      const existing = await db.collection("coupons").findOne({ code: payload.code })
      if (existing) {
        return NextResponse.json({ error: "Promo code already exists" }, { status: 400 })
      }
      const result = await db.collection("coupons").insertOne({
        ...payload,
        createdAt: new Date()
      })
      return NextResponse.json({ success: true, id: result.insertedId })
    }
  } catch (error: any) {
    console.error("POST coupons error:", error)
    return NextResponse.json({ error: "Failed to save coupon" }, { status: 500 })
  }
}

// DELETE: Delete a coupon code
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const { db } = await connectToDatabase()

    if (!id) {
      return NextResponse.json({ error: "Missing coupon identifier" }, { status: 400 })
    }

    await db.collection("coupons").deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true, message: "Coupon deleted" })
  } catch (error: any) {
    console.error("DELETE coupon error:", error)
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 })
  }
}
