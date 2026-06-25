"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Star, Heart, RefreshCw, Zap } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import type { Product } from "@/lib/product-data"

export function CategoryDeals() {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Record<number, boolean>>({})

  useEffect(() => {
    // Load wishlist
    const saved = localStorage.getItem("wishlist")
    if (saved) {
      try {
        setFavorites(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load category products:", err)
        setLoading(false)
      })
  }, [])

  const toggleFavorite = (productId: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => {
      const updated = {
        ...prev,
        [productId]: !prev[productId],
      }
      localStorage.setItem("wishlist", JSON.stringify(updated))
      return updated
    })
  }

  // Filter products by dynamic groups
  const diningDeals = products.filter((p) => p.category === "couples").slice(0, 4)
  const fashionDeals = products.filter((p) => p.category === "superheroes" || p.category === "sports").slice(0, 4)
  const corporateDeals = products.filter((p) => p.category === "professionals").slice(0, 4)

  if (loading || products.length === 0) return null

  const renderTrack = (title: string, items: Product[]) => {
    if (items.length === 0) return null
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-black text-slate-800">{title}</h3>
          <span className="text-[11px] font-bold text-gray-400">Scroll for more</span>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-3 scrollbar-none">
          {items.map((product) => {
            const isFav = !!favorites[product.id]
            const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            const pointsEarned = Math.round(product.price * 0.1)

            return (
              <div key={product.id} className="w-[170px] md:w-[220px] flex-shrink-0">
                <Card className="group overflow-hidden border border-gray-100 bg-white rounded-2xl p-2.5 relative flex flex-col h-full hover:shadow-md transition-shadow duration-300">
                  <span className="absolute top-4 left-4 z-10 px-2 py-0.5 text-[9px] font-black text-white bg-[#ec2652] rounded-md shadow-sm">
                    {discountPercentage}% OFF
                  </span>

                  <button
                    onClick={(e) => toggleFavorite(product.id, e)}
                    className="absolute top-4 right-4 z-10 p-1 rounded-full bg-white/95 border border-gray-100 shadow-sm"
                  >
                    <Heart className={`h-3 w-3 ${isFav ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                  </button>

                  <Link href={`/product/${product.id}`} className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 mb-3">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </Link>

                  <div className="flex flex-col flex-1 justify-between gap-1 text-left">
                    <div>
                      <Link href={`/product/${product.id}`}>
                        <h4 className="text-xs font-bold text-slate-800 truncate">{product.name}</h4>
                      </Link>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                        <span className="text-[9px] text-gray-500 font-bold">4.8</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-[#eefcf9] border border-emerald-100 rounded-md text-[8px] font-bold text-emerald-600 w-fit">
                      <Zap className="h-2 w-2 fill-emerald-500 text-emerald-500" />
                      <span>+{pointsEarned} points</span>
                    </div>

                    <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-gray-50">
                      <span className="text-xs font-black text-slate-800">₹{product.price}</span>
                      <span className="text-[9px] text-gray-400 line-through">₹{product.originalPrice}</span>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full mt-2 py-1.5 bg-[#ec2652] hover:bg-[#d41c45] text-white font-extrabold text-[10px] rounded-xl transition-colors duration-300"
                    >
                      Get Voucher
                    </button>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <section className="py-2 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {renderTrack("Best in Dining & Food Vouchers", diningDeals)}
        {renderTrack("Top in Fashion & Active Vouchers", fashionDeals)}
        {renderTrack("Premium Corporate Gift Vouchers", corporateDeals)}
      </div>
    </section>
  )
}
