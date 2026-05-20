import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: Promise<{ phone: string }> }) {
  try {
    const { phone } = await params
    const decodedPhone = decodeURIComponent(phone).trim()
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { name, email, address, city, state, zip } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const updateFields: any = {
      "customer.name": name,
    }
    if (email !== undefined) updateFields["customer.email"] = email
    if (address !== undefined) updateFields["customer.address"] = address
    if (city !== undefined) updateFields["customer.city"] = city
    if (state !== undefined) updateFields["customer.state"] = state
    if (zip !== undefined) updateFields["customer.zip"] = zip

    const result = await db.collection("orders").updateMany(
      { "customer.phone": decodedPhone },
      { $set: updateFields }
    )

    return NextResponse.json({
      success: true,
      message: `Successfully updated profile across ${result.modifiedCount} orders`,
      modifiedCount: result.modifiedCount,
    })
  } catch (error: any) {
    console.error("PUT customer error:", error)
    return NextResponse.json({ error: "Failed to update customer details" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ phone: string }> }) {
  try {
    const { phone } = await params
    const decodedPhone = decodeURIComponent(phone).trim()
    const { db } = await connectToDatabase()

    // 1. Find all order IDs for this customer
    const userOrders = await db
      .collection("orders")
      .find({ "customer.phone": decodedPhone }, { projection: { orderId: 1 } })
      .toArray()
    
    const orderIds = userOrders.map((o) => o.orderId)

    // 2. Delete all matching returns
    if (orderIds.length > 0) {
      await db.collection("returns").deleteMany({ orderId: { $in: orderIds } })
    }

    // 3. Delete all matching orders
    const result = await db.collection("orders").deleteMany({ "customer.phone": decodedPhone })

    return NextResponse.json({
      success: true,
      message: `Successfully purged customer profile. Deleted ${result.deletedCount} orders and associated returns.`,
      deletedCount: result.deletedCount,
    })
  } catch (error: any) {
    console.error("DELETE customer error:", error)
    return NextResponse.json({ error: "Failed to delete customer data" }, { status: 500 })
  }
}
