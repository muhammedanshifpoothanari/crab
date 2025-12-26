import { ProductDetail } from "@/components/product-detail"
import { allProducts } from "@/lib/product-data"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id.toString(),
  }))
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = allProducts.find((p) => p.id === Number.parseInt(params.id))

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
