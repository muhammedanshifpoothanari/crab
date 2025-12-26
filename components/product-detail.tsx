"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowLeft, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/product-data"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  return (
    <div className="min-h-screen bg-background">
       <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link href={`/collections/${product.category}`}>
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Collection
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            <div className="absolute top-4 right-4">
              <Badge className="bg-accent text-accent-foreground">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
              </Badge>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">{product.name}</h1>
              <p className="text-lg text-muted-foreground text-pretty">{product.description}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-foreground">₹{product.price}</span>
              <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
              <Badge variant="secondary" className="text-sm">
                Save ₹{product.originalPrice - product.price}
              </Badge>
            </div>

            <Card className="p-4 bg-secondary/30">
              <p className="text-sm text-pretty">{product.details}</p>
            </Card>

            <div>
              <h3 className="font-semibold mb-3">Features:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-r-none"
                >
                  -
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="rounded-l-none"
                >
                  +
                </Button>
              </div>
              <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            <Card className="p-4 border-primary/20">
              <h3 className="font-semibold mb-2">How It Works</h3>
              <ol className="text-sm space-y-2 text-muted-foreground">
                <li>1. Add to cart and complete your order</li>
                <li>2. Upload your photos via email or WhatsApp</li>
                <li>3. We'll create a design preview for approval</li>
                <li>4. Receive your custom figurine in 7-10 days</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
        <Footer />
    </div>
  )
}
