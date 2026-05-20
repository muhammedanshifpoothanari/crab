import { ProductDetail } from "@/components/product-detail"
import { connectToDatabase } from "@/lib/db"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const numericId = Number.parseInt(id)
  
  if (Number.isNaN(numericId)) {
    notFound()
  }

  const { db } = await connectToDatabase()
  const product = await db.collection("products").findOne({ id: numericId })

  if (!product) {
    notFound()
  }

  // Sanitize fields to ensure they are 100% plain serializable JSON
  const serializableProduct = {
    id: product.id,
    name: product.name,
    description: product.description || "",
    price: Number(product.price),
    originalPrice: Number(product.originalPrice || product.price),
    image: product.image || "/placeholder.svg",
    category: product.category || "couples",
    details: product.details || "",
    features: Array.isArray(product.features) ? product.features : [],
  }

  return <ProductDetail product={serializableProduct} />
}
