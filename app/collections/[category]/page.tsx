import { CollectionView } from "@/components/collection-view"
import { collections } from "@/lib/product-data"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return collections.map((collection) => ({
    category: collection.id,
  }))
}

export default function CollectionPage({ params }: { params: { category: string } }) {
  const collection = collections.find((c) => c.id === params.category)

  if (!collection) {
    notFound()
  }

  return <CollectionView category={params.category} collectionName={collection.name} />
}
