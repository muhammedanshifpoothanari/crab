import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const numericId = Number.parseInt(id)
    if (Number.isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const body = await request.json()
    const { name, description, price, originalPrice, image, additionalImages, category, details, features, barcode, showHowItWorks } = body

    const updateFields: any = {}
    if (name !== undefined) updateFields.name = name
    if (description !== undefined) updateFields.description = description
    if (price !== undefined) updateFields.price = Number(price)
    if (originalPrice !== undefined) updateFields.originalPrice = Number(originalPrice)
    if (image !== undefined) updateFields.image = image
    if (additionalImages !== undefined) updateFields.additionalImages = additionalImages
    if (category !== undefined) updateFields.category = category
    if (details !== undefined) updateFields.details = details
    if (features !== undefined) updateFields.features = features
    if (barcode !== undefined) updateFields.barcode = barcode
    if (showHowItWorks !== undefined) updateFields.showHowItWorks = showHowItWorks

    const result = await db.collection("products").findOneAndUpdate(
      { id: numericId },
      { $set: updateFields },
      { returnDocument: "after" }
    )

    if (!result) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("PUT product error:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const numericId = Number.parseInt(id)
    if (Number.isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("products").deleteOne({ id: numericId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" })
  } catch (error: any) {
    console.error("DELETE product error:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
