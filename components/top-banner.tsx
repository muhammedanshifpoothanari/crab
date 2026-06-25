"use client"

import { Truck } from "lucide-react"

export function TopBanner() {
  return (
    <div className="w-full bg-[#0b2240] text-white py-2 px-4 flex items-center justify-center gap-2 text-xs md:text-sm font-medium z-50 relative">
      <Truck className="h-4 w-4 animate-bounce" />
      <span>Free Shipping on orders over <strong className="font-bold">RS 500</strong></span>
    </div>
  )
}
