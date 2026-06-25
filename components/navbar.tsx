"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Search, MapPin, ChevronDown, User } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { CartDrawer } from "@/components/cart-drawer"
import { usePathname } from "next/navigation"
import type { Product } from "@/lib/product-data"
import Image from "next/image"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("Karunagappally, Kerala")
  
  // Search Autocomplete state
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch products for searching on mount
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data)
        }
      })
      .catch((err) => console.error("Search data load error:", err))
  }, [])

  // Filter products when searchQuery changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([])
      return
    }
    const q = searchQuery.toLowerCase()
    const matches = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    )
    setFilteredProducts(matches.slice(0, 5)) // Limit to 5 results
  }, [searchQuery, products])

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        
        {/* Left Side: Hamburger Menu & Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Original image logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="CrabsCart Logo"
              width={150}
              height={42}
              className="h-9 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              priority
            />
          </Link>
        </div>

        {/* Center: Location & Search bar (Magicpin style) - Desktop */}
        <div ref={containerRef} className="hidden md:flex flex-1 max-w-2xl relative items-center border border-gray-200 rounded-lg h-11 bg-gray-50 shadow-inner">
          {/* Location selector */}
          <div className="flex items-center gap-1.5 px-3 border-r border-gray-200 min-w-[200px] cursor-pointer hover:bg-gray-100/50 h-full transition-colors rounded-l-lg">
            <MapPin className="h-4 w-4 text-[#ec2652]" />
            <span className="text-xs font-semibold text-gray-700 truncate max-w-[130px]">
              {location}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-auto" />
          </div>

          {/* Merchant / Product search */}
          <div className="flex-1 relative flex items-center h-full">
            <input
              type="text"
              placeholder="Search for custom models, categories, or collections..."
              className="w-full h-full pl-3 pr-10 bg-transparent text-xs focus:outline-none placeholder-gray-400 font-medium"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowDropdown(true)
              }}
              onFocus={() => setShowDropdown(true)}
            />
            <button className="absolute right-2 h-7 w-7 rounded-md bg-[#ec2652] flex items-center justify-center text-white shadow-sm shadow-[#ec2652]/20 hover:bg-[#d41c45] transition-colors">
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Autocomplete Search Dropdown - Desktop */}
          {showDropdown && searchQuery.trim() && (
            <div className="absolute top-12 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-[350px] overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-400 font-semibold">
                  No matching models found
                </div>
              ) : (
                <div className="p-2 flex flex-col gap-1">
                  <div className="text-[10px] uppercase font-bold text-gray-400 px-3 py-1">Matching Vouchers & Models</div>
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={() => {
                        setShowDropdown(false)
                        setSearchQuery("")
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-rose-50/50 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{product.name}</h4>
                        <p className="text-[10px] text-gray-400 truncate">{product.description}</p>
                      </div>
                      <span className="text-xs font-black text-[#ec2652] flex-shrink-0 pr-1">₹{product.price}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Account & Cart Drawer */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/profile" className="hidden sm:flex items-center gap-1 text-slate-700 hover:text-[#ec2652] font-semibold text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50">
            <User className="h-4 w-4" />
            <span>Login</span>
          </Link>
          <CartDrawer />
        </div>
      </div>

      {/* Mobile Location & Search - Magicpin style */}
      <div className="px-4 pb-3 md:hidden flex flex-col gap-2 relative">
        <div className="flex items-center gap-1.5 py-1 text-slate-700 cursor-pointer">
          <MapPin className="h-4 w-4 text-[#ec2652]" />
          <span className="text-xs font-bold">{location}</span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </div>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search for brands, categories, or items..."
            className="w-full h-10 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ec2652]/20 focus:border-[#ec2652] placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
          />
          <Search className="absolute right-4 h-4 w-4 text-gray-400" />
        </div>

        {/* Autocomplete Search Dropdown - Mobile */}
        {showDropdown && searchQuery.trim() && (
          <div className="absolute top-22 left-4 right-4 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-[300px] overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400 font-semibold">
                No matching models found
              </div>
            ) : (
              <div className="p-2 flex flex-col gap-1">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => {
                      setShowDropdown(false)
                      setSearchQuery("")
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-rose-50/50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="relative h-9 w-9 rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{product.name}</h4>
                      <span className="text-[10px] font-black text-[#ec2652]">₹{product.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden shadow-lg absolute left-0 right-0 z-40">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
            <Button
              asChild
              variant={pathname === "/" ? "secondary" : "ghost"}
              className="w-full justify-start text-sm font-medium h-10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/">Home</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-sm font-medium h-10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/#products">Deals & Vouchers</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-sm font-medium h-10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/#categories">Categories</Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/about" ? "secondary" : "ghost"}
              className="w-full justify-start text-sm font-medium h-10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/about">About Us</Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/contact" ? "secondary" : "ghost"}
              className="w-full justify-start text-sm font-medium h-10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/contact">Contact</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
