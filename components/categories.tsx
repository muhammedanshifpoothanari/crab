"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import type { Product } from "@/lib/product-data"

export function Categories() {
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<{ id: string; name: string; icon: string; count: number; image?: string }[]>([])

  useEffect(() => {
    // Fetch products
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data)
        }
      })
      .catch((err) => console.error("Categories product fetch failed:", err))

    // Fetch collections
    fetch("/api/collections")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCollections(data)
        }
      })
      .catch((err) => console.error("Collections fetch failed:", err))
  }, [])

  const getCollectionImage = (collectionId: string) => {
    const catImages: Record<string, string> = {
      couples: "/romantic-couple-figurine-standing-together.jpg",
      superheroes: "/flying-superhero-figurine-cape.jpg",
      professionals: "/doctor-figurine-with-stethoscope-white-coat.jpg",
      wedding: "/wedding-cake-topper-bride-groom.jpg",
      family: "/family-of-three-figurine-parents-child.jpg",
    }
    if (catImages[collectionId]) return catImages[collectionId]

    const product = products.find((p) => p.category === collectionId)
    return product?.image || "/placeholder.svg"
  }

  // Label mapped to Magicpin local categories format
  const getMagicpinLabel = (name: string) => {
    const labels: Record<string, string> = {
      "Couples": "Dining & Food",
      "Superheroes": "Fashion & Gear",
      "Professionals": "Corporate Gifting",
      "Wedding": "Events & Luxury",
      "Family": "Groceries & Care",
      "Hobbies": "Gamer Vouchers",
      "Sports": "Gym & Fitness",
      "Music": "Shows & Concerts",
      "Travel": "Travel Deals",
      "With Pets": "Pet Services",
      "With Vehicles": "Auto Repairs",
      "Fantasy": "Magic Vouchers"
    }
    return labels[name] || name
  }

  return (
    <section id="categories" className="py-6 bg-white border-b border-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-black text-slate-800">Shop by Category</h2>
          <Link href="/products" className="text-xs font-bold text-[#ec2652] hover:text-[#d41c45] transition-colors">
            View all
          </Link>
        </div>

        {/* Categories Circle list - Magicpin style horizontal scroller */}
        <div className="flex overflow-x-auto gap-5 pb-3 scrollbar-none scroll-smooth">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collections/${collection.id}`} className="flex flex-col items-center flex-shrink-0">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-100 bg-gray-50 shadow-sm hover:scale-105 transition-transform duration-300">
                <Image
                  src={collection.image || getCollectionImage(collection.id)}
                  alt={collection.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-[11px] font-bold text-gray-600 mt-2 text-center w-20 truncate">
                {getMagicpinLabel(collection.name)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
