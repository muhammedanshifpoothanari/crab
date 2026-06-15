import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "CrabsCart - Personalized Gifts & Collectibles",
  description:
    "Create unique personalized gifts with CrabsCart. Custom figurines, caricatures, and collectibles for every special occasion.",
  generator: "anshif.dev",
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
          {children}
          <Toaster />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
