"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Star, Heart, RefreshCw, Zap } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import type { Product } from "@/lib/product-data"

export function Products() {
  const { addToCart, favorites, toggleFavorite } = useCart()
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

  const handleFavoriteClick = (productId: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(productId)
  }

  const bestSellers = products.slice(0, 8)

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 text-center w-full">
        <RefreshCw className="h-8 w-8 text-[#ec2652] animate-spin" />
        <p className="text-sm text-gray-500 font-semibold">Loading best vouchers...</p>
      </div>
    )
  }

  return (
    <section id="products" className="py-6 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg md:text-xl font-black text-slate-800">Trending Deals & Vouchers</h2>
          <Link href="/#categories" className="text-xs font-bold text-[#ec2652] hover:text-[#d41c45] transition-colors">
            View all
          </Link>
        </div>

        {/* Magicpin Voucher list */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4 scrollbar-none">
          {bestSellers.map((product) => {
            const isFav = !!favorites[product.id]
            const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            const pointsEarned = Math.round(product.price * 0.1) // 10% back in magicPoints

            return (
              <div key={product.id} className="w-[180px] md:w-auto flex-shrink-0">
                <Card className="group overflow-hidden border border-gray-100 bg-white rounded-2xl p-2.5 relative flex flex-col h-full hover:shadow-md transition-shadow duration-300">
                  
                  {/* Flat Discount Badge on top left of image */}
                  <span className="absolute top-4 left-4 z-10 px-2 py-1 text-[10px] font-black text-white bg-[#ec2652] rounded-md shadow-sm">
                    {discountPercentage}% OFF
                  </span>

                  {/* Favorite Button at top-right */}
                  <button
                    onClick={(e) => handleFavoriteClick(product.id, e)}
                    className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-gray-100 shadow-sm hover:scale-110 transition-transform duration-300"
                  >
                    <Heart
                      className={`h-3.5 w-3.5 transition-colors ${
                        isFav ? "fill-red-500 text-red-500" : "text-gray-400"
                      }`}
                    />
                  </button>

                  {/* Product Image */}
                  <Link href={`/product/${product.id}`} className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 mb-3">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Voucher Info */}
                  <div className="flex flex-col flex-1 px-1 justify-between gap-1">
                    <div>
                      <Link href={`/product/${product.id}`}>
                        <h3 className="text-xs font-extrabold text-slate-800 group-hover:text-[#ec2652] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-[10px] text-gray-400 font-semibold line-clamp-1 mt-0.5">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] text-gray-500 font-bold ml-0.5">4.8</span>
                        <span className="text-[9px] text-gray-400 font-medium">(110 reviews)</span>
                      </div>
                    </div>

                    {/* Reward Points Badge */}
                    <div className="flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-[#eefcf9] border border-emerald-100 rounded-md text-[9px] font-bold text-emerald-600 w-fit">
                      <Zap className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />
                      <span>+{pointsEarned} magicPoints</span>
                    </div>

                    <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-gray-50">
                      <span className="text-xs font-black text-slate-800">₹{product.price}</span>
                      <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full mt-2 py-2 bg-[#ec2652] hover:bg-[#d41c45] text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors duration-300"
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
    </section>
  )
}
