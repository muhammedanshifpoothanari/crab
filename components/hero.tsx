"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface DbBanner {
  id: string
  image: string
  link: string
  isActive: boolean
}

interface StaticSlide {
  badge: string
  title: string
  highlightWord: string
  subtitle: string
  buttonText: string
  link: string
  image: string
  bgColor: string
  textColor: string
}

const fallbackSlides: StaticSlide[] = [
  {
    badge: "Limited Time Offers",
    title: "Get Flat 50% Cashback on ",
    highlightWord: "Vouchers",
    subtitle: "Buy customized figurine gift cards and enjoy amazing local discount rewards.",
    buttonText: "Claim Cashback",
    link: "/#products",
    image: "/romantic-couple-figurine-standing-together.jpg",
    bgColor: "bg-[#fff0f3]",
    textColor: "text-[#880d2e]",
  },
  {
    badge: "Popular Deal",
    title: "Save Big on Custom Wedding ",
    highlightWord: "Collectibles",
    subtitle: "Redeem your magicPoints to unlock extra savings on anniversary orders.",
    buttonText: "Redeem Points",
    link: "/#products",
    image: "/indian-wedding-couple-figurine-traditional-dress.jpg",
    bgColor: "bg-[#fdf2e9]",
    textColor: "text-[#4a2711]",
  },
  {
    badge: "Cashback Bonanza",
    title: "Earn Extra magicPoints on ",
    highlightWord: "Superheroes",
    subtitle: "Get up to 20% magicPoints back on ordering superhero figurine models.",
    buttonText: "Explore Deals",
    link: "/#products",
    image: "/two-superheroes-together-figurine.jpg",
    bgColor: "bg-[#eefcf9]",
    textColor: "text-[#0e6251]",
  }
]

export function Hero() {
  const [dbBanners, setDbBanners] = useState<DbBanner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/banners")
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error("Failed to fetch banners")
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const active = data.filter((b) => b.isActive)
          setDbBanners(active)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Hero banners load failed:", err)
        setLoading(false)
      })
  }, [])

  // Auto-scroll slides
  useEffect(() => {
    const totalSlides = dbBanners.length > 0 ? dbBanners.length : fallbackSlides.length
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, 5000)
    return () => clearInterval(interval)
  }, [dbBanners.length])

  const hasDbBanners = dbBanners.length > 0
  const currentDbBanner = hasDbBanners ? dbBanners[currentIndex] : null
  const currentStaticSlide = !hasDbBanners ? fallbackSlides[currentIndex] : null

  return (
    <section className="px-4 py-4 md:py-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        {hasDbBanners && currentDbBanner ? (
          /* Render dynamic custom banner uploaded from Admin Panel */
          <div className="relative rounded-2xl overflow-hidden aspect-[21/9] md:aspect-[3/1] bg-gray-100 shadow-md">
            {currentDbBanner.link ? (
              <Link href={currentDbBanner.link}>
                <Image
                  src={currentDbBanner.image}
                  alt="Custom Promo Banner"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-102"
                  priority
                />
              </Link>
            ) : (
              <Image
                src={currentDbBanner.image}
                alt="Custom Promo Banner"
                fill
                className="object-cover"
                priority
              />
            )}
            
            {/* Page Indicators */}
            {dbBanners.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {dbBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? "w-5 bg-[#ec2652]" : "w-2 bg-white/70 shadow-sm"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Fallback static Magicpin styled slides */
          currentStaticSlide && (
            <div className={`relative rounded-2xl overflow-hidden ${currentStaticSlide.bgColor} transition-all duration-500 p-6 md:p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between min-h-[300px] md:min-h-[400px] shadow-sm`}>
              {/* Left Content */}
              <div className="flex-1 space-y-4 md:space-y-5 max-w-lg z-10 text-left">
                <span className="inline-block px-3 py-1 text-xs font-bold text-[#ec2652] bg-[#ec2652]/10 rounded-full">
                  {currentStaticSlide.badge}
                </span>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight text-slate-800">
                  {currentStaticSlide.title}
                  <span className="text-[#ec2652]">{currentStaticSlide.highlightWord}</span>
                </h1>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-semibold">
                  {currentStaticSlide.subtitle}
                </p>
                <Link href={currentStaticSlide.link} className="inline-block">
                  <button className="px-5 py-2.5 bg-[#ec2652] hover:bg-[#d41c45] text-white font-extrabold rounded-full shadow-md transition-transform hover:scale-105 duration-300 text-xs md:text-sm">
                    {currentStaticSlide.buttonText}
                  </button>
                </Link>
              </div>

              {/* Right Content */}
              <div className="flex-1 relative w-full h-[200px] md:h-[300px] mt-6 md:mt-0 flex justify-center md:justify-end z-10">
                <div className="relative w-[200px] md:w-[280px] h-full">
                  <Image
                    src={currentStaticSlide.image}
                    alt={currentStaticSlide.title}
                    fill
                    className="object-cover rounded-xl shadow-lg border-2 border-white"
                    priority
                  />
                </div>
              </div>

              {/* Page Indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {fallbackSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? "w-5 bg-[#ec2652]" : "w-2 bg-slate-300"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  )
}
