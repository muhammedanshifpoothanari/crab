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
import { useRouter } from "next/navigation"

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart, whatsappCheckoutEnabled, adminWhatsAppNumber } = useCart()
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const handleBuyItNow = () => {
    if (whatsappCheckoutEnabled) {
      const message = encodeURIComponent(`Hi! I am interested in purchasing ${quantity}x ${product.name} (₹${product.price} each) from CrabsCart. Please help me complete the order!`)
      window.open(`https://wa.me/${adminWhatsAppNumber}?text=${message}`, "_blank")
      return
    }
    addToCart(product, quantity)
    const savedPhone = typeof window !== "undefined" ? localStorage.getItem("customer_phone") : null
    if (savedPhone) {
      router.push("/checkout")
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
          {/* Left Column: Image */}
          <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-2xl border border-border/50 bg-secondary/10">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right Column: Content */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
                {product.category}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                {product.name}
              </h1>
              <p className="text-xl md:text-2xl font-semibold text-primary">
                ₹{product.price}
                {product.originalPrice && (
                  <span className="text-base text-muted-foreground line-through ml-3 font-normal">
                    ₹{product.originalPrice}
                  </span>
                )}
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Product Details</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.details}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Key Features</h3>
              <ul className="grid gap-2 text-sm">
                {product.features?.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
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
              <Button
                variant="default"
                size="lg"
                className={`w-full font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 h-12 ${
                  whatsappCheckoutEnabled 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                    : "bg-gradient-to-r from-accent via-primary to-accent hover:from-primary hover:to-accent text-primary-foreground"
                }`}
                onClick={handleBuyItNow}
              >
                {whatsappCheckoutEnabled ? "Order via WhatsApp 💬" : "Buy It Now (Direct Checkout)"}
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
