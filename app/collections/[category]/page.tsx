import { CollectionView } from "@/components/collection-view"
import { collections } from "@/lib/product-data"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return collections.map((collection) => ({
    category: collection.id,
  }))
}

export default async function CollectionPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const collection = collections.find((c) => c.id === category)

  if (!collection) {
    notFound()
  }

  return <CollectionView category={category} collectionName={collection.name} />
}
