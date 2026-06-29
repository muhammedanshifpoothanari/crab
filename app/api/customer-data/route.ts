import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get("phone")

    if (!phone) {
      return NextResponse.json({ error: "Phone parameter is required" }, { status: 400 })
    }

    const cleanPhone = phone.trim()
    const { db } = await connectToDatabase()

    // Query both cart and wishlist in parallel
    const [cartData, wishlistData] = await Promise.all([
      db.collection("abandoned_carts").findOne({ phone: cleanPhone }),
      db.collection("abandoned_wishlists").findOne({ phone: cleanPhone })
    ])

    return NextResponse.json({
      cartItems: cartData?.items || [],
      wishlistItems: wishlistData?.items || []
    })
  } catch (error: any) {
    console.error("GET customer-data error:", error)
    return NextResponse.json({ error: "Failed to fetch customer data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { phone, cartItems, wishlistItems } = body

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    const cleanPhone = phone.trim()
    const updates: Promise<any>[] = []

    // 1. Sync cart if provided
    if (cartItems !== undefined) {
      if (cartItems.length === 0) {
        updates.push(db.collection("abandoned_carts").deleteOne({ phone: cleanPhone }))
      } else {
        const total = cartItems.reduce((sum: number, item: any) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0)
        updates.push(
          db.collection("abandoned_carts").updateOne(
            { phone: cleanPhone },
            {
              $set: {
                phone: cleanPhone,
                items: cartItems,
                total,
                updatedAt: new Date()
              }
            },
            { upsert: true }
          )
        )
      }
    }

    // 2. Sync wishlist if provided
    if (wishlistItems !== undefined) {
      if (wishlistItems.length === 0) {
        updates.push(db.collection("abandoned_wishlists").deleteOne({ phone: cleanPhone }))
      } else {
        updates.push(
          db.collection("abandoned_wishlists").updateOne(
            { phone: cleanPhone },
            {
              $set: {
                phone: cleanPhone,
                items: wishlistItems,
                updatedAt: new Date()
              }
            },
            { upsert: true }
          )
        )
      }
    }

    await Promise.all(updates)
    return NextResponse.json({ success: true, message: "Customer data synchronized" })
  } catch (error: any) {
    console.error("POST customer-data error:", error)
    return NextResponse.json({ error: "Failed to sync customer data" }, { status: 500 })
  }
}
