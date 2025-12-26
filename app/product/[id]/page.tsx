import { ProductDetail } from "@/components/product-detail"
import { allProducts } from "@/lib/product-data"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id.toString(),
  }))
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = allProducts.find((p) => p.id === Number.parseInt(id))

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
