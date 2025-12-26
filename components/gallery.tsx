"use client"

import Image from "next/image"
import { useState } from "react"

const galleryImages = [
  "/custom-figurine-1.jpg",
  "/custom-figurine-2.jpg",
  "/custom-figurine-3.jpg",
  "/custom-figurine-4.jpg",
  "/custom-figurine-5.jpg",
  "/placeholder.svg?height=400&width=400",
  "/placeholder.svg?height=400&width=400",
  "/placeholder.svg?height=400&width=400",
]

export function Gallery() {
  const [visibleImages] = useState(8)

  return (
    <section id="gallery" className="py-20 md:py-32 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl mb-6">
            Customer Gallery
          </h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed max-w-2xl mx-auto">
            See what our happy customers have created with CrabsCart
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {galleryImages.slice(0, visibleImages).map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-muted cursor-pointer shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 ring-1 ring-black/5"
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
