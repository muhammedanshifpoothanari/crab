"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface Banner {
  id: string
  image: string
  link: string
  isActive: boolean
}

export function TopBanner() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banners")
        if (res.ok) {
          const data: Banner[] = await res.json()
          // Only show active banners
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
    }, 3000)

    return () => clearInterval(interval)
  }, [banners.length])

  if (banners.length === 0) {
    return null
  }

  const currentBanner = banners[currentIndex]

  const BannerContent = () => (
    <div className="relative w-full h-[40px] md:h-[60px] lg:h-[80px] bg-muted overflow-hidden">
      <Image
        src={currentBanner.image}
        alt="Promotional Banner"
        fill
        className="object-cover"
        priority
      />
    </div>
  )

  return (
    <div className="w-full relative group transition-opacity duration-500 ease-in-out">
      {currentBanner.link ? (
        <Link href={currentBanner.link}>
          <BannerContent />
        </Link>
      ) : (
        <BannerContent />
      )}
    </div>
  )
}
