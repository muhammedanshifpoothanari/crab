"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, MessageSquare, Mail, Package, ArrowRight, Home, RefreshCw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface OrderDetail {
  orderId: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zip: string
  }
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  paymentMethod: string
  status: string
  createdAt: string
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const router = useRouter()
  
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!orderId) {
      setError("No Order ID provided")
      setLoading(false)
      return
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (!response.ok) {
          throw new Error("Failed to load order details")
        }
        const data = await response.json()
        setOrder(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Could not retrieve order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center gap-4 text-center">
          <RefreshCw className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-semibold">Retrieving your order transaction...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center gap-6">
          <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-bold">
            !
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Order Not Found</h2>
          <p className="text-muted-foreground max-w-md">
            We could not find a transaction details for Order ID: <span className="font-mono font-bold text-foreground">{orderId || "N/A"}</span>.
          </p>
          <Button onClick={() => router.push("/")} size="lg">
            Return to Storefront
          </Button>
        </div>
        <Footer />
      </main>
    )
  }

  const taxAmount = Math.round(order.total * 0.18)
  const grandTotal = order.total + taxAmount

  // Pre-filled custom links
  const whatsappUrl = `https://wa.me/918921284021?text=Hi%20CrabsCart%2C%20here%20are%20my%20photos%20for%20my%20personalized%20figurine%20order%20%2A${order.orderId}%2A`
  const emailSubject = encodeURIComponent(`Photos for Custom Figurine Order - ${order.orderId}`)
  const emailBody = encodeURIComponent(`Hi CrabsCart Team,\n\nI have placed an order for personalized figurines.\nMy Order ID is: ${order.orderId}\n\nAttached are my reference photos (Front view, Side view, Outfits).\n\nCustomer Name: ${order.customer.name}`)
  const emailUrl = `mailto:hello@crabscart.com?subject=${emailSubject}&body=${emailBody}`

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl opacity-60" />

        <div className="container mx-auto px-4 max-w-4xl relative">
          {/* Header Success Section */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl scale-125 animate-pulse" />
              <CheckCircle2 className="h-16 w-16 text-emerald-500 relative" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order ID is{" "}
              <span className="font-mono font-bold text-foreground bg-secondary/80 px-2 py-0.5 rounded">
                {order.orderId}
              </span>
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-12 items-start">
            {/* Left: What's Next Instruction Panel */}
            <div className="md:col-span-7 flex flex-col gap-6">
              <Card className="p-6 md:p-8 border-primary/20 bg-primary/5 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                  <Package className="h-5 w-5" />
                  <span>What's Next? (Upload Photos)</span>
                </h3>
                <p className="text-sm text-pretty mb-6 leading-relaxed">
                  To begin crafting your customized premium bobblehead/figurine, please share your reference faces and
                  outfits photos with our design team.
                </p>

                <div className="flex flex-col gap-4">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold shadow-lg shadow-emerald-600/20">
                      <MessageSquare className="h-5 w-5 fill-white text-emerald-600" />
                      Send Photos via WhatsApp
                    </Button>
                  </a>

                  <a href={emailUrl} className="w-full">
                    <Button variant="outline" className="w-full border-border/80 bg-background/50 hover:bg-background gap-2 font-bold">
                      <Mail className="h-5 w-5" />
                      Send Photos via Email
                    </Button>
                  </a>
                </div>

                <div className="mt-8 pt-6 border-t border-primary/10 space-y-4">
                  <h4 className="font-bold text-sm">Our 4-Step Figurines Pipeline:</h4>
                  <ol className="text-xs space-y-3 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">1.</span>
                      <span>Order received with customizable specifications (Done).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">2.</span>
                      <span>You submit reference portraits via WhatsApp or Email.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">3.</span>
                      <span>Our master sculptor shares a digital facial design draft for your approval.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">4.</span>
                      <span>Bobblehead is hand-painted, baked, and shipped directly to your door!</span>
                    </li>
                  </ol>
                </div>
              </Card>

              {/* Navigation Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Link href={`/profile?email=${order.customer.email}`} className="w-full">
                  <Button variant="outline" className="w-full border-border bg-background hover:bg-secondary/40 font-semibold gap-2">
                    Track Orders
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/" className="w-full">
                  <Button className="w-full gap-2 font-semibold shadow-md hover:shadow-lg">
                    <Home className="h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Receipt Breakdown */}
            <div className="md:col-span-5">
              <Card className="p-6 border-border bg-card/40 backdrop-blur-xl">
                <h3 className="text-lg font-bold mb-4 pb-3 border-b border-border/40">Order Details</h3>

                <div className="space-y-4 text-xs">
                  {/* Items list */}
                  <div className="space-y-3 pb-3 border-b border-border/20 max-h-[200px] overflow-y-auto">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                          <div className="relative h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold line-clamp-1">{item.name}</p>
                            <p className="text-muted-foreground text-[10px]">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2 pb-3 border-b border-border/20">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{order.total}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Taxes & GST (18%)</span>
                      <span>₹{taxAmount}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>Shipping</span>
                      <span>FREE</span>
                    </div>
                  </div>

                  {/* Grand total */}
                  <div className="flex justify-between text-base font-extrabold pb-3 border-b border-border/20">
                    <span>Total Amount</span>
                    <span>₹{grandTotal}</span>
                  </div>

                  {/* Shipping Address summary */}
                  <div className="space-y-1">
                    <p className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider">Ship To:</p>
                    <p className="font-semibold text-foreground text-sm">{order.customer.name}</p>
                    <p className="text-muted-foreground leading-relaxed text-[11px]">
                      {order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.zip}
                    </p>
                    <p className="text-muted-foreground text-[11px]">Phone: {order.customer.phone}</p>
                  </div>

                  {/* Payment option */}
                  <div className="pt-2">
                    <p className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider mb-1">
                      Payment Mode:
                    </p>
                    <span className="inline-block px-2.5 py-1 bg-secondary text-secondary-foreground font-semibold rounded-md text-[10px]">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center gap-4 text-center">
          <RefreshCw className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-semibold">Retrieving your order transaction...</p>
        </div>
        <Footer />
      </main>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
