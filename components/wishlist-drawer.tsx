"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import type { Product } from "@/lib/product-data"

export function WishlistDrawer({ children }: { children: React.ReactNode }) {
  const { addToCart, favorites, toggleFavorite, phone, setPhone } = useCart()
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const [phoneNumberInput, setPhoneNumberInput] = useState("")

  const loadWishlist = () => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const liked = data.filter((p) => !!favorites[p.id])
          setWishlistItems(liked)
        }
      })
      .catch((err) => console.error("Failed to load wishlist products:", err))
  }

  // Reload wishlist items when drawer opens, when favorites changes, or when phone changes
  useEffect(() => {
    if (open && phone) {
      loadWishlist()
    }
  }, [open, favorites, phone])

  const removeFromWishlist = (productId: number) => {
    toggleFavorite(productId)
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product)
  }

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let cleanPhone = phoneNumberInput.replace(/[\s-+]/g, "")
    if (cleanPhone.startsWith("0091") && cleanPhone.length === 14) {
      cleanPhone = cleanPhone.substring(4)
    } else if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
      cleanPhone = cleanPhone.substring(2)
    } else if (cleanPhone.startsWith("0") && cleanPhone.length === 11) {
      cleanPhone = cleanPhone.substring(1)
    }
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(cleanPhone)) {
      alert("Please enter a valid 10-digit Indian Mobile Number")
      return
    }
    setPhone(cleanPhone)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-lg font-black text-slate-800">
            <Heart className="h-5 w-5 text-[#ec2652] fill-[#ec2652]" />
            My Wishlist {phone && `(${wishlistItems.length} items)`}
          </SheetTitle>
        </SheetHeader>

        {!phone ? (
          <div className="flex flex-col items-center justify-center h-[70vh] gap-6 text-center px-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <svg className="h-8 w-8 text-[#ec2652]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">Verify Your Mobile</h3>
              <p className="text-xs text-muted-foreground mt-2 max-w-[260px]">
                Please enter your 10-digit Mobile Number to view and retrieve your wishlist.
              </p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="w-full space-y-4 max-w-xs">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">+91</span>
                <input
                  type="tel"
                  required
                  placeholder="98765 43210"
                  value={phoneNumberInput}
                  onChange={(e) => setPhoneNumberInput(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background/85 pl-11 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <Button type="submit" className="w-full bg-[#ec2652] hover:bg-[#d41c45] font-bold h-10 text-white">
                Verify & Continue
              </Button>
            </form>

            <Button variant="ghost" className="text-xs text-muted-foreground uppercase mt-4 tracking-wider" onClick={() => setOpen(false)}>
              Back to Store
            </Button>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
            <Heart className="h-16 w-16 text-muted-foreground animate-pulse" />
            <p className="text-muted-foreground font-semibold">Your wishlist is empty</p>
            <p className="text-xs text-gray-400 max-w-[250px] text-center">
              Like your favorite customized vouchers to save them here!
            </p>
            <Button onClick={() => setOpen(false)} className="mt-4 w-full max-w-xs bg-slate-800 hover:bg-slate-900 text-white font-bold h-10">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-100px)] mt-4">
            <div className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
              {wishlistItems.map((item) => {
                const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                return (
                  <div key={item.id} className="flex gap-4 border-b pb-4 items-center">
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col gap-1 text-left min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 pr-2">
                          <h4 className="font-bold text-sm text-slate-800 truncate">{item.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-[#ec2652] flex-shrink-0"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-black text-slate-800">₹{item.price}</span>
                        <span className="text-xs text-muted-foreground line-through">₹{item.originalPrice}</span>
                        <span className="text-[10px] font-bold text-[#ec2652]">{discount}% OFF</span>
                      </div>

                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          className="flex-1 gap-1 text-[10px] h-8 bg-[#ec2652] hover:bg-[#d41c45] text-white"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart className="h-3 w-3" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="pt-4 border-t">
                <Button
                  onClick={() => setOpen(false)}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold h-10 uppercase tracking-wider"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
