"use client"

import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react"

export function Features() {
  const items = [
    {
      icon: Truck,
      title: "Free Shipping",
      desc: "On orders $50+",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      desc: "100% secure",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      desc: "30 days return",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "We're here to help",
    },
  ]

  return (
    <section className="py-6 border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-4 gap-2 md:gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="flex flex-col items-center text-center p-1 sm:p-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-1.5 sm:mb-2">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <h4 className="text-[10px] sm:text-sm font-semibold text-gray-800 leading-tight">{item.title}</h4>
                <p className="text-[9px] sm:text-xs text-gray-400 mt-0.5 leading-tight">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
