"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart, Star, Heart, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import type { Product } from "@/lib/product-data"

export function Products() {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          console.error("Non-array data received:", data)
          setProducts([])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load storefront products:", err)
        setLoading(false)
      })
  }, [])

  const featuredProducts = products.slice(0, 6)

  return (
    <section id="products" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-accent/5 border border-accent/10">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-accent text-sm font-semibold tracking-wide">Featured</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl mb-6">
            Premium Collection
          </h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            Handcrafted personalized figurines made with exceptional attention to detail
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-center w-full">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-semibold">Loading standard collectibles...</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col bg-card"
            >
              <Link href={`/product/${product.id}`} className="relative">
                <div className="relative aspect-square overflow-hidden rounded-t-xl bg-muted">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute top-4 left-4">
                    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform duration-300">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur-sm px-3 py-1.5 shadow-lg">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="text-xs font-semibold">4.9</span>
                  </div>
                </div>
              </Link>

              <div className="p-5 flex flex-col gap-4 flex-1">
                <div className="flex flex-col gap-2 flex-1">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-lg font-semibold hover:text-primary transition-colors duration-300 leading-snug line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{product.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold">₹{product.price}</span>
                    <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                  </div>
                  <div className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                </div>

                <Button
                  className="w-full gap-2 h-11 shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

        <div className="mt-20 text-center">
          <Link href="/#categories">
            <Button
              size="lg"
              variant="outline"
              className="shadow-sm hover:shadow-md hover:bg-secondary/50 transition-all px-10 h-12 font-semibold bg-transparent"
            >
              View All Collections
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
