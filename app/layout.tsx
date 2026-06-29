import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { TopBanner } from "@/components/top-banner"
import { BottomNav } from "@/components/bottom-nav"

export const metadata: Metadata = {
  title: "CrabsCart - Personalized Gifts & Collectibles",
  description:
    "Create unique personalized gifts with CrabsCart. Custom figurines, caricatures, and collectibles for every special occasion.",
  generator: "anshif.dev",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <TopBanner />
            <main className="flex-1 pb-16 md:pb-0">
              {children}
            </main>
            <BottomNav />
          </div>
          <Toaster />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
