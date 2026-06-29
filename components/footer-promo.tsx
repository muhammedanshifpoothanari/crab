"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"

export function FooterPromo() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Register service worker for PWA support
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("PWA Service Worker registered with scope:", reg.scope))
        .catch((err) => console.error("PWA Service Worker registration failed:", err))
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`PWA install prompt user choice outcome: ${outcome}`)
      setDeferredPrompt(null)
    } else {
      toast.info(
        "To install, tap the share/menu button in your browser and select 'Add to Home Screen'.",
        {
          duration: 6000,
        }
      )
    }
  }

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
            <button
              onClick={handleInstallClick}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              Get Android App
            </button>
            <button
              onClick={handleInstallClick}
              className="px-5 py-2.5 bg-[#ec2652] text-white rounded-xl text-xs font-black hover:bg-[#d41c45] transition-colors shadow-sm cursor-pointer"
            >
              Get iOS App
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
