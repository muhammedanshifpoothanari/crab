"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/product-data"

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (open) {
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setProducts(data)
          }
        })
        .catch((err) => console.error("Search product fetch failed:", err))
    }
  }, [open])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search for figurines..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />

          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {query && filteredProducts.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No products found</p>
            )}

            {query &&
              filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} onClick={() => setOpen(false)}>
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <p className="text-sm font-medium text-primary mt-1">₹{product.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
