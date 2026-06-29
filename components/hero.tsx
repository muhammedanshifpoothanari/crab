"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"

interface DbBanner {
  id: string
  image: string
  link: string
  isActive: boolean
  tag?: string
  header?: string
  description?: string
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
  const [loading, setLoading] = useState(true)
  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(0)

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

  // Sync Carousel Index
  useEffect(() => {
    if (!api) return
    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap())
    })
  }, [api])

  // Autoplay functionality synced with Embla API
  useEffect(() => {
    if (!api) return
    const total = dbBanners.length > 0 ? dbBanners.length : fallbackSlides.length
    if (total <= 1) return

    const interval = setInterval(() => {
      const nextIndex = (api.selectedScrollSnap() + 1) % total
      api.scrollTo(nextIndex)
    }, 5000)

    return () => clearInterval(interval)
  }, [api, dbBanners.length])

  const hasDbBanners = dbBanners.length > 0

  return (
    <section className="px-4 py-4 md:py-6 bg-white overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <Carousel setApi={setApi} className="w-full relative" opts={{ loop: true }}>
          <CarouselContent className="-ml-0">
            {hasDbBanners
              ? dbBanners.map((banner, idx) => (
                  <CarouselItem key={banner.id || idx} className="pl-0 basis-full">
                    {banner.header || banner.tag ? (
                      /* Render dynamic custom banner formatted as a structured card (Magicpin style) */
                      <div className="relative rounded-2xl overflow-hidden bg-[#fff0f3] p-6 md:p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between min-h-[300px] md:min-h-[400px] shadow-sm select-none">
                        {/* Left Content */}
                        <div className="flex-1 space-y-4 md:space-y-5 max-w-lg z-10 text-left">
                          <span className="inline-block px-3 py-1 text-xs font-bold text-[#ec2652] bg-[#ec2652]/10 rounded-full">
                            {banner.tag || "Offer"}
                          </span>
                          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight text-slate-800">
                            {banner.header}
                          </h1>
                          {banner.description && (
                            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-semibold">
                              {banner.description}
                            </p>
                          )}
                          {banner.link && (
                            <Link href={banner.link} className="inline-block">
                              <button className="px-5 py-2.5 bg-[#ec2652] hover:bg-[#d41c45] text-white font-extrabold rounded-full shadow-md transition-transform hover:scale-105 duration-300 text-xs md:text-sm">
                                Get Deal
                              </button>
                            </Link>
                          )}
                        </div>

                        {/* Right Content: Uploaded Side Image */}
                        <div className="flex-1 relative w-full h-[120px] sm:h-[160px] md:h-[240px] mt-4 md:mt-0 flex justify-center md:justify-end z-10">
                          <div className="relative w-[120px] sm:w-[160px] md:w-[240px] h-full">
                            <Image
                              src={banner.image}
                              alt={banner.header || "Deal Image"}
                              fill
                              className="object-contain rounded-xl shadow-lg border-2 border-white pointer-events-none"
                              priority
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Render legacy banner as a full-bleed background image */
                      <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-md select-none w-full">
                        {banner.link ? (
                          <Link href={banner.link}>
                            <img
                              src={banner.image}
                              alt="Custom Promo Banner"
                              className="w-full h-auto object-contain transition-transform duration-700 hover:scale-[1.02] pointer-events-none rounded-2xl"
                            />
                          </Link>
                        ) : (
                          <img
                            src={banner.image}
                            alt="Custom Promo Banner"
                            className="w-full h-auto object-contain pointer-events-none rounded-2xl"
                          />
                        )}
                      </div>
                    )}
                  </CarouselItem>
                ))
              : fallbackSlides.map((slide, idx) => (
                  <CarouselItem key={idx} className="pl-0 basis-full">
                    <div className={`relative rounded-2xl overflow-hidden ${slide.bgColor} p-6 md:p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between min-h-[300px] md:min-h-[400px] shadow-sm select-none`}>
                      {/* Left Content */}
                      <div className="flex-1 space-y-4 md:space-y-5 max-w-lg z-10 text-left">
                        <span className="inline-block px-3 py-1 text-xs font-bold text-[#ec2652] bg-[#ec2652]/10 rounded-full">
                          {slide.badge}
                        </span>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight text-slate-800">
                          {slide.title}
                          <span className="text-[#ec2652]">{slide.highlightWord}</span>
                        </h1>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-semibold">
                          {slide.subtitle}
                        </p>
                        <Link href={slide.link} className="inline-block">
                          <button className="px-5 py-2.5 bg-[#ec2652] hover:bg-[#d41c45] text-white font-extrabold rounded-full shadow-md transition-transform hover:scale-105 duration-300 text-xs md:text-sm">
                            {slide.buttonText}
                          </button>
                        </Link>
                      </div>

                      {/* Right Content */}
                      <div className="flex-1 relative w-full h-[120px] sm:h-[160px] md:h-[240px] mt-4 md:mt-0 flex justify-center md:justify-end z-10">
                        <div className="relative w-[120px] sm:w-[160px] md:w-[240px] h-full">
                          <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-contain rounded-xl shadow-lg border-2 border-white pointer-events-none"
                            priority
                          />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
          </CarouselContent>

          {/* Indicators */}
          {(hasDbBanners ? dbBanners.length : fallbackSlides.length) > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
              {(hasDbBanners ? dbBanners : fallbackSlides).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => api?.scrollTo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "w-5 bg-[#ec2652]" : "w-2 bg-slate-300/80 shadow-sm"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </Carousel>
      </div>
    </section>
  )
}
