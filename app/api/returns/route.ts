import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const returns = await db.collection("returns").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(returns)
  } catch (error: any) {
    console.error("GET returns error:", error)
    return NextResponse.json({ error: "Failed to fetch return records" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { orderId, returnedItems, refundAmount, reason } = body

    if (!orderId || !returnedItems || returnedItems.length === 0) {
      return NextResponse.json({ error: "Missing required return details" }, { status: 400 })
    }

    // Generate unique return tracking ID
    const returnId = `RET-${Math.floor(100000 + Math.random() * 900000)}`

    // Fetch the original order
    const order = await db.collection("orders").findOne({ orderId })
    if (!order) {
      return NextResponse.json({ error: "Original order not found" }, { status: 404 })
    }

    const returnDoc = {
      returnId,
      orderId,
      customer: {
        name: order.customer.name || "Valued Customer",
        phone: order.customer.phone,
        email: order.customer.email || "",
      },
      returnedItems,
      refundAmount: Number(refundAmount) || 0,
      reason: reason || "Standard Return",
      status: "Processed",
      createdAt: new Date().toISOString(),
    }

    // Insert return record
    await db.collection("returns").insertOne(returnDoc)

    // Calculate total items currently returned vs originally ordered to decide if full or partial return
    const originalTotalItems = order.items.reduce((sum: number, it: any) => sum + it.quantity, 0)
    
    // Fetch previous returns for this order to compute running totals
    const previousReturns = await db.collection("returns").find({ orderId }).toArray()
    const totalReturnedSoFar = previousReturns.reduce((sum: number, ret: any) => {
      return sum + ret.returnedItems.reduce((s: number, it: any) => s + it.quantity, 0)
    }, 0)

    const newOrderStatus = totalReturnedSoFar >= originalTotalItems ? "Returned" : "Partially Returned"

    // Update original order status and insert a history timeline entry
    await db.collection("orders").updateOne(
      { orderId },
      { 
        $set: { 
          status: newOrderStatus,
          "paymentDetails.paymentStatus": totalReturnedSoFar >= originalTotalItems ? "Refunded" : order.paymentDetails?.paymentStatus || "Paid"
        }
      }
    )

    return NextResponse.json({ success: true, returnId, newStatus: newOrderStatus })
  } catch (error: any) {
    console.error("POST return processing error:", error)
    return NextResponse.json({ error: "Failed to process return transaction" }, { status: 500 })
  }
}
