"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ShoppingBag, CreditCard, Wallet, Truck, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
]

export default function CheckoutPage() {
  const { items, subtotal, total, discount, discountPercentage, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Maharashtra",
    zip: "",
  })

  // Credit / Debit Card form states
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery")
  const [isMounted, setIsMounted] = useState(false)
  const [paymentSettings, setPaymentSettings] = useState({
    cardEnabled: true,
    upiEnabled: true,
    codEnabled: true,
  })

  useEffect(() => {
    setIsMounted(true)
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setPaymentSettings({
            cardEnabled: data.cardEnabled ?? true,
            upiEnabled: data.upiEnabled ?? true,
            codEnabled: data.codEnabled ?? true,
          })
          // Fallback dynamic payment options
          if (!(data.codEnabled ?? true)) {
            if (data.upiEnabled ?? true) {
              setPaymentMethod("UPI Payment")
            } else if (data.cardEnabled ?? true) {
              setPaymentMethod("Card Payment")
            }
          }
        }
      })
      .catch((err) => console.error("Error loading payment settings:", err))
  }, [])

  if (!isMounted) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardForm({ ...cardForm, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.zip || !form.state) {
      toast.error("Please fill in all required shipping fields")
      return
    }

    // Indian Mobile Number Validator (10 digits starting with 6-9)
    const cleanPhone = form.phone.replace(/[\s-+]/g, "")
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(cleanPhone)) {
      toast.error("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)")
      return
    }

    // Indian Pincode Validator (6 digits, first digit non-zero)
    const pincodeRegex = /^[1-9][0-9]{5}$/
    if (!pincodeRegex.test(form.zip)) {
      toast.error("Please enter a valid 6-digit Indian Pincode (e.g. 400001)")
      return
    }

    // Card Verification Checks
    if (paymentMethod === "Card Payment") {
      const cleanCard = cardForm.cardNumber.replace(/\s/g, "")
      if (cleanCard.length < 16) {
        toast.error("Please enter a valid 16-digit Card Number")
        return
      }
      if (!cardForm.cardHolder) {
        toast.error("Please enter Cardholder Name")
        return
      }
      if (!/^\d{2}\/\d{2}$/.test(cardForm.expiry)) {
        toast.error("Please enter a valid expiry date (MM/YY)")
        return
      }
      if (cardForm.cvv.length < 3) {
        toast.error("Please enter a valid CVV code")
        return
      }
    }

    setLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          total: total,
          paymentMethod: paymentMethod,
          paymentDetails: paymentMethod === "Card Payment" ? {
            cardNumber: `**** **** **** ${cardForm.cardNumber.replace(/\s/g, "").slice(-4)}`,
            cardHolder: cardForm.cardHolder,
            expiry: cardForm.expiry,
            brand: cardForm.cardNumber.replace(/\s/g, "").startsWith("4") ? "Visa" : cardForm.cardNumber.replace(/\s/g, "").startsWith("5") ? "Mastercard" : "RuPay",
            paymentStatus: "Paid"
          } : {
            paymentStatus: "Pending COD/UPI Verification"
          }
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order")
      }

      toast.success("Order Placed Successfully!")
      
      // Save customer phone in localStorage to auto-retrieve on profile page later
      localStorage.setItem("customer_phone", form.phone)
      
      clearCart()
      router.push(`/order-confirmation?orderId=${data.orderId}`)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "An error occurred while placing your order")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center gap-6">
          <div className="h-20 w-20 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground shadow-inner animate-pulse">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Your Cart is Empty</h2>
          <p className="text-muted-foreground max-w-md">
            You must add custom figurines to your cart before proceeding to the checkout section.
          </p>
          <Button onClick={() => router.push("/#products")} size="lg" className="shadow-lg shadow-primary/20 mt-2">
            Continue Shopping
          </Button>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl opacity-60" />

        <div className="container mx-auto px-4 max-w-7xl relative">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Secure Checkout</h1>
            <p className="text-muted-foreground text-pretty">
              Fill in your details below to finalize your premium customized collectibles order.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left: Shipping & Payment Details */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              {/* Shipping Address Card */}
              <Card className="p-6 md:p-8 border-border/80 shadow-md bg-card/60 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/40">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-bold">Shipping Information</h3>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label htmlFor="name" className="text-sm font-semibold">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. John Doe"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                      className="bg-background/80"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="text-sm font-semibold">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={form.email}
                      onChange={handleInputChange}
                      required
                      className="bg-background/80"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone" className="text-sm font-semibold">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={form.phone}
                      onChange={handleInputChange}
                      required
                      className="bg-background/80"
                    />
                  </div>

                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label htmlFor="address" className="text-sm font-semibold">
                      Delivery Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Street name, Flat/House number, Apartment"
                      value={form.address}
                      onChange={handleInputChange}
                      required
                      className="bg-background/80"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 sm:col-span-2">
                    <div className="flex flex-col gap-2 col-span-1">
                      <Label htmlFor="city" className="text-sm font-semibold">
                        City <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="Mumbai"
                        value={form.city}
                        onChange={handleInputChange}
                        required
                        className="bg-background/80"
                      />
                    </div>
                    <div className="flex flex-col gap-2 col-span-1">
                      <Label htmlFor="state" className="text-sm font-semibold">
                        State <span className="text-destructive">*</span>
                      </Label>
                      <select
                        id="state"
                        name="state"
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background/80 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {INDIAN_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 col-span-1">
                      <Label htmlFor="zip" className="text-sm font-semibold">
                        Postal Code <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="zip"
                        name="zip"
                        placeholder="400001"
                        value={form.zip}
                        onChange={handleInputChange}
                        required
                        className="bg-background/80"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Methods Card */}
              <Card className="p-6 md:p-8 border-border/80 shadow-md bg-card/60 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/40">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-bold">Payment Method</h3>
                </div>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid gap-4 md:grid-cols-3"
                >
                  {paymentSettings.codEnabled && (
                    <Label
                      htmlFor="cod"
                      className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 bg-background/50 hover:bg-background cursor-pointer transition-all ${
                        paymentMethod === "Cash on Delivery"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-border"
                      }`}
                    >
                      <RadioGroupItem value="Cash on Delivery" id="cod" className="sr-only" />
                      <Truck className="h-6 w-6 text-primary mb-2" />
                      <span className="font-bold text-center block text-sm">COD</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">Pay on delivery</span>
                    </Label>
                  )}

                  {paymentSettings.upiEnabled && (
                    <Label
                      htmlFor="upi"
                      className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 bg-background/50 hover:bg-background cursor-pointer transition-all ${
                        paymentMethod === "UPI Payment"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-border"
                      }`}
                    >
                      <RadioGroupItem value="UPI Payment" id="upi" className="sr-only" />
                      <Wallet className="h-6 w-6 text-primary mb-2" />
                      <span className="font-bold text-center block text-sm">UPI / QR</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">Google Pay, PhonePe</span>
                    </Label>
                  )}

                  {paymentSettings.cardEnabled && (
                    <Label
                      htmlFor="card"
                      className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 bg-background/50 hover:bg-background cursor-pointer transition-all ${
                        paymentMethod === "Card Payment"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-border"
                      }`}
                    >
                      <RadioGroupItem value="Card Payment" id="card" className="sr-only" />
                      <CreditCard className="h-6 w-6 text-primary mb-2" />
                      <span className="font-bold text-center block text-sm">Card</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">Credit or Debit card</span>
                    </Label>
                  )}
                </RadioGroup>

                {/* Conditional Payment UI Simulation */}
                {paymentMethod === "UPI Payment" && (
                  <div className="mt-6 p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col items-center gap-4 text-center">
                    <p className="text-sm font-medium">Scan QR Code or enter your UPI ID upon completion.</p>
                    <div className="relative h-32 w-32 bg-white p-2 rounded-lg shadow-sm flex items-center justify-center">
                      {/* Simple mock QR pattern */}
                      <div className="w-full h-full bg-[repeating-conic-gradient(black_0%_25%,transparent_0%_50%)] bg-[size:10px_10px]" />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono bg-secondary/30 px-3 py-1 rounded">UPI ID: crabscart@okaxis</span>
                  </div>
                )}

                {paymentMethod === "Card Payment" && (
                  <div className="mt-6 grid gap-4 p-4 rounded-xl border border-border/80 bg-background/40">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="cardNumber" className="text-xs font-semibold">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={cardForm.cardNumber}
                        onChange={handleCardInputChange}
                        placeholder="4111 2222 3333 4444"
                        className="bg-background"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="cardHolder" className="text-xs font-semibold">Cardholder Name</Label>
                      <Input
                        id="cardHolder"
                        name="cardHolder"
                        value={cardForm.cardHolder}
                        onChange={handleCardInputChange}
                        placeholder="e.g. John Doe"
                        className="bg-background"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="expiry" className="text-xs font-semibold">Expiry Date</Label>
                        <Input
                          id="expiry"
                          name="expiry"
                          value={cardForm.expiry}
                          onChange={handleCardInputChange}
                          placeholder="MM/YY"
                          className="bg-background"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="cvv" className="text-xs font-semibold">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          type="password"
                          maxLength={3}
                          value={cardForm.cvv}
                          onChange={handleCardInputChange}
                          placeholder="***"
                          className="bg-background"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28">
              <Card className="p-6 md:p-8 border-border/80 shadow-md bg-card/60 backdrop-blur-xl">
                <h3 className="text-xl font-bold mb-6 pb-4 border-b border-border/40 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <span>Order Summary</span>
                </h3>

                {/* Items Grid */}
                <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1 mb-6 space-y-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center border-b border-border/20 pb-3">
                      <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-sm">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Totals Calculations */}
                <div className="space-y-3 pt-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Basket Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>Bundle Discount Applied</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>CGST (9%)</span>
                    <span>₹{Math.round(total * 0.09)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>SGST (9%)</span>
                    <span>₹{Math.round(total * 0.09)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Shipping fee</span>
                    <span>FREE</span>
                  </div>
                  <div className="border-t border-border/50 pt-4 flex justify-between text-lg font-extrabold">
                    <span>Order Total</span>
                    <span>₹{total + Math.round(total * 0.18)}</span>
                  </div>
                </div>

                {/* Submit Checkout Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-8 gap-2 font-bold shadow-lg shadow-primary/25 h-12"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Processing Checkout...
                    </>
                  ) : (
                    <>
                      Place Order (₹{total + Math.round(total * 0.18)})
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* Secure Badge */}
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Secure 256-bit SSL encrypted connection</span>
                </div>
              </Card>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
