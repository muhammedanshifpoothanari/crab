"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart, ArrowLeft, RefreshCw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/product-data"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const PRODUCTS_CACHE_KEY = "crabscart_products_v1"

export function CollectionView({ category, collectionName }: { category: string; collectionName: string }) {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Step 1: Serve from localStorage cache instantly (zero lag)
    try {
      const cached = localStorage.getItem(PRODUCTS_CACHE_KEY)
      if (cached) {
        const all = JSON.parse(cached)
        if (Array.isArray(all)) {
          const filtered = all.filter((p: Product) => p.category === category)
          if (filtered.length > 0) {
            setProducts(filtered)
            setLoading(false)
          }
        }
      }
    } catch (_) {}

    // Step 2: Silently revalidate from API
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          try { localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(data)) } catch (_) {}
          setProducts(data.filter((p) => p.category === category))
        } else {
          console.error("Non-array data received:", data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load collection products:", err)
        setLoading(false)
      })
  }, [category])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link href="/#categories">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Collections
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">{collectionName} Collection</h1>
          <p className="text-muted-foreground text-lg">{products.length} unique designs available</p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-center w-full">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-semibold">Loading collection...</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const discountPercentage =
                product.originalPrice > product.price
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0
              return (
                <Card key={product.id} className="group overflow-hidden border-border hover:shadow-lg transition-all flex flex-col">
                  <Link href={`/product/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden bg-muted cursor-pointer">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      {discountPercentage > 0 && (
                        <div className="absolute top-4 right-4">
                          <div className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                            {discountPercentage}% off
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Card body — flex-col so button is always pinned to bottom */}
                  <div className="p-4 flex flex-col flex-1 gap-2">
                    <div className="flex flex-col gap-1">
                      <Link href={`/product/${product.id}`}>
                        {/* Clamp to 2 lines — keeps all cards same height */}
                        <h3 className="text-sm font-bold leading-snug hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                    </div>

                    {/* mt-auto pushes price + button to the bottom of every card */}
                    <div className="mt-auto pt-2 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <Button size="sm" className="w-full gap-2" onClick={() => addToCart(product)}>
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
      )}
      </div>
        <Footer />
    </div>
  )
}
