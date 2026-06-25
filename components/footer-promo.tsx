"use client"

import { Sparkles } from "lucide-react"

export function FooterPromo() {
  return (
    <section className="px-4 py-8 bg-white border-t border-gray-100">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-[#fff0f3] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-rose-100">
          <div className="flex items-center gap-4 text-left">
            <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-[#ec2652] shadow-sm flex-shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black text-slate-800">
                Unlock 100% Cashbacks on the App!
              </h3>
              <p className="text-xs md:text-sm text-slate-600 mt-0.5 font-semibold">
                Scan bills, claim exclusive local merchant vouchers, and redeem rewards daily.
              </p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto justify-start md:justify-end">
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-colors shadow-sm"
            >
              Get Android App
            </a>
            <a
              href="https://apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#ec2652] text-white rounded-xl text-xs font-black hover:bg-[#d41c45] transition-colors shadow-sm"
            >
              Get iOS App
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
