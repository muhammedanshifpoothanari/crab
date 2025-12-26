"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { CartDrawer } from "@/components/cart-drawer"
import { SearchDialog } from "@/components/search-dialog"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-accent shadow-lg shadow-primary/25 transition-all group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/30">
              <span className="text-xl font-bold text-primary-foreground">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text transition-all">
              CrabsCart
            </span>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            <Link href="/">
              <Button variant={pathname === "/" ? "secondary" : "ghost"} className="text-sm font-medium h-10 px-4">
                Home
              </Button>
            </Link>
            <Link href="/#products">
              <Button variant="ghost" className="text-sm font-medium h-10 px-4">
                Products
              </Button>
            </Link>
            <Link href="/#categories">
              <Button variant="ghost" className="text-sm font-medium h-10 px-4">
                Collections
              </Button>
            </Link>
            <Link href="/about">
              <Button variant={pathname === "/about" ? "secondary" : "ghost"} className="text-sm font-medium h-10 px-4">
                About
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant={pathname === "/contact" ? "secondary" : "ghost"}
                className="text-sm font-medium h-10 px-4"
              >
                Contact
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <SearchDialog />
          <CartDrawer />
          <Link href="/#products" className="hidden md:block">
            <Button
              size="default"
              className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all h-10"
            >
              Get Started
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/50 bg-background/98 backdrop-blur-xl lg:hidden shadow-lg">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-6">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={pathname === "/" ? "secondary" : "ghost"}
                className="w-full justify-start text-sm font-medium h-11"
              >
                Home
              </Button>
            </Link>
            <Link href="/#products" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-sm font-medium h-11">
                Products
              </Button>
            </Link>
            <Link href="/#categories" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-sm font-medium h-11">
                Collections
              </Button>
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={pathname === "/about" ? "secondary" : "ghost"}
                className="w-full justify-start text-sm font-medium h-11"
              >
                About
              </Button>
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={pathname === "/contact" ? "secondary" : "ghost"}
                className="w-full justify-start text-sm font-medium h-11"
              >
                Contact
              </Button>
            </Link>
            <Link href="/#products" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full mt-3 h-11 shadow-lg shadow-primary/25">Get Started</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
