import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params // E.g., 'CC-123456'

    const { db } = await connectToDatabase()
    const order = await db.collection("orders").findOne({ orderId: id })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error("GET order details error:", error)
    return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params // E.g., 'CC-123456'

    const { db } = await connectToDatabase()
    const body = await request.json()
    const { status, trackingNumber, customerName, customerPhone, customerEmail, customerAddress, paymentStatus } = body

    const updateFields: any = {}
    if (status !== undefined) updateFields.status = status
    if (trackingNumber !== undefined) updateFields.trackingNumber = trackingNumber
    if (customerName !== undefined) {
      updateFields["customer.name"] = customerName
    }
    if (customerPhone !== undefined) {
      updateFields["customer.phone"] = customerPhone
    }
    if (customerEmail !== undefined) {
      updateFields["customer.email"] = customerEmail
    }
    if (customerAddress !== undefined) {
      updateFields["customer.address"] = customerAddress
    }
    if (paymentStatus !== undefined) {
      updateFields["paymentDetails.paymentStatus"] = paymentStatus
    }

    const result = await db.collection("orders").findOneAndUpdate(
      { orderId: id },
      { $set: updateFields },
      { returnDocument: "after" }
    )

    if (!result) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("PUT order status error:", error)
    return NextResponse.json({ error: "Failed to update order details" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()

    // 1. Delete order
    const orderResult = await db.collection("orders").deleteOne({ orderId: id })

    if (orderResult.deletedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // 2. Delete associated returns
    await db.collection("returns").deleteMany({ orderId: id })

    return NextResponse.json({ success: true, message: "Order and associated returns deleted successfully" })
  } catch (error: any) {
    console.error("DELETE order error:", error)
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
  }
}
