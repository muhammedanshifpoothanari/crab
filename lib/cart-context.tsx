"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/product-data"

export interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  subtotal: number
  total: number
  discount: number
  discountPercentage: number
  itemCount: number
  promoCode: string
  applyPromoCode: (code: string) => Promise<boolean>
  whatsappCheckoutEnabled: boolean
  adminWhatsAppNumber: string
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState("")
  const [promoDiscountPct, setPromoDiscountPct] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Dynamic Settings states
  const [whatsappCheckoutEnabled, setWhatsappCheckoutEnabled] = useState(false)
  const [adminWhatsAppNumber, setAdminWhatsAppNumber] = useState("919400757707")

  // Phone Interceptor States
  const [showPhonePrompt, setShowPhonePrompt] = useState(false)
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null)
  const [pendingQuantity, setPendingQuantity] = useState(1)
  const [phoneNumberInput, setPhoneNumberInput] = useState("")

  const { toast } = useToast()

  // 1. Client-side Hydration
  useEffect(() => {
    const savedCart = localStorage.getItem("cart_items")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart items:", e)
      }
    }
    setIsHydrated(true)

    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setWhatsappCheckoutEnabled(!!data.whatsappCheckoutEnabled)
          setAdminWhatsAppNumber(data.adminWhatsAppNumber || "919400757707")
        }
      })
      .catch(err => console.error("Error fetching settings:", err))
  }, [])

  // 2. Local Storage Sync
  useEffect(() => {
    if (!isHydrated) return

    if (items.length > 0) {
      localStorage.setItem("cart_items", JSON.stringify(items))
    } else {
      localStorage.removeItem("cart_items")
    }
  }, [items, isHydrated])

  const actualAddToCart = (product: Product, quantityToAdd: number = 1) => {
    const existing = items.find((item) => item.id === product.id)

    if (existing) {
      toast({
        title: "Updated cart",
        description: `${product.name} quantity increased`,
      })
    } else {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      })
    }

    setItems((prevItems) => {
      const isAlreadyInCart = prevItems.some((item) => item.id === product.id)
      if (isAlreadyInCart) {
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item))
      }
      return [...prevItems, { ...product, quantity: quantityToAdd }]
    })
  }

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    const savedPhone = typeof window !== "undefined" ? localStorage.getItem("customer_phone") : null
    if (!savedPhone) {
      setPendingProduct(product)
      setPendingQuantity(quantityToAdd)
      setShowPhonePrompt(true)
      return
    }
    actualAddToCart(product, quantityToAdd)
  }

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanPhone = phoneNumberInput.replace(/[\s-+]/g, "")
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(cleanPhone)) {
      toast({
        variant: "destructive",
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit Indian Mobile Number (e.g. 9876543210)",
      })
      return
    }
    localStorage.setItem("customer_phone", cleanPhone)
    setShowPhonePrompt(false)
    if (pendingProduct) {
      actualAddToCart(pendingProduct, pendingQuantity)
      setPendingProduct(null)
      setPendingQuantity(1)
    }
    toast({
      title: "Mobile number verified!",
      description: "Cart has been saved and linked to your mobile phone number.",
    })
  }

  const removeFromCart = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    })
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    setPromoCode("")
    setPromoDiscountPct(0)
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    })
  }

  const applyPromoCode = async (code: string): Promise<boolean> => {
    const uppercaseCode = code.trim().toUpperCase()
    try {
      const res = await fetch(`/api/coupons?code=${uppercaseCode}`)
      const data = await res.json()
      if (res.ok && data && !data.error) {
        setPromoCode(uppercaseCode)
        setPromoDiscountPct(data.discountPct)
        toast({
          title: "Coupon code applied!",
          description: `Successfully applied code ${uppercaseCode} for ${data.discountPct}% off your entire order!`,
        })
        return true
      } else {
        toast({
          variant: "destructive",
          title: "Invalid coupon",
          description: data.error || "This coupon code does not exist or is expired.",
        })
        return false
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Coupon check failed",
        description: "Failed to validate coupon code. Please try again.",
      })
      return false
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  // Dynamic auto combo discounts
  let discountPercentage = 0
  if (itemCount === 2) {
    discountPercentage = 10 // 10% discount for buying 2 items
  } else if (itemCount >= 3) {
    discountPercentage = 15 // 15% discount for buying 3 or more items
  }

  // Use the higher discount between promo and automatic combo
  const finalDiscountPct = Math.max(discountPercentage, promoDiscountPct)
  const discount = Math.round(subtotal * (finalDiscountPct / 100))
  const total = subtotal - discount

  // Dynamic real-time sync of abandoned checkout in MongoDB Atlas
  useEffect(() => {
    if (!isHydrated) return

    const savedPhone = typeof window !== "undefined" ? localStorage.getItem("customer_phone") : null
    if (!savedPhone) return

    fetch("/api/abandoned", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: savedPhone,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: total,
      })
    }).catch(err => console.error("Error syncing abandoned checkout:", err))
  }, [items, total, isHydrated])

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        total,
        discount,
        discountPercentage: finalDiscountPct,
        itemCount,
        promoCode,
        applyPromoCode,
        whatsappCheckoutEnabled,
        adminWhatsAppNumber,
      }}
    >
      {children}

      {/* Premium Glassmorphism Mobile Interceptor Prompt */}
      {showPhonePrompt && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm p-6 bg-card border border-border/80 shadow-2xl rounded-2xl flex flex-col items-center text-center gap-4 animate-in zoom-in-95 duration-300">
            <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Verify Your Mobile</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                Please enter your 10-digit Mobile Number to add this item to your cart and track your order.
              </p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="w-full space-y-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">+91</span>
                <input
                  type="tel"
                  required
                  placeholder="98765 43210"
                  value={phoneNumberInput}
                  onChange={(e) => setPhoneNumberInput(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background/80 pl-11 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPhonePrompt(false)}
                  className="flex-1 h-9 rounded-md border border-input text-xs font-bold hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-9 rounded-md bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/95 transition-colors shadow-md shadow-primary/20"
                >
                  Verify & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
