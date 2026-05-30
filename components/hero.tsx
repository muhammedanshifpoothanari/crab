"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Sparkles } from "lucide-react"

interface Banner {
  id: string
  image: string
  link: string
  isActive: boolean
}

export function Hero() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banners")
        if (res.ok) {
          const data: Banner[] = await res.json()
          const activeBanners = data.filter(b => b.isActive)
          setBanners(activeBanners)
        }
      } catch (error) {
        console.error("Failed to fetch banners", error)
      }
    }
    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [banners.length])

  if (banners.length === 0) {
    // Fallback to a nice loading state or default if no banners
    return (
      <section className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] bg-muted animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Sparkles className="h-8 w-8 animate-bounce" />
          <p>Loading amazing offers...</p>
        </div>
      </section>
    )
  }

  const currentBanner = banners[currentIndex]

  const BannerContent = () => (
    <div className="relative w-full h-[300px] md:h-[500px] lg:h-[650px] bg-muted overflow-hidden">
      <Image
        src={currentBanner.image}
        alt="Hero Promotional Banner"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Navigation Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <section className="w-full relative group transition-opacity duration-500 ease-in-out">
      {currentBanner.link ? (
        <Link href={currentBanner.link} className="block w-full h-full">
          <BannerContent />
        </Link>
      ) : (
        <BannerContent />
      )}
    </section>
  )
}
