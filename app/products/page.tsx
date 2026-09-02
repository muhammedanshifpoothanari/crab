"use client"

import { useEffect, useState, Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Star, Heart, RefreshCw, Zap, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import type { Product } from "@/lib/product-data"
import { useSearchParams, useRouter } from "next/navigation"

function ProductsContent() {
  const { addToCart, favorites, toggleFavorite } = useCart()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("popular")

  // Sync state with URL params if any
  useEffect(() => {
    const catParam = searchParams.get("category")
    if (catParam) {
      setSelectedCategory(catParam)
    }
  }, [searchParams])

  useEffect(() => {
    // Fetch products
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err)
        setLoading(false)
      })

    // Fetch categories
    fetch("/api/collections")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data)
        }
      })
      .catch((err) => console.error("Failed to fetch categories:", err))
  }, [])

  const handleFavoriteClick = (productId: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(productId)
  }

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory =
        selectedCategory === "all" ||
        String(product.categoryId) === selectedCategory ||
        product.category?.toLowerCase() === selectedCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return a.price - b.price
      }
      if (sortBy === "price-high") {
        return b.price - a.price
      }
      if (sortBy === "discount") {
        const discA = ((a.originalPrice - a.price) / a.originalPrice)
        const discB = ((b.originalPrice - b.price) / b.originalPrice)
        return discB - discA
      }
      // default: popularity / id
      return b.id - a.id
    })

  return (
    <main className="min-h-screen bg-slate-50/50 flex flex-col justify-between pt-24 pb-16">
      <Navbar />

      <section className="container mx-auto px-4 max-w-7xl mt-6">
        {/* Header Title */}
        <div className="mb-8 text-left">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">All Deals & Models</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse our complete collection of custom figurines and personalized models.</p>
        </div>

        {/* Filters Panel */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ec2652]/20 focus:border-[#ec2652]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category filter */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  router.push(`/products?category=${e.target.value}`, { scroll: false })
                }}
                className="h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ec2652]/20 focus:border-[#ec2652]"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ec2652]/20 focus:border-[#ec2652]"
              >
                <option value="popular">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
            <RefreshCw className="h-8 w-8 text-[#ec2652] animate-spin" />
            <p className="text-xs text-muted-foreground font-bold">Loading catalogue...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center border border-dashed rounded-3xl bg-white p-8">
            <SlidersHorizontal className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-slate-700">No items found</h3>
            <p className="text-xs text-muted-foreground mt-1">Try resetting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => {
              const isFav = !!favorites[product.id]
              const discountPercentage =
                product.originalPrice > product.price
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0
              const pointsEarned = Math.round(product.price * 0.1)

              return (
                <Card key={product.id} className="group overflow-hidden border border-gray-100 bg-white rounded-2xl p-2.5 relative flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
                  <div className="relative">
                    {/* Flat Discount Badge — only when there is a real discount */}
                    {discountPercentage > 0 && (
                      <span className="absolute top-2 left-2 z-10 px-1.5 py-0.5 text-[9px] font-black text-white bg-[#ec2652] rounded-md shadow-sm">
                        {discountPercentage}% OFF
                      </span>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => handleFavoriteClick(product.id, e)}
                      className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-gray-100 shadow-sm hover:scale-110 transition-transform duration-300 cursor-pointer"
                    >
                      <Heart className={`h-3 w-3 transition-colors ${isFav ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                    </button>

                    {/* Product Image */}
                    <Link href={`/product/${product.id}`} className="relative aspect-square w-full block overflow-hidden rounded-xl bg-gray-50 mb-3">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* Title & Description — clamped to keep all cards uniform height */}
                    <Link href={`/product/${product.id}`} className="text-left block">
                      <h3 className="text-xs font-extrabold text-slate-800 group-hover:text-[#ec2652] transition-colors line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-semibold line-clamp-2 mt-0.5 min-h-[2rem]">
                        {product.description}
                      </p>
                    </Link>

                    <div className="flex items-center gap-1 mt-1 text-left">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      <span className="text-[9px] text-gray-500 font-bold">4.8</span>
                    </div>

                    {pointsEarned > 0 && (
                      <div className="flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-[#eefcf9] border border-emerald-100 rounded-md text-[8px] font-bold text-emerald-600 w-fit">
                        <Zap className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />
                        <span>+{pointsEarned} magicPoints</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="flex items-baseline justify-between pt-2 border-t border-gray-50">
                      <span className="text-xs font-black text-slate-800">₹{product.price}</span>
                      <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full mt-2 py-2 bg-[#ec2652] hover:bg-[#d41c45] text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors duration-300 cursor-pointer"
                    >
                      Buy Now
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 text-[#ec2652] animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
