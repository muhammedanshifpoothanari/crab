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
            <Button asChild variant={pathname === "/" ? "secondary" : "ghost"} className="text-sm font-medium h-10 px-4">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild variant="ghost" className="text-sm font-medium h-10 px-4">
              <Link href="/#products">Products</Link>
            </Button>
            <Button asChild variant="ghost" className="text-sm font-medium h-10 px-4">
              <Link href="/#categories">Collections</Link>
            </Button>
            <Button asChild variant={pathname === "/about" ? "secondary" : "ghost"} className="text-sm font-medium h-10 px-4">
              <Link href="/about">About</Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/contact" ? "secondary" : "ghost"}
              className="text-sm font-medium h-10 px-4"
            >
              <Link href="/contact">Contact</Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/profile" ? "secondary" : "ghost"}
              className="text-sm font-semibold h-10 px-4 text-primary"
            >
              <Link href="/profile">My Orders</Link>
            </Button>
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
            <Button
              asChild
              variant={pathname === "/" ? "secondary" : "ghost"}
              className="w-full justify-start text-sm font-medium h-11"
            >
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start text-sm font-medium h-11">
              <Link href="/#products" onClick={() => setMobileMenuOpen(false)}>Products</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start text-sm font-medium h-11">
              <Link href="/#categories" onClick={() => setMobileMenuOpen(false)}>Collections</Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/about" ? "secondary" : "ghost"}
              className="w-full justify-start text-sm font-medium h-11"
            >
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/contact" ? "secondary" : "ghost"}
              className="w-full justify-start text-sm font-medium h-11"
            >
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/profile" ? "secondary" : "ghost"}
              className="w-full justify-start text-sm font-semibold h-11 text-primary"
            >
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
            </Button>
            <Button asChild className="w-full mt-3 h-11 shadow-lg shadow-primary/25">
              <Link href="/#products" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
