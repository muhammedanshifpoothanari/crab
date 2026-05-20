"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"

interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice: number
  image: string
}

interface ProductDetailModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailModal({ product, open, onOpenChange }: ProductDetailModalProps) {
  const { addToCart, whatsappCheckoutEnabled, adminWhatsAppNumber } = useCart()
  const router = useRouter()

  if (!product) return null

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  const handleAddToCart = () => {
    addToCart(product)
    onOpenChange(false)
  }

  const handleBuyItNow = () => {
    if (whatsappCheckoutEnabled) {
      const message = encodeURIComponent(`Hi! I am interested in purchasing ${product.name} (₹${product.price}) from CrabsCart. Please help me complete the order!`)
      window.open(`https://wa.me/${adminWhatsAppNumber}?text=${message}`, "_blank")
      onOpenChange(false)
      return
    }
    const savedPhone = typeof window !== "undefined" ? localStorage.getItem("customer_phone") : null
    if (!savedPhone) {
      addToCart(product)
      onOpenChange(false)
      return
    }
    addToCart(product)
    onOpenChange(false)
    router.push("/checkout")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            <Badge className="absolute top-4 right-4">{discount}% OFF</Badge>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(128 reviews)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">₹{product.price}</span>
              <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">✓</span>
                <span className="text-sm text-muted-foreground">100% Handcrafted</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">✓</span>
                <span className="text-sm text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">✓</span>
                <span className="text-sm text-muted-foreground">Delivery in 7-10 days</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              <Button size="lg" className="w-full gap-2" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                variant={whatsappCheckoutEnabled ? "default" : "outline"}
                size="lg"
                className={`w-full font-bold uppercase tracking-wider transition-all duration-300 ${
                  whatsappCheckoutEnabled 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg shadow-emerald-600/20" 
                    : "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow"
                }`}
                onClick={handleBuyItNow}
              >
                {whatsappCheckoutEnabled ? "Order via WhatsApp 💬" : "Buy It Now"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
