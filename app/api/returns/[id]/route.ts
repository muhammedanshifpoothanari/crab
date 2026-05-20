import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

async function recalculateOrderStatus(db: any, orderId: string) {
  const order = await db.collection("orders").findOne({ orderId })
  if (!order) return

  const originalTotalItems = order.items.reduce((sum: number, it: any) => sum + it.quantity, 0)
  
  const allReturns = await db.collection("returns").find({ orderId }).toArray()
  const totalReturnedSoFar = allReturns.reduce((sum: number, ret: any) => {
    return sum + ret.returnedItems.reduce((s: number, it: any) => s + it.quantity, 0)
  }, 0)

  let newOrderStatus = "Delivered" // Default back to delivered if no returns
  if (totalReturnedSoFar > 0) {
    newOrderStatus = totalReturnedSoFar >= originalTotalItems ? "Returned" : "Partially Returned"
  }

  let paymentStatus = order.paymentDetails?.paymentStatus || "Paid"
  if (totalReturnedSoFar > 0 && totalReturnedSoFar >= originalTotalItems) {
    paymentStatus = "Refunded"
  } else if (paymentStatus === "Refunded" && totalReturnedSoFar < originalTotalItems) {
    paymentStatus = "Paid" // Simplified fallback
  }

  await db.collection("orders").updateOne(
    { orderId },
    { 
      $set: { 
        status: newOrderStatus,
        "paymentDetails.paymentStatus": paymentStatus
      }
    }
  )
  return newOrderStatus
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { returnedItems, refundAmount, reason } = body

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid return ID format" }, { status: 400 })
    }

    const existingReturn = await db.collection("returns").findOne({ _id: new ObjectId(id) })
    if (!existingReturn) {
      return NextResponse.json({ error: "Return record not found" }, { status: 404 })
    }

    const updateFields: any = {}
    if (returnedItems !== undefined) updateFields.returnedItems = returnedItems
    if (refundAmount !== undefined) updateFields.refundAmount = Number(refundAmount)
    if (reason !== undefined) updateFields.reason = reason

    await db.collection("returns").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    )

    // Recalculate order status
    const newStatus = await recalculateOrderStatus(db, existingReturn.orderId)

    return NextResponse.json({ success: true, newStatus })
  } catch (error: any) {
    console.error("PUT return error:", error)
    return NextResponse.json({ error: "Failed to update return transaction" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid return ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    
    const existingReturn = await db.collection("returns").findOne({ _id: new ObjectId(id) })
    if (!existingReturn) {
      return NextResponse.json({ error: "Return record not found" }, { status: 404 })
    }

    const orderId = existingReturn.orderId

    const result = await db.collection("returns").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Return record not found" }, { status: 404 })
    }

    // Recalculate order status after deletion
    const newStatus = await recalculateOrderStatus(db, orderId)

    return NextResponse.json({ success: true, message: "Return deleted successfully", newStatus })
  } catch (error: any) {
    console.error("DELETE return error:", error)
    return NextResponse.json({ error: "Failed to delete return transaction" }, { status: 500 })
  }
}
