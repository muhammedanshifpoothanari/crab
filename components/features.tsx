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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="flex flex-col items-center text-center p-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-2">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
