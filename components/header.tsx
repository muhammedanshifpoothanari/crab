"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import { CartDrawer } from "@/components/cart-drawer"
import { SearchDialog } from "@/components/search-dialog"
import { usePathname } from "next/navigation"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    if (!isHomePage) {
      window.location.href = `/#${id}`
      return
    }
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">C</span>
            </div>
            <span className="text-xl font-semibold">CrabsCart</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <button
              onClick={() => scrollToSection("products")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection("categories")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Collections
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Gallery
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <SearchDialog />
          <CartDrawer />

          <Button className="hidden md:flex" onClick={() => scrollToSection("products")}>
            Get Started
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <button onClick={() => scrollToSection("products")} className="text-sm font-medium text-left">
              Products
            </button>
            <button onClick={() => scrollToSection("categories")} className="text-sm font-medium text-left">
              Collections
            </button>
            <button onClick={() => scrollToSection("how-it-works")} className="text-sm font-medium text-left">
              How It Works
            </button>
            <button onClick={() => scrollToSection("gallery")} className="text-sm font-medium text-left">
              Gallery
            </button>
            <Button className="w-full" onClick={() => scrollToSection("products")}>
              Get Started
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
