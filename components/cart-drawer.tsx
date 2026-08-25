"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

import { useState } from "react"

export function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    total,
    discount,
    discountPercentage,
    itemCount,
    clearCart,
    promoCode,
    applyPromoCode,
    whatsappCheckoutEnabled,
    adminWhatsAppNumber,
  } = useCart()

  const [couponInput, setCouponInput] = useState("")

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (couponInput.trim()) {
      applyPromoCode(couponInput)
      setCouponInput("")
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {itemCount}
            </Badge>
          )}
          <span className="sr-only">Cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({itemCount} items)</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button>Start Shopping</Button>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-120px)]">
            <div className="flex-1 overflow-y-auto py-6 px-2">
              {/* Dynamic Combo deals motivator */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-accent/5 to-primary/5 border border-primary/20">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Bundle Savings Deal</p>
                {itemCount === 1 ? (
                  <p className="text-sm text-foreground">
                    Buy <span className="font-bold text-accent">1 more product</span> to instantly unlock a <strong>10% Combo Discount!</strong>
                  </p>
                ) : itemCount === 2 ? (
                  <p className="text-sm text-foreground">
                    🎉 <strong>10% Combo Discount active!</strong> Add <span className="font-bold text-accent">1 more product</span> to hit <strong>15% off!</strong>
                  </p>
                ) : (
                  <p className="text-sm text-emerald-500 font-medium">
                    🎉 <strong>15% Super Combo Discount active!</strong> Awesome savings unlocked!
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-semibold text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Coupon Form & Totals */}
            <div className="border-t pt-4 space-y-4 px-2">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code (COMBO20)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm bg-secondary/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground/60"
                />
                <Button type="submit" variant="secondary" className="h-9">
                  Apply Code
                </Button>
              </form>

              {promoCode && (
                <div className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5">
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5">
                    {promoCode}
                  </Badge>
                  Applied successfully!
                </div>
              )}

              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-500 font-semibold">
                    <span>Combo Discount ({discountPercentage}%):</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {whatsappCheckoutEnabled ? (
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12" 
                  size="lg"
                  onClick={async () => {
                    const itemsSummary = items.map(item => `${item.quantity}x ${item.name} (₹${item.price} each)`).join(", ")
                    const message = encodeURIComponent(`Hi! I'd like to place an order for the following items in my cart: [ ${itemsSummary} ]. Total Amount: ₹${total}. Please let me know how to complete my payment!`)
                    window.open(`https://wa.me/${adminWhatsAppNumber}?text=${message}`, "_blank")
                    // Silently create a Cold order so admin can follow up
                    try {
                      await fetch("/api/orders", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          items: items.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity, image: item.image })),
                          total,
                          paymentMethod: "WhatsApp",
                          status: "Cold",
                        }),
                      })
                    } catch (e) {
                      // Silent fail — WhatsApp already opened
                    }
                  }}
                >
                  Checkout via WhatsApp 💬
                </Button>
              ) : (
                <SheetTrigger asChild>
                  <Link href="/checkout" className="w-full">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </SheetTrigger>
              )}
              <Button variant="outline" className="w-full bg-transparent text-muted-foreground" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
