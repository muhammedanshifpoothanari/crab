"use client"

import Image from "next/image"
import { useState } from "react"

const galleryImages = [
  "/cat_family_1779270658181.png",
  "/cat_wedding_1779270641603.png",
  "/cat_with_pets_1779269677237.png",
  "/cat_with_vehicles_1779269693510.png",
  "/cat_sports_1779269598558.png",
  "/cat_music_1779269650586.png",
  "/cat_professionals_1779270624718.png",
  "/cat_superheroes_1779270608522.png",
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
