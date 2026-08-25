import { CollectionView } from "@/components/collection-view"
import { collections as staticCollections } from "@/lib/product-data"
import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function CollectionPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  
  let collection = null
  try {
    const { db } = await connectToDatabase()
    collection = await db.collection("collections").findOne({ id: category })
  } catch (e) {
    console.error("Failed to fetch collection from DB", e)
  }

  if (!collection) {
    collection = staticCollections.find((c) => c.id === category)
  }

  if (!collection) {
    notFound()
  }

  return <CollectionView category={category} collectionName={collection.name} />
}
