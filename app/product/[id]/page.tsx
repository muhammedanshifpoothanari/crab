import { ProductDetail } from "@/components/product-detail"
import { connectToDatabase } from "@/lib/db"
import { notFound } from "next/navigation"
import { allProducts } from "@/lib/product-data"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const numericId = Number.parseInt(id)
  if (Number.isNaN(numericId)) return {}

  let product = null
  try {
    const { db } = await connectToDatabase()
    product = await db.collection("products").findOne({ id: numericId })
  } catch (error) {
    // Ignore db err on SEO meta
  }

  if (!product) {
    product = allProducts.find((p) => p.id === numericId)
  }

  if (!product) return {}

  return {
    title: `${product.name} - Custom Collectibles | CrabsCart`,
    description: product.description || `Buy personalized ${product.name} figurines at CrabsCart. High quality custom caricatures for special gifting moments.`,
    openGraph: {
      title: `${product.name} - Custom Collectibles | CrabsCart`,
      description: product.description,
      images: [product.image || "/placeholder.svg"],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const numericId = Number.parseInt(id)
  
  if (Number.isNaN(numericId)) {
    notFound()
  }

  let product = null
  try {
    const { db } = await connectToDatabase()
    product = await db.collection("products").findOne({ id: numericId })
  } catch (error) {
    console.error("Database connection failed on product detail page, using local product data:", error)
  }

  // Fallback to static product data if DB search yielded nothing
  if (!product) {
    product = allProducts.find((p) => p.id === numericId)
  }

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
