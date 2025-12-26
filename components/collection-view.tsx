"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { getProductsByCategory } from "@/lib/product-data"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export function CollectionView({ category, collectionName }: { category: string; collectionName: string }) {
  const { addToCart } = useCart()
  const products = getProductsByCategory(category)

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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-border hover:shadow-lg transition-all">
              <Link href={`/product/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-muted cursor-pointer">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                    </div>
                  </div>
                </div>
              </Link>

              <div className="p-4 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-lg font-semibold hover:text-primary transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-foreground">₹{product.price}</span>
                  <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
                </div>

                <Button size="sm" className="w-full gap-2" onClick={() => addToCart(product)}>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
        <Footer />
    </div>
  )
}
