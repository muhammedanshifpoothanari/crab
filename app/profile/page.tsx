"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  User,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  PackageCheck,
  AlertCircle,
  LogOut,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface Order {
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
  trackingNumber: string
  createdAt: string
}

function ProfileContent() {
  const searchParams = useSearchParams()
  const urlPhone = searchParams.get("phone")
  const router = useRouter()

  const [phone, setPhone] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  
  // Profile default presets saved in local state for convenience
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })

  useEffect(() => {
    // Check if phone is in URL or localStorage
    const savedPhone = urlPhone || localStorage.getItem("customer_phone")
    if (savedPhone) {
      setPhone(savedPhone)
      setIsLoggedIn(true)
      fetchOrders(savedPhone)
    }

    // Load profile presets if available
    const savedProfile = localStorage.getItem("customer_profile")
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile))
      } catch (e) {
        console.error(e)
      }
    }
  }, [urlPhone])

  const fetchOrders = async (targetPhone: string) => {
    setLoadingOrders(true)
    try {
      const response = await fetch(`/api/orders?phone=${encodeURIComponent(targetPhone.trim())}`)
      if (!response.ok) {
        throw new Error("Failed to load orders")
      }
      const data = await response.json()
      setOrders(data)
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to retrieve order history")
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanPhone = phone.replace(/[\s-+]/g, "")
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(cleanPhone)) {
      toast.error("Please enter a valid 10-digit Indian mobile number")
      return
    }
    localStorage.setItem("customer_phone", cleanPhone)
    setIsLoggedIn(true)
    fetchOrders(cleanPhone)
    toast.success("Logged in successfully!")
  }

  const handleLogout = () => {
    localStorage.removeItem("customer_phone")
    setPhone("")
    setIsLoggedIn(false)
    setOrders([])
    router.push("/profile")
    toast.success("Logged out successfully")
  }

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("customer_profile", JSON.stringify(profile))
    toast.success("Shipping address presets saved successfully!")
  }

  const getStatusBadge = (status: string) => {
    const base = "px-2.5 py-1 text-xs font-bold rounded-full "
    switch (status.toLowerCase()) {
      case "pending":
        return <span className={base + "bg-amber-100 dark:bg-amber-950/40 text-amber-600"}>Pending review</span>
      case "shipped":
        return <span className={base + "bg-blue-100 dark:bg-blue-950/40 text-blue-600"}>Shipped</span>
      case "delivered":
        return <span className={base + "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600"}>Delivered</span>
      case "cancelled":
        return <span className={base + "bg-destructive/10 text-destructive"}>Cancelled</span>
      default:
        return <span className={base + "bg-secondary text-secondary-foreground"}>{status}</span>
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl opacity-60" />

        <div className="container mx-auto px-4 max-w-6xl relative">
          {!isLoggedIn ? (
            /* Login Form Interface */
            <div className="max-w-md mx-auto py-12">
              <Card className="p-8 border-border/80 shadow-xl bg-card/60 backdrop-blur-xl flex flex-col items-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-inner">
                  <User className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-center mb-2">Customer Space</h2>
                <p className="text-muted-foreground text-center text-sm mb-8 max-w-xs">
                  Enter your 10-digit Mobile Number below to access your order history and track shipping status.
                </p>

                <form onSubmit={handleLogin} className="w-full space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone" className="text-sm font-semibold">
                      Mobile Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="bg-background/80"
                    />
                  </div>
                  <Button type="submit" className="w-full font-bold shadow-md shadow-primary/20 h-11">
                    Retrieve My Orders
                  </Button>
                </form>
              </Card>
            </div>
          ) : (
            /* Dashboard Workspace Interface */
            <div>
              {/* Header dashboard banner */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-border/40">
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight mb-2">My Workspace</h1>
                  <p className="text-muted-foreground text-sm">
                    Logged in mobile: <span className="font-semibold text-foreground">{phone}</span>
                  </p>
                </div>
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-destructive font-semibold border" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>

              <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Left: Orders history (col span 8) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <span>Order History ({orders.length})</span>
                    </h3>
                    <Button variant="ghost" size="icon" className="border h-8 w-8" onClick={() => fetchOrders(phone)}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>

                  {loadingOrders ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-center w-full">
                      <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                      <p className="text-xs text-muted-foreground font-semibold">Updating order feed...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <Card className="p-10 border-dashed text-center flex flex-col items-center gap-4">
                      <Search className="h-10 w-10 text-muted-foreground" />
                      <h4 className="font-bold text-lg">No Orders Placed Yet</h4>
                      <p className="text-muted-foreground text-sm max-w-sm">
                        We could not find any previous transaction history associated with this mobile number.
                      </p>
                      <Button onClick={() => router.push("/#products")} size="sm" className="mt-2">
                        Start Shopping
                      </Button>
                    </Card>
                  ) : (
                    orders.map((order) => {
                      const grandTotal = order.total + Math.round(order.total * 0.18)
                      return (
                        <Card key={order.orderId} className="p-6 border-border shadow-sm bg-card/60 backdrop-blur-xl flex flex-col gap-6 hover:shadow-md transition-shadow">
                          {/* Order metadata banner */}
                          <div className="flex flex-wrap justify-between items-center gap-4 border-b border-border/20 pb-4 text-sm">
                            <div className="space-y-1">
                              <p className="font-extrabold text-base">
                                Order ID: <span className="font-mono text-primary">{order.orderId}</span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Placed on: {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              {getStatusBadge(order.status)}
                            </div>
                          </div>

                          {/* Items Grid list */}
                          <div className="space-y-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-4 items-center">
                                <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
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

                          {/* Live interactive tracking timeline */}
                          {order.status !== "Cancelled" && (
                            <div className="pt-4 border-t border-border/10">
                              <h5 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">
                                Live Tracking Progress:
                              </h5>
                              <div className="grid grid-cols-4 gap-2 relative">
                                {/* Connecting horizontal progress line */}
                                <div className="absolute top-4 left-[12%] right-[12%] h-0.5 bg-muted z-0">
                                  <div
                                    className="h-full bg-emerald-500 transition-all duration-500"
                                    style={{
                                      width:
                                        order.status === "Delivered"
                                          ? "100%"
                                          : order.status === "Shipped"
                                          ? "66%"
                                          : "33%",
                                    }}
                                  />
                                </div>

                                {/* Step 1: Placed */}
                                <div className="flex flex-col items-center text-center gap-1.5 z-10">
                                  <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                                    <CheckCircle className="h-4 w-4" />
                                  </div>
                                  <span className="text-[10px] font-extrabold">Placed</span>
                                </div>

                                {/* Step 2: Custom review */}
                                <div className="flex flex-col items-center text-center gap-1.5 z-10">
                                  <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                                    <CheckCircle className="h-4 w-4" />
                                  </div>
                                  <span className="text-[10px] font-extrabold">Photos OK</span>
                                </div>

                                {/* Step 3: Shipped */}
                                <div className="flex flex-col items-center text-center gap-1.5 z-10">
                                  <div
                                    className={`h-8 w-8 rounded-full flex items-center justify-center shadow-md ${
                                      order.status === "Shipped" || order.status === "Delivered"
                                        ? "bg-emerald-500 text-white"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    <Truck className="h-4 w-4" />
                                  </div>
                                  <span className="text-[10px] font-extrabold">Shipped</span>
                                </div>

                                {/* Step 4: Delivered */}
                                <div className="flex flex-col items-center text-center gap-1.5 z-10">
                                  <div
                                    className={`h-8 w-8 rounded-full flex items-center justify-center shadow-md ${
                                      order.status === "Delivered"
                                        ? "bg-emerald-500 text-white"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    <PackageCheck className="h-4 w-4" />
                                  </div>
                                  <span className="text-[10px] font-extrabold">Delivered</span>
                                </div>
                              </div>

                              {/* Carrier & Tracking details */}
                              {order.trackingNumber && (
                                <div className="mt-6 p-3 rounded-lg border border-primary/10 bg-primary/5 flex justify-between items-center text-xs">
                                  <div>
                                    <p className="font-semibold text-muted-foreground">Carrier: Express Deliveries</p>
                                    <p className="font-bold text-foreground">
                                      Tracking ID: <span className="font-mono">{order.trackingNumber}</span>
                                    </p>
                                  </div>
                                  <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-md uppercase">
                                    Transit
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Footer aggregate pricing */}
                          <div className="flex justify-between items-center pt-4 border-t border-border/20 text-sm">
                            <span className="text-muted-foreground">Payment: {order.paymentMethod}</span>
                            <span className="text-base font-extrabold">
                              Paid Total: <span className="text-lg text-primary">₹{grandTotal}</span>
                            </span>
                          </div>
                        </Card>
                      )
                    })
                  )}
                </div>

                {/* Right: Address Presets (col span 4) */}
                <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-28">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="text-2xl font-bold">Address Presets</h3>
                  </div>

                  <Card className="p-6 border-border shadow-sm bg-card/60 backdrop-blur-xl">
                    <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                      Save your shipping address settings here so they automatically pre-populate during your next e-commerce checkout.
                    </p>

                    <form onSubmit={handleProfileSave} className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="prof_name" className="text-xs font-semibold">
                          Name
                        </Label>
                        <Input
                          id="prof_name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          placeholder="John Doe"
                          className="bg-background/80"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="prof_phone" className="text-xs font-semibold">
                          Phone
                        </Label>
                        <Input
                          id="prof_phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="bg-background/80"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="prof_address" className="text-xs font-semibold">
                          Street Address
                        </Label>
                        <Input
                          id="prof_address"
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          placeholder="Street name, Flat/House number"
                          className="bg-background/80"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="prof_city" className="text-xs font-semibold">
                            City
                          </Label>
                          <Input
                            id="prof_city"
                            value={profile.city}
                            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                            placeholder="Mumbai"
                            className="bg-background/80"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="prof_zip" className="text-xs font-semibold">
                            Postal Code
                          </Label>
                          <Input
                            id="prof_zip"
                            value={profile.zip}
                            onChange={(e) => setProfile({ ...profile, zip: e.target.value })}
                            placeholder="400001"
                            className="bg-background/80"
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full font-bold mt-4 shadow-sm">
                        Save Presets
                      </Button>
                    </form>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center gap-4 text-center">
          <RefreshCw className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-semibold">Loading user workspace...</p>
        </div>
        <Footer />
      </main>
    }>
      <ProfileContent />
    </Suspense>
  )
}
