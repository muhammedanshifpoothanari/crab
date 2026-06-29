"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import type { Product } from "@/lib/product-data"

export function WishlistDrawer({ children }: { children: React.ReactNode }) {
  const { addToCart, favorites, toggleFavorite } = useCart()
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [open, setOpen] = useState(false)

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

  // Reload wishlist items when drawer opens or when favorites changes
  useEffect(() => {
    if (open) {
      loadWishlist()
    }
  }, [open, favorites])

  const removeFromWishlist = (productId: number) => {
    toggleFavorite(productId)
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-lg font-black text-slate-800">
            <Heart className="h-5 w-5 text-[#ec2652] fill-[#ec2652]" />
            My Wishlist ({wishlistItems.length} items)
          </SheetTitle>
        </SheetHeader>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
            <Heart className="h-16 w-16 text-muted-foreground animate-pulse" />
            <p className="text-muted-foreground font-semibold">Your wishlist is empty</p>
            <p className="text-xs text-gray-400 max-w-[250px] text-center">
              Like your favorite customized vouchers to save them here!
            </p>
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
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
