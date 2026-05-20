"use client"

import { Card } from "@/components/ui/card"
import { Users, Heart, Sparkles, Trophy, Briefcase, Zap, Music, Plane, Car, Dumbbell } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import type { Product } from "@/lib/product-data"

const iconMap: Record<string, any> = {
  Heart,
  Zap,
  Briefcase,
  Sparkles,
  Users,
  Trophy,
  Dumbbell,
  Music,
  Plane,
  Car,
}

export function Categories() {
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<{ id: string; name: string; icon: string; count: number }[]>([])

  useEffect(() => {
    // Fetch products
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data)
        }
      })
      .catch((err) => console.error("Categories product fetch failed:", err))

    // Fetch collections
    fetch("/api/collections")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCollections(data)
        }
      })
      .catch((err) => console.error("Collections fetch failed:", err))
  }, [])

  const getCollectionImage = (collectionId: string) => {
    const product = products.find((p) => p.category === collectionId)
    return product?.image || "/placeholder.svg?height=600&width=800"
  }

  return (
    <section id="categories" className="py-24 md:py-32 bg-gradient-to-b from-background via-background to-secondary/5">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-sm font-semibold tracking-wide">Collections</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl mb-6">
            Explore Our Collections
          </h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            Handcrafted figurines tailored for every personality, occasion, and passion
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {collections.map((collection) => {
            const Icon = iconMap[collection.icon] || Heart
            return (
              <Link key={collection.id} href={`/collections/${collection.id}`}>
                <Card className="group relative overflow-hidden border border-border/40 bg-card hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 h-full">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={getCollectionImage(collection.id) || "/placeholder.svg"}
                      alt={collection.name}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />

                    <div className="absolute bottom-5 left-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-background/80 backdrop-blur-xl shadow-2xl border border-border/50 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-500">
                      <Icon className="h-8 w-8" />
                    </div>

                    <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg">
                      <span className="text-xs font-semibold text-foreground">{collection.count} designs</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300 mb-1">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">Unique handcrafted pieces</p>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
