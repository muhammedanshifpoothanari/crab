import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const phone = searchParams.get("phone")

    const { db } = await connectToDatabase()

    let query = {}
    if (phone) {
      query = { "customer.phone": phone.trim() }
    } else if (email) {
      // Search orders for specific user (case insensitive)
      query = { "customer.email": { $regex: new RegExp(`^${email.trim()}$`, "i") } }
    }

    const orders = await db.collection("orders").find(query).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(orders)
  } catch (error: any) {
    console.error("GET orders error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { customer, items, total, paymentMethod, paymentDetails, status } = body

    const isColdOrder = status === "Cold"

    // Cold orders (WhatsApp leads) only need items + total
    // Regular orders require full customer + items + total
    if (!isColdOrder) {
      if (
        !customer ||
        !customer.name ||
        !customer.email ||
        !customer.address ||
        !items ||
        items.length === 0 ||
        !total
      ) {
        return NextResponse.json({ error: "Missing required order/checkout details" }, { status: 400 })
      }
    } else {
      if (!items || items.length === 0 || !total) {
        return NextResponse.json({ error: "Cold order requires at least items and total" }, { status: 400 })
      }
    }

    // Generate unique 6-digit e-commerce Order ID, prefix with CC
    const randomCode = Math.floor(100000 + Math.random() * 900000)
    const orderId = `CC-${randomCode}`

    const newOrder = {
      orderId,
      customer: {
        name: customer?.name?.trim() || "WhatsApp Lead",
        email: customer?.email?.trim() || "crabscart@gmail.com",
        phone: customer?.phone?.trim() || "",
        address: customer?.address?.trim() || "",
        city: customer?.city?.trim() || "",
        state: customer?.state?.trim() || "",
        zip: customer?.zip?.trim() || "",
      },
      items,
      total: Number(total),
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentDetails: paymentDetails || { paymentStatus: isColdOrder ? "WhatsApp Lead" : "Pending COD verification" },
      status: status || "Pending",
      trackingNumber: body.trackingNumber || "",
      createdAt: new Date(),
    }

    await db.collection("orders").insertOne(newOrder)
    try {
      if (customer?.phone) {
        await db.collection("abandoned_carts").deleteOne({ phone: customer.phone.trim() })
      }
    } catch (e) {
      console.error("Failed to clear abandoned cart:", e)
    }
    return NextResponse.json(newOrder, { status: 201 })
  } catch (error: any) {
    console.error("POST order error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
