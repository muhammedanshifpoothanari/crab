"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Clock,
  Eye,
  Edit2,
  Trash2,
  Plus,
  UploadCloud,
  Users,
  Search,
  RefreshCw,
  X,
  FileSpreadsheet,
  Library,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  MonitorPlay,
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

interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice: number
  image: string
  category: string
  details: string
  features: string[]
  barcode?: string
}

interface Collection {
  id: string
  name: string
  icon: string
  count: number
}

interface Banner {
  id: string
  image: string
  link: string
  isActive: boolean
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products" | "customers" | "collections" | "banners" | "marketing" | "settings">("overview")
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  
  // Marketing Promo Codes & dynamic combos
  const [coupons, setCoupons] = useState<any[]>([])
  const [newCouponForm, setNewCouponForm] = useState({ code: "", discountPct: 20 })

  // Admin Credentials Authentication
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [adminUsername, setAdminUsername] = useState("")
  const [adminPassword, setAdminPassword] = useState("")

  // Loading status
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingCollections, setLoadingCollections] = useState(false)
  const [loadingBanners, setLoadingBanners] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingAdditionalImage, setUploadingAdditionalImage] = useState(false)
  const [loadingLeads, setLoadingLeads] = useState(false)

  // Abandoned checkouts list & payment settings
  const [abandonedLeads, setAbandonedLeads] = useState<any[]>([])
  const [adminPaymentSettings, setAdminPaymentSettings] = useState({
    cardEnabled: true,
    upiEnabled: true,
    codEnabled: true,
    whatsappCheckoutEnabled: false,
    adminWhatsAppNumber: "919876543210",
  })

  // Filtering searches
  const [orderQuery, setOrderQuery] = useState("")
  const [productQuery, setProductQuery] = useState("")
  const [collectionQuery, setCollectionQuery] = useState("")

  // Product CRUD states
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Collection CRUD states
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [collectionForm, setCollectionForm] = useState({
    id: "",
    name: "",
    icon: "Heart",
    image: "",
  })
  const [uploadingCollectionImage, setUploadingCollectionImage] = useState(false)
  
  // Banner CRUD states
  const [showBannerModal, setShowBannerModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [bannerForm, setBannerForm] = useState({
    image: "",
    link: "",
    isActive: true,
  })
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false)

  // Add/Edit Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    image: "",
    additionalImages: [] as string[],
    category: "couples",
    details: "",
    featuresText: "",
    barcode: "",
  })

  // Order Details Modal states
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)
  const [viewingLeadCart, setViewingLeadCart] = useState<any | null>(null)
  const [selectedCustomerPhone, setSelectedCustomerPhone] = useState<string | null>(null)
  const [recoveringLead, setRecoveringLead] = useState<any | null>(null)
  const [isProcessingRecovery, setIsProcessingRecovery] = useState(false)
  const [orderStatusForm, setOrderStatusForm] = useState({
    status: "Pending",
    trackingNumber: "",
    customerName: "",
    paymentStatus: "Pending",
  })

  const [returns, setReturns] = useState<any[]>([])
  const [loadingReturns, setLoadingReturns] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returningOrder, setReturningOrder] = useState<Order | null>(null)
  const [editingReturnId, setEditingReturnId] = useState<string | null>(null)
  const [returnForm, setReturnForm] = useState({
    returnedItems: {} as { [productId: string]: number },
    refundAmount: "",
    reason: "Transit damage",
  })

  // Customer & Sales Manual CRUD UI States
  const [isEditingCustomer, setIsEditingCustomer] = useState(false)
  const [customerEditForm, setCustomerEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })

  const [isCreatingManualOrder, setIsCreatingManualOrder] = useState(false)
  const [manualOrderForm, setManualOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending COD verification",
    items: [] as { product: Product; quantity: number }[],
    status: "Pending",
  })


  const fetchReturns = async () => {
    setLoadingReturns(true)
    try {
      const res = await fetch("/api/returns")
      if (res.ok) {
        const data = await res.json()
        setReturns(data)
      }
    } catch (err) {
      console.error("Failed to fetch returns:", err)
    } finally {
      setLoadingReturns(false)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("admin_authenticated") === "true") {
      setIsAdminLoggedIn(true)
    }
    fetchOrders()
    fetchProducts()
    fetchCollections()
    fetchBanners()
    fetchAdminPaymentSettings()
    fetchAbandonedLeads()
    fetchReturns()
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/coupons")
      const data = await res.json()
      if (data && !data.error) {
        setCoupons(data)
      }
    } catch (err) {
      console.error("Error loading coupons:", err)
    }
  }

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCouponForm.code.trim()) return
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCouponForm.code.trim().toUpperCase(),
          discountPct: Number(newCouponForm.discountPct),
          isActive: true
        })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Coupon code ${newCouponForm.code.toUpperCase()} created successfully!`)
        setNewCouponForm({ code: "", discountPct: 20 })
        fetchCoupons()
      } else {
        toast.error(data.error || "Failed to create coupon code")
      }
    } catch (err) {
      toast.error("Failed to create coupon code")
    }
  }

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo code?")) return
    try {
      const res = await fetch(`/api/coupons?id=${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        toast.success("Coupon code deleted successfully!")
        fetchCoupons()
      } else {
        toast.error("Failed to delete coupon code")
      }
    } catch (err) {
      toast.error("Failed to delete coupon code")
    }
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminUsername.trim() === "admin" && adminPassword.trim() === "1234") {
      setIsAdminLoggedIn(true)
      sessionStorage.setItem("admin_authenticated", "true")
      toast.success("Access authorized. Welcome back, Commander.")
    } else {
      toast.error("Invalid credentials. Security lockout initiated.")
    }
  }

  const fetchAdminPaymentSettings = async () => {
    try {
      const res = await fetch("/api/settings")
      const data = await res.json()
      if (data && !data.error) {
        setAdminPaymentSettings({
          cardEnabled: data.cardEnabled ?? true,
          upiEnabled: data.upiEnabled ?? true,
          codEnabled: data.codEnabled ?? true,
          whatsappCheckoutEnabled: data.whatsappCheckoutEnabled ?? false,
          adminWhatsAppNumber: data.adminWhatsAppNumber ?? "919876543210",
        })
      }
    } catch (err) {
      console.error("Error loading payment preferences:", err)
    }
  }

  const handleUpdatePaymentSetting = async (key: string, value: any) => {
    const updated = { ...adminPaymentSettings, [key]: value }
    setAdminPaymentSettings(updated)
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      })
      if (!res.ok) throw new Error()
      toast.success("Preferences synchronized successfully!")
    } catch (err) {
      toast.error("Failed to synchronize preferences")
    }
  }

  const fetchAbandonedLeads = async () => {
    setLoadingLeads(true)
    try {
      const res = await fetch("/api/abandoned")
      const data = await res.json()
      if (data && !data.error) {
        setAbandonedLeads(data)
      }
    } catch (err) {
      console.error("Error fetching abandoned carts:", err)
    } finally {
      setLoadingLeads(false)
    }
  }

  const fetchBanners = async () => {
    setLoadingBanners(true)
    try {
      const res = await fetch("/api/banners")
      if (!res.ok) throw new Error("Failed to fetch banners")
      const data = await res.json()
      setBanners(data)
    } catch (e: any) {
      console.error(e)
      toast.error("Failed to load banners")
    } finally {
      setLoadingBanners(false)
    }
  }

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bannerForm.image) {
      toast.error("Image is required for banner")
      return
    }

    try {
      const isEditing = !!editingBanner
      const url = isEditing ? `/api/banners/${editingBanner.id}` : "/api/banners"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bannerForm),
      })

      if (!res.ok) throw new Error("Failed to save banner")

      toast.success(isEditing ? "Banner updated successfully!" : "Banner created successfully!")
      setShowBannerModal(false)
      setBannerForm({ image: "", link: "", isActive: true })
      setEditingBanner(null)
      fetchBanners()
    } catch (err) {
      console.error(err)
      toast.error("Failed to save banner")
    }
  }

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return

    try {
      const res = await fetch(`/api/banners/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete banner")

      toast.success("Banner deleted successfully")
      fetchBanners()
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete banner")
    }
  }

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner)
    setBannerForm({
      image: banner.image || "",
      link: banner.link || "",
      isActive: banner.isActive,
    })
    setShowBannerModal(true)
  }

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingBannerImage(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Image upload failed")
      const data = await res.json()
      
      setBannerForm((prev) => ({ ...prev, image: data.url }))
      toast.success("Banner image uploaded successfully!")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to upload file")
    } finally {
      setUploadingBannerImage(false)
    }
  }

  const fetchCollections = async () => {
    setLoadingCollections(true)
    try {
      const res = await fetch("/api/collections")
      if (!res.ok) throw new Error("Failed to fetch collections")
      const data = await res.json()
      setCollections(data)
    } catch (e: any) {
      console.error(e)
      toast.error("Failed to load collections catalog")
    } finally {
      setLoadingCollections(false)
    }
  }

  const handleCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!collectionForm.id || !collectionForm.name || !collectionForm.icon) {
      toast.error("All fields are required")
      return
    }

    try {
      const isEditing = !!editingCollection
      const url = isEditing ? `/api/collections/${editingCollection.id}` : "/api/collections"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collectionForm),
      })

      if (!res.ok) throw new Error("Failed to save collection")

      toast.success(isEditing ? "Collection updated successfully!" : "Collection created successfully!")
      setShowCollectionModal(false)
      setCollectionForm({ id: "", name: "", icon: "Heart", image: "" })
      setEditingCollection(null)
      fetchCollections()
    } catch (err) {
      console.error(err)
      toast.error("Failed to save collection category")
    }
  }

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection)
    setCollectionForm({
      id: collection.id,
      name: collection.name,
      icon: collection.icon,
      image: collection.image || "",
    })
    setShowCollectionModal(true)
  }

  const handleDeleteCollection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection category?")) return

    try {
      const res = await fetch(`/api/collections/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete collection")

      toast.success("Collection deleted successfully")
      fetchCollections()
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete collection")
    }
  }

  // Handle collection reorder (move up/down)
  const handleMoveCollection = async (index: number, direction: "up" | "down") => {
    if (collectionQuery) {
      toast.error("Clear the search filter before reordering.")
      return
    }
    const list = [...collections]
    const swapIndex = direction === "up" ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= list.length) return

    const reordered = [...list]
    const temp = reordered[index]
    reordered[index] = reordered[swapIndex]
    reordered[swapIndex] = temp

    setCollections(reordered)

    try {
      const res = await fetch("/api/collections/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: reordered.map((c) => c.id) }),
      })
      if (!res.ok) throw new Error("Reorder failed")
      toast.success(`Collection moved ${direction}!`)
    } catch (err) {
      console.error(err)
      toast.error("Failed to persist collection order")
      fetchCollections()
    }
  }

  const handleRecoverLeadCheckout = async (lead: any, paymentStatus: "Paid" | "Credit") => {
    setIsProcessingRecovery(true)
    try {
      const orderPayload = {
        customer: {
          name: `Recovered Lead Customer (+91 ${lead.phone})`,
          email: "crabsown@gmail.com",
          phone: lead.phone,
          address: "Karunagappally, Kerala, India (Recovered Abandoned Cart)",
          city: "Karunagappally",
          state: "Kerala",
          zip: "690518",
        },
        items: lead.items,
        total: lead.total,
        paymentMethod: paymentStatus === "Paid" ? "Direct Recovery Payment" : "Cash on Delivery (Credit Outstanding)",
        paymentDetails: {
          paymentStatus: paymentStatus,
          recoveredAt: new Date().toISOString(),
        },
        status: "Delivered",
      }

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      })
      if (!orderRes.ok) throw new Error("Failed to convert lead checkout into order")

      toast.success(`Checkout lead recovered successfully! Recorded under ${paymentStatus === "Paid" ? "Sales (Paid)" : "Credit (Outstanding)"}`)
      setViewingLeadCart(null)
      setRecoveringLead(null)

      fetchOrders()
      fetchAbandonedLeads()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to recover abandoned cart checkout")
    } finally {
      setIsProcessingRecovery(false)
    }
  }

  const handlePrintDeliverySlip = (order: any) => {
    const orderTotalWithTax = order.total + Math.round(order.total * 0.18)
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const itemsHtml = order.items.map((item: any) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 0; font-weight: bold; font-size: 14px;">${item.name}</td>
        <td style="padding: 12px 0; text-align: center; font-size: 14px;">${item.quantity}</td>
        <td style="padding: 12px 0; text-align: right; font-size: 14px;">₹${item.price}</td>
        <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 14px;">₹${item.price * item.quantity}</td>
      </tr>
    `).join("")

    printWindow.document.write(`
      <html>
        <head>
          <title>Delivery Slip - ${order.orderId}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: 900; color: #10b981; text-transform: uppercase; letter-spacing: 1px; }
            .title { font-size: 20px; font-weight: bold; text-align: right; color: #666; }
            .section-title { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #999; letter-spacing: 1px; margin-bottom: 8px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .status-banner { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; padding: 15px; border-radius: 8px; font-weight: bold; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .status-banner.pending { background: #fffbeb; border: 1px solid #fef3c7; color: #b45309; }
            .status-banner.shipped { background: #eff6ff; border: 1px solid #dbeafe; color: #1d4ed8; }
            .status-banner.cancelled { background: #fef2f2; border: 1px solid #fee2e2; color: #b91c1c; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { border-bottom: 2px solid #eee; padding-bottom: 10px; text-align: left; font-size: 12px; font-weight: bold; color: #666; }
            .totals { float: right; width: 300px; margin-top: 20px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
            .footer { border-top: 1px solid #eee; margin-top: 80px; padding-top: 20px; text-align: center; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">🛒 CrabsCart</div>
              <div style="font-size: 12px; color: #666; margin-top: 5px;">Premium Custom Bobbleheads Store</div>
            </div>
            <div class="title">
              DELIVERY SLIP / INVOICE
              <div style="font-size: 14px; font-weight: normal; color: #999; margin-top: 5px;">Order Ref: ${order.orderId}</div>
            </div>
          </div>

          <div class="status-banner ${order.status.toLowerCase()}">
            <span>Fulfillment Status: ${order.status.toUpperCase()}</span>
            <span>Tracking Number: ${order.trackingNumber || "N/A"}</span>
          </div>

          <div class="grid">
            <div>
              <div class="section-title">Client Billing details</div>
              <strong style="font-size: 16px;">${order.customer.name || "Valued Customer"}</strong>
              <div style="margin-top: 5px; color: #555;">
                Email: ${order.customer.email}<br>
                Phone: ${order.customer.phone}
              </div>
            </div>
            <div>
              <div class="section-title">Shipping destination</div>
              <div style="font-size: 14px; line-height: 1.6; color: #555;">
                ${order.customer.address}<br>
                ${order.customer.city}, ${order.customer.state} - ${order.customer.zip}
              </div>
            </div>
          </div>

          <div class="section-title">Order itemization</div>
          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Product Details</th>
                <th style="width: 10%; text-align: center;">Qty</th>
                <th style="width: 20%; text-align: right;">Unit Price</th>
                <th style="width: 20%; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="overflow: hidden;">
            <div class="totals">
              <div class="totals-row">
                <span>Basket Subtotal:</span>
                <span>₹${order.total}</span>
              </div>
              <div class="totals-row">
                <span>Estimated Tax (18% GST):</span>
                <span>₹${Math.round(order.total * 0.18)}</span>
              </div>
              <div class="totals-row" style="border-top: 1px solid #ddd; padding-top: 12px; font-weight: bold; font-size: 18px; color: #10b981;">
                <span>Total Amount:</span>
                <span>₹${orderTotalWithTax}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <strong>CrabsCart Operations Hub</strong><br>
            Karunagappally, Kerala, India | crabsown@gmail.com | +91 94007 57707<br>
            Thank you for your business! This is a computer generated delivery document.
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const fetchOrders = async () => {
    setLoadingOrders(true)
    try {
      const res = await fetch("/api/orders")
      if (!res.ok) throw new Error("Failed to fetch orders")
      const data = await res.json()
      setOrders(data)
    } catch (e: any) {
      console.error(e)
      toast.error("Failed to load orders catalog")
    } finally {
      setLoadingOrders(false)
    }
  }

  const fetchProducts = async () => {
    setLoadingProducts(true)
    try {
      const res = await fetch("/api/products")
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      setProducts(data)
    } catch (e: any) {
      console.error(e)
      toast.error("Failed to load products inventory")
    } finally {
      setLoadingProducts(false)
    }
  }

  // Handle Cloudinary Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Image upload failed")
      const data = await res.json()
      
      setProductForm((prev) => ({ ...prev, image: data.url }))
      toast.success("Image uploaded to Cloudinary successfully!")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to upload file")
    } finally {
      setUploadingImage(false)
    }
  }

  // Handle Cloudinary Additional Image Upload (for multiple product images)
  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAdditionalImage(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Image upload failed")
      const data = await res.json()

      setProductForm((prev) => ({
        ...prev,
        additionalImages: [...prev.additionalImages, data.url],
      }))
      toast.success("Additional image uploaded!")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to upload additional image")
    } finally {
      setUploadingAdditionalImage(false)
    }
  }

  const removeAdditionalImage = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }))
  }

  // Handle Cloudinary Collection Image Upload
  const handleCollectionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCollectionImage(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Image upload failed")
      const data = await res.json()
      
      setCollectionForm((prev) => ({ ...prev, image: data.url }))
      toast.success("Category banner uploaded to Cloudinary successfully!")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to upload file")
    } finally {
      setUploadingCollectionImage(false)
    }
  }

  // Handle product save (create/update)
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productForm.name || !productForm.price || !productForm.category) {
      toast.error("Please fill in required fields")
      return
    }

    const generatedBarcode = productForm.barcode.trim() || Math.floor(1000000000000 + Math.random() * 9000000000000).toString().substring(0, 13)

    const payload = {
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice || productForm.price),
      image: productForm.image || "/placeholder.svg",
      additionalImages: productForm.additionalImages.filter(Boolean),
      category: productForm.category,
      details: productForm.details,
      features: productForm.featuresText
        ? productForm.featuresText.split(",").map((f) => f.trim()).filter(Boolean)
        : [],
      barcode: generatedBarcode,
    }

    try {
      let res
      if (editingProduct) {
        // Update product
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        // Create product
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) throw new Error("Failed to save product")
      
      toast.success(editingProduct ? "Product updated successfully!" : "Product created successfully!")
      setShowProductModal(false)
      setEditingProduct(null)
      fetchProducts()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Error saving product specs")
    }
  }

  // Handle product delete
  const handleProductDelete = async (id: number) => {
    if (!confirm("Are you absolutely sure you want to delete this product? This action is irreversible.")) return

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Delete failed")
      
      toast.success("Product deleted successfully")
      fetchProducts()
    } catch (e: any) {
      console.error(e)
      toast.error("Failed to delete product")
    }
  }

  // Edit product initiator
  const initiateEditProduct = (prod: Product) => {
    setEditingProduct(prod)
    setProductForm({
      name: prod.name,
      description: prod.description || "",
      price: prod.price.toString(),
      originalPrice: prod.originalPrice.toString(),
      image: prod.image || "",
      additionalImages: prod.additionalImages || [],
      category: prod.category || "couples",
      details: prod.details || "",
      featuresText: prod.features ? prod.features.join(", ") : "",
      barcode: prod.barcode || "",
    })
    setShowProductModal(true)
  }

  // Initiator for creating a brand new product
  const initiateAddProduct = () => {
    setEditingProduct(null)
    setProductForm({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      image: "",
      additionalImages: [],
      category: "couples",
      details: "",
      featuresText: "",
      barcode: "",
    })
    setShowProductModal(true)
  }

  // Update order status/tracking ID
  const handleOrderUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!viewingOrder) return

    try {
      const res = await fetch(`/api/orders/${viewingOrder.orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderStatusForm),
      })

      if (!res.ok) throw new Error("Order update failed")
      
      toast.success("Order details synchronized successfully!")
      setViewingOrder(null)
      fetchOrders()
    } catch (e: any) {
      console.error(e)
      toast.error("Failed to update order tracking details")
    }
  }

  const [processingReturn, setProcessingReturn] = useState(false)

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!returningOrder) return

    const returnedItemsPayload = returningOrder.items
      .map((item) => {
        const qty = returnForm.returnedItems[item.id] || 0
        return {
          productId: item.id || "unknown",
          name: item.name,
          quantity: Number(qty),
          price: item.price,
        }
      })
      .filter((item) => item.quantity > 0)

    if (returnedItemsPayload.length === 0) {
      toast.error("Please specify at least 1 item to return.")
      return
    }

    setProcessingReturn(true)
    try {
      const url = editingReturnId ? `/api/returns/${editingReturnId}` : "/api/returns"
      const method = editingReturnId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: returningOrder.orderId,
          returnedItems: returnedItemsPayload,
          refundAmount: Number(returnForm.refundAmount) || 0,
          reason: returnForm.reason,
        }),
      })

      if (res.ok) {
        toast.success(editingReturnId ? `Updated return transaction for ${returningOrder.orderId}!` : `Logged return transaction for ${returningOrder.orderId}!`)
        setShowReturnModal(false)
        setReturningOrder(null)
        setEditingReturnId(null)
        setViewingOrder(null)
        fetchOrders()
        fetchReturns()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to process return")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to connect to return logs server")
    } finally {
      setProcessingReturn(false)
    }
  }

  const handleDeleteReturn = async (returnId: string) => {
    if (!confirm("Are you sure you want to permanently delete this return record? The original order status will be recalculated.")) return
    
    try {
      const res = await fetch(`/api/returns/${returnId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Return record deleted successfully!")
        fetchOrders()
        fetchReturns()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to delete return")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to connect to return logs server")
    }
  }

  const initiateViewOrder = (order: Order) => {
    setViewingOrder(order)
    setOrderStatusForm({
      status: order.status,
      trackingNumber: order.trackingNumber || "",
      customerName: order.customer.name || "",
      paymentStatus: order.paymentDetails?.paymentStatus || (order.paymentMethod === "Cash on Delivery" ? "Pending" : "Paid"),
    })
  }

  // Delete an entire order & its returns
  const handleOrderDelete = async (orderId: string) => {
    if (!confirm("Are you absolutely sure you want to permanently delete this order and all associated return logs? This is irreversible!")) return

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete order")

      toast.success(`Order ${orderId} has been successfully deleted!`)
      setViewingOrder(null)
      fetchOrders()
      fetchReturns()
    } catch (e: any) {
      console.error(e)
      toast.error("Failed to delete order entry")
    }
  }

  // Update customer contact profile across all orders
  const handleCustomerUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/customers/${encodeURIComponent(customerEditForm.phone)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerEditForm),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Update failed")
      }

      toast.success("Customer contact details updated successfully across all historical orders!")
      setIsEditingCustomer(false)
      fetchOrders()
    } catch (e: any) {
      console.error(e)
      toast.error(e.message || "Failed to update customer details")
    }
  }

  // Purge a customer profile entirely
  const handleCustomerDelete = async (phone: string) => {
    if (!confirm("CRITICAL WARNING: Are you absolutely sure you want to delete this customer profile? This will permanently delete ALL orders and return logs under this phone number from MongoDB Atlas! This cannot be undone.")) return

    try {
      const res = await fetch(`/api/customers/${encodeURIComponent(phone)}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Purge failed")

      toast.success("Customer profile and all associated sales records purged successfully!")
      setSelectedCustomerPhone(null)
      fetchOrders()
      fetchReturns()
    } catch (e: any) {
      console.error(e)
      toast.error("Failed to purge customer profile")
    }
  }

  // Handle manually creating a new order (e.g. phone/WhatsApp sales)
  const handleManualOrderCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualOrderForm.name || !manualOrderForm.email || !manualOrderForm.phone || !manualOrderForm.address) {
      toast.error("Please fill in all required customer contact details.")
      return
    }

    if (manualOrderForm.items.length === 0) {
      toast.error("An order must have at least one product item.")
      return
    }

    // Calculate subtotal
    const subtotal = manualOrderForm.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: manualOrderForm.name,
            email: manualOrderForm.email,
            phone: manualOrderForm.phone,
            address: manualOrderForm.address,
            city: manualOrderForm.city,
            state: manualOrderForm.state,
            zip: manualOrderForm.zip,
          },
          items: manualOrderForm.items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image || "/placeholder.svg",
          })),
          total: subtotal,
          paymentMethod: manualOrderForm.paymentMethod,
          paymentDetails: {
            paymentStatus: manualOrderForm.paymentStatus,
          },
          status: manualOrderForm.status,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to create manual order")
      }

      toast.success("Manual order logged successfully in the system!")
      setIsCreatingManualOrder(false)
      // Reset form
      setManualOrderForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pending COD verification",
        items: [],
        status: "Pending",
      })
      fetchOrders()
    } catch (e: any) {
      console.error(e)
      toast.error(e.message || "Failed to log manual order")
    }
  }

  // Calculations for dashboard Overview Tab
  const totalRefunds = returns.reduce((sum, r) => sum + (Number(r.refundAmount) || 0), 0)

  const totalSales = Math.max(0, orders
    .filter((o) => o.status !== "Cancelled" && (o.paymentDetails?.paymentStatus === "Paid" || o.paymentMethod !== "Cash on Delivery"))
    .reduce((sum, o) => sum + (o.total + Math.round(o.total * 0.18)), 0) - totalRefunds)

  const totalCredit = orders
    .filter((o) => o.status !== "Cancelled" && (o.paymentDetails?.paymentStatus === "Credit" || (o.paymentMethod === "Cash on Delivery" && o.paymentDetails?.paymentStatus !== "Paid")))
    .reduce((sum, o) => sum + (o.total + Math.round(o.total * 0.18)), 0)

  // Purely dynamic calendar-month sales aggregator (No simulated or hardcoded values)
  const monthlyRevenue: { [key: string]: number } = {}
  orders
    .filter((o) => o.status !== "Cancelled" && (o.paymentDetails?.paymentStatus === "Paid" || o.paymentMethod !== "Cash on Delivery"))
    .forEach((o) => {
      const date = new Date(o.createdAt)
      const monthName = date.toLocaleString("en-US", { month: "short" })
      monthlyRevenue[monthName] = (monthlyRevenue[monthName] || 0) + (o.total + Math.round(o.total * 0.18))
    })

  // Deduct refunds from corresponding months
  returns.forEach((r) => {
    const matchingOrder = orders.find((o) => o.orderId === r.orderId)
    if (matchingOrder) {
      const date = new Date(matchingOrder.createdAt)
      const monthName = date.toLocaleString("en-US", { month: "short" })
      if (monthlyRevenue[monthName]) {
        monthlyRevenue[monthName] = Math.max(0, monthlyRevenue[monthName] - (Number(r.refundAmount) || 0))
      }
    }
  })

  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const dynamicMonths = Object.keys(monthlyRevenue).sort(
    (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
  )
  const maxMonthRev = Math.max(...Object.values(monthlyRevenue), 1)

  const totalOrdersCount = orders.length
  const aov = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0
  const pendingCount = orders.filter((o) => o.status === "Pending").length

  // Filter orders matching query
  const filteredOrders = orders.filter(
    (o) =>
      o.orderId.toLowerCase().includes(orderQuery.toLowerCase()) ||
      (o.customer.name || "Valued Customer").toLowerCase().includes(orderQuery.toLowerCase()) ||
      (o.customer.email || "").toLowerCase().includes(orderQuery.toLowerCase()) ||
      o.items.some((it: any) => (it.barcode || "").toLowerCase().includes(orderQuery.toLowerCase()) || (it.id || "").toString().toLowerCase().includes(orderQuery.toLowerCase()))
  )

  // Filter products matching query
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(productQuery.toLowerCase()) ||
      (p.barcode || "").toLowerCase().includes(productQuery.toLowerCase()) ||
      p.id.toString().toLowerCase().includes(productQuery.toLowerCase())
  )

  // Customer metrics aggregator
  const customersMap: { [phone: string]: { name: string; email: string; phone: string; count: number; spend: number } } = {}
  orders.forEach((o) => {
    const phoneKey = (o.customer.phone || "N/A").trim()
    const grandOrderTotal = o.total + Math.round(o.total * 0.18)
    if (!customersMap[phoneKey]) {
      customersMap[phoneKey] = {
        name: o.customer.name,
        email: o.customer.email || "N/A",
        phone: o.customer.phone || "N/A",
        count: 1,
        spend: o.status !== "Cancelled" ? grandOrderTotal : 0,
      }
    } else {
      customersMap[phoneKey].count += 1
      if (o.status !== "Cancelled") {
        customersMap[phoneKey].spend += grandOrderTotal
      }
    }
  })
  const customersList = Object.values(customersMap)

  if (!isAdminLoggedIn) {
    return (
      <main className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <section className="pt-36 pb-20 relative overflow-hidden flex-grow flex items-center justify-center">
          <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-primary/10 rounded-full blur-3xl opacity-40 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-accent/10 rounded-full blur-3xl opacity-40 animate-pulse" />

          <div className="container mx-auto px-4 relative z-10 flex justify-center">
            <div className="w-full max-w-md">
              <Card className="p-8 border-border/80 shadow-2xl bg-card/60 backdrop-blur-2xl rounded-2xl flex flex-col gap-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Admin Authentication</h2>
                  <p className="text-xs text-muted-foreground max-w-[280px]">
                    Access is strictly restricted to authorized platform operations managers.
                  </p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Username</label>
                    <Input
                      type="text"
                      required
                      placeholder="Enter admin username"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      className="bg-background/80"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Security PIN</label>
                    <Input
                      type="password"
                      required
                      placeholder="Enter security code"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="bg-background/80"
                    />
                  </div>
                  <Button type="submit" className="w-full font-bold shadow-md shadow-primary/20 h-11 mt-2">
                    Unlock Dashboard
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <section className="pt-28 pb-20 relative overflow-hidden">
        {/* Subtle decorative lights */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50" />

        <div className="container mx-auto px-4 max-w-7xl relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-border/40">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                Admin Control Room
              </h1>
              <p className="text-muted-foreground text-sm">
                Real-time dashboard managing MongoDB inventory pipelines and custom photo orders.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  fetchOrders()
                  fetchProducts()
                  toast.success("Database inventories synchronized!")
                }}
                className="gap-2 font-semibold border-border bg-background hover:bg-secondary/40 h-10 px-4"
              >
                <RefreshCw className="h-4 w-4" />
                Sync Atlas
              </Button>
            </div>
          </div>

          {/* Grid Layout: Sidebar Navigation & Workspace Tabs */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar navigation controls */}
            <div className="lg:col-span-3 flex flex-col gap-2">
              <Button
                variant={activeTab === "overview" ? "secondary" : "ghost"}
                className="w-full justify-start font-bold h-11 text-sm gap-3"
                onClick={() => setActiveTab("overview")}
              >
                <TrendingUp className="h-5 w-5" />
                Overview & Analytics
              </Button>
              <Button
                variant={activeTab === "orders" ? "secondary" : "ghost"}
                className="w-full justify-start font-bold h-11 text-sm gap-3"
                onClick={() => setActiveTab("orders")}
              >
                <ShoppingBag className="h-5 w-5" />
                Orders Management
                {pendingCount > 0 && (
                  <span className="ml-auto bg-amber-500 text-white rounded-full text-xs h-5 px-1.5 flex items-center justify-center font-extrabold">
                    {pendingCount}
                  </span>
                )}
              </Button>
              <Button
                variant={activeTab === "products" ? "secondary" : "ghost"}
                className="w-full justify-start font-bold h-11 text-sm gap-3"
                onClick={() => setActiveTab("products")}
              >
                <FileSpreadsheet className="h-5 w-5" />
                Product CRUD Manager
              </Button>
              <Button
                variant={activeTab === "customers" ? "secondary" : "ghost"}
                className="w-full justify-start font-bold h-11 text-sm gap-3"
                onClick={() => setActiveTab("customers")}
              >
                <Users className="h-5 w-5" />
                Customers Registry
              </Button>
              <Button
                variant={activeTab === "collections" ? "secondary" : "ghost"}
                className="w-full justify-start font-bold h-11 text-sm gap-3"
                onClick={() => setActiveTab("collections")}
              >
                <Library className="h-5 w-5" />
                Collections Manager
              </Button>
              <Button
                variant={activeTab === "banners" ? "secondary" : "ghost"}
                className="w-full justify-start font-bold h-11 text-sm gap-3"
                onClick={() => setActiveTab("banners")}
              >
                <MonitorPlay className="h-5 w-5" />
                Banners Manager
              </Button>
              <Button
                variant={activeTab === "marketing" ? "secondary" : "ghost"}
                className="w-full justify-start font-bold h-11 text-sm gap-3"
                onClick={() => setActiveTab("marketing")}
              >
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <span>Offers & Coupons</span>
              </Button>
              <Button
                variant={activeTab === "returns" ? "secondary" : "ghost"}
                className="w-full justify-start font-bold h-11 text-sm gap-3"
                onClick={() => setActiveTab("returns")}
              >
                <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 6.3H18" />
                </svg>
                <span>Returns & Conflicts</span>
              </Button>
              <Button
                variant={activeTab === "settings" ? "secondary" : "ghost"}
                className="w-full justify-start font-bold h-11 text-sm gap-3"
                onClick={() => setActiveTab("settings")}
              >
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Store & Delivery</span>
              </Button>
            </div>

            {/* Main workspace container (col span 9) */}
            <div className="lg:col-span-9">
              {/* TAB 1: OVERVIEW & ANALYTICS */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Summary metric rows */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card className="p-5 flex flex-col gap-1 border-border shadow-sm">
                      <div className="flex justify-between items-center text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                        <span>Revenue</span>
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-2xl font-black mt-1">₹{totalSales}</span>
                      <p className="text-[10px] text-muted-foreground mt-2">Active paid revenue</p>
                    </Card>

                    <Card className="p-5 flex flex-col gap-1 border-border shadow-sm">
                      <div className="flex justify-between items-center text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                        <span>Orders</span>
                        <ShoppingBag className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-2xl font-black mt-1">{totalOrdersCount}</span>
                      <p className="text-[10px] text-muted-foreground mt-2">Total transactional counts</p>
                    </Card>

                    <Card className="p-5 flex flex-col gap-1 border-border shadow-sm">
                      <div className="flex justify-between items-center text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                        <span>Avg Ticket</span>
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-2xl font-black mt-1">₹{aov}</span>
                      <p className="text-[10px] text-muted-foreground mt-2">Average order value basket</p>
                    </Card>

                    <Card className="p-5 flex flex-col gap-1 border-border shadow-sm">
                      <div className="flex justify-between items-center text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                        <span>Photo Pending</span>
                        <Clock className="h-4 w-4 text-amber-500" />
                      </div>
                      <span className="text-2xl font-black mt-1 text-amber-500">{pendingCount}</span>
                      <p className="text-[10px] text-muted-foreground mt-2">Orders awaiting review</p>
                    </Card>

                    <Card className="p-5 flex flex-col gap-1 border-destructive/20 bg-destructive/5 text-destructive shadow-sm">
                      <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider">
                        <span>Credit Outstanding</span>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      </div>
                      <span className="text-2xl font-black mt-1">₹{totalCredit}</span>
                      <p className="text-[10px] text-destructive/80 mt-2">Unpaid credit balance</p>
                    </Card>
                  </div>
                  {/* Dynamic database-backed trend analysis chart */}
                  <Card className="p-6 md:p-8 border-border bg-card/40 backdrop-blur-xl">
                    <h3 className="text-lg font-bold mb-6">Revenue and Traffic Trend Analysis</h3>
                    <div className="h-[250px] w-full flex items-end gap-3 md:gap-6 border-b border-l border-border/60 pb-2 pl-2">
                      {dynamicMonths.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-muted-foreground/60 italic pb-8">
                          No revenue logs recorded in the database yet
                        </div>
                      ) : (
                        dynamicMonths.map((month) => {
                          const rev = monthlyRevenue[month]
                          const heightPct = Math.min(100, Math.max(15, Math.round((rev / maxMonthRev) * 90)))
                          const isCurrentMonth = new Date().toLocaleString("en-US", { month: "short" }) === month
                          return (
                            <div key={month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                              <div
                                className={`w-full ${isCurrentMonth ? "bg-primary" : "bg-primary/20 hover:bg-primary"} rounded-t-md transition-all duration-500 relative`}
                                style={{ height: `${heightPct}%` }}
                              >
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-extrabold bg-primary text-primary-foreground px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                                  ₹{rev}
                                </span>
                              </div>
                              <span className={`text-[9px] font-semibold uppercase ${isCurrentMonth ? "text-primary font-bold" : "text-muted-foreground"}`}>
                                {month} {isCurrentMonth && "(Live)"}
                              </span>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </Card>

                  {/* Real-time Administrative Controls & Leads Section */}
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {/* Panel 1: Global Payments Gateway Orchestrator */}
                    <Card className="p-6 border-border bg-card/60 backdrop-blur-xl flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span>Global Payment Gateway Orchestrator</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">Toggle active payment gateways in real-time on storefront checkouts.</p>

                        <div className="space-y-4 mt-6">
                          {/* Gateway 1: Credit / Debit cards */}
                          <div className="flex items-center justify-between p-3 rounded-lg border border-border/20 bg-background/50">
                            <div>
                              <p className="text-xs font-bold">Credit & Debit Cards</p>
                              <p className="text-[10px] text-muted-foreground">Visa, Mastercard, RuPay & Maestro Gateways</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleUpdatePaymentSetting("cardEnabled", !adminPaymentSettings.cardEnabled)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${adminPaymentSettings.cardEnabled ? "bg-primary" : "bg-muted"}`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${adminPaymentSettings.cardEnabled ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                          </div>

                          {/* Gateway 2: UPI */}
                          <div className="flex items-center justify-between p-3 rounded-lg border border-border/20 bg-background/50">
                            <div>
                              <p className="text-xs font-bold">Unified Payments Interface (UPI)</p>
                              <p className="text-[10px] text-muted-foreground">BHIM, Google Pay, PhonePe, Paytm QR</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleUpdatePaymentSetting("upiEnabled", !adminPaymentSettings.upiEnabled)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${adminPaymentSettings.upiEnabled ? "bg-primary" : "bg-muted"}`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${adminPaymentSettings.upiEnabled ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                          </div>

                          {/* Gateway 3: COD */}
                          <div className="flex items-center justify-between p-3 rounded-lg border border-border/20 bg-background/50">
                            <div>
                              <p className="text-xs font-bold">Cash on Delivery (COD)</p>
                              <p className="text-[10px] text-muted-foreground">Accept cash pay-outs on destination delivery</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleUpdatePaymentSetting("codEnabled", !adminPaymentSettings.codEnabled)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${adminPaymentSettings.codEnabled ? "bg-primary" : "bg-muted"}`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${adminPaymentSettings.codEnabled ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                          </div>

                          {/* Gateway 4: WhatsApp checkout redirect */}
                          <div className="flex items-center justify-between p-3 rounded-lg border border-border/20 bg-background/50">
                            <div>
                              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Direct WhatsApp Ordering</p>
                              <p className="text-[10px] text-muted-foreground">Force "Buy It Now" clicks directly to business WhatsApp</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleUpdatePaymentSetting("whatsappCheckoutEnabled", !adminPaymentSettings.whatsappCheckoutEnabled)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${adminPaymentSettings.whatsappCheckoutEnabled ? "bg-emerald-500" : "bg-muted"}`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${adminPaymentSettings.whatsappCheckoutEnabled ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                          </div>

                          {/* WhatsApp number input */}
                          <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-border/20 bg-background/50 mt-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Business WhatsApp Number</label>
                            <div className="flex gap-2">
                              <Input
                                type="text"
                                placeholder="91XXXXXXXXXX"
                                value={adminPaymentSettings.adminWhatsAppNumber}
                                onChange={(e) => setAdminPaymentSettings({ ...adminPaymentSettings, adminWhatsAppNumber: e.target.value })}
                                className="h-9 text-xs bg-background"
                              />
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleUpdatePaymentSetting("adminWhatsAppNumber", adminPaymentSettings.adminWhatsAppNumber)}
                                className="h-9 px-3 text-xs bg-primary"
                              >
                                Save
                              </Button>
                            </div>
                            <span className="text-[9px] text-muted-foreground leading-normal">
                              Must include country code without "+" or spaces (e.g. 919400757707).
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-muted-foreground italic mt-4 border-t border-dashed border-border/20 pt-3">
                        Gateways dynamically bind checkout preferences instantly.
                      </div>
                    </Card>

                    {/* Panel 2: Abandoned Leads Recovery Workspace */}
                    <Card className="p-6 border-border bg-card/60 backdrop-blur-xl">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <svg className="h-5 w-5 text-orange-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>Abandoned Carts Leads</span>
                        </h3>
                        <span className="text-[9px] px-2 py-0.5 bg-orange-500/10 text-orange-600 font-extrabold uppercase rounded-full">
                          {abandonedLeads.length} Hot Leads
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">Recover prospective buyers who left items in their cart.</p>

                      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                        {loadingLeads ? (
                          <div className="py-10 text-center text-xs text-muted-foreground">Syncing hot leads...</div>
                        ) : abandonedLeads.length === 0 ? (
                          <div className="py-10 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
                            No abandoned checkouts currently. Good job!
                          </div>
                        ) : (
                          abandonedLeads.map((lead, idx) => (
                            <div key={idx} className="p-3 rounded-lg border border-border/20 bg-background/50 flex justify-between items-center text-xs gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="font-extrabold text-foreground">
                                  +91 {lead.phone}
                                </p>
                                <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                                  Items: {lead.items.map((it: any) => `${it.name} (${it.quantity})`).join(", ")}
                                </p>
                                <p className="text-[9px] text-muted-foreground/80 mt-0.5">
                                  Last updated: {new Date(lead.updatedAt).toLocaleTimeString()}
                                </p>
                              </div>
                              <div className="text-right flex flex-col items-end gap-1.5">
                                <span className="font-black text-primary text-sm">₹{lead.total}</span>
                                <div className="flex gap-1">
                                  <Button
                                    variant="outline"
                                    onClick={() => setViewingLeadCart(lead)}
                                    className="px-2 py-0.5 h-6 text-[9px] font-bold border border-border/80 text-foreground hover:bg-secondary/40 transition-colors uppercase tracking-wider"
                                  >
                                    View Cart 🛒
                                  </Button>
                                  <a
                                    href={`https://wa.me/91${lead.phone}?text=Hi! We noticed you left some lovely items in your Crabscart basket. Would you like a special combo discount to finalize your order?`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-0.5 h-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[9px] rounded uppercase tracking-wider flex items-center justify-center transition-all shadow shadow-emerald-700/10"
                                  >
                                    Recover
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* TAB 2: ORDERS MANAGEMENT */}
              {activeTab === "orders" && (
                <Card className="p-6 border-border bg-card/60 backdrop-blur-xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Orders Catalogue</h3>
                      <p className="text-xs text-muted-foreground">Monitor, update, delete, and manually create order sales files dynamically.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                      <div className="relative w-full sm:w-60">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search ID, Client name..."
                          value={orderQuery}
                          onChange={(e) => setOrderQuery(e.target.value)}
                          className="pl-9 bg-background/80 h-10"
                        />
                      </div>
                      <Button onClick={() => setIsCreatingManualOrder(true)} className="w-full sm:w-auto gap-2 font-bold h-10 px-4 shadow shadow-primary/25 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity">
                        <Plus className="h-4 w-4" />
                        Create Manual Order
                      </Button>
                    </div>
                  </div>

                  {loadingOrders ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                      <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                      <p className="text-xs text-muted-foreground">Syncing orders database...</p>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">No orders found matching search query.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-border/60 text-muted-foreground uppercase font-bold text-[10px] tracking-wider">
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Client Name</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Items</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((order) => {
                            const orderTotalWithTax = order.total + Math.round(order.total * 0.18)
                            return (
                              <tr key={order.orderId} className="border-b border-border/20 hover:bg-secondary/10 transition-colors">
                                <td className="py-3.5 px-4 font-mono font-bold text-primary">{order.orderId}</td>
                                <td className="py-3.5 px-4 font-semibold">{order.customer.name}</td>
                                <td className="py-3.5 px-4 text-muted-foreground">{order.customer.email}</td>
                                <td className="py-3.5 px-4 font-medium">
                                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                                </td>
                                <td className="py-3.5 px-4 font-bold">₹{orderTotalWithTax}</td>
                                <td className="py-3.5 px-4 font-semibold uppercase tracking-wider">
                                  {order.status === "Pending" && (
                                    <span className="text-[10px] px-2 py-0.5 bg-amber-100 dark:bg-amber-950/40 text-amber-600 rounded font-black">Pending</span>
                                  )}
                                  {order.status === "Shipped" && (
                                    <span className="text-[10px] px-2 py-0.5 bg-blue-100 dark:bg-blue-950/40 text-blue-600 rounded font-black">Shipped</span>
                                  )}
                                  {order.status === "Delivered" && (
                                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded font-black">Delivered</span>
                                  )}
                                  {order.status === "Cancelled" && (
                                    <span className="text-[10px] px-2 py-0.5 bg-destructive/10 text-destructive rounded font-black">Cancelled</span>
                                  )}
                                  {order.status === "Partially Returned" && (
                                    <span className="text-[10px] px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 rounded font-black">Partial Return</span>
                                  )}
                                  {order.status === "Returned" && (
                                    <span className="text-[10px] px-2 py-0.5 bg-rose-100 dark:bg-rose-950/40 text-rose-600 rounded font-black">Returned</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => initiateViewOrder(order)}
                                    className="h-7 px-2 font-semibold border-border bg-background hover:bg-secondary"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Manage
                                  </Button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              )}

              {/* TAB 3: PRODUCT CRUD MANAGER */}
              {activeTab === "products" && (
                <Card className="p-6 border-border bg-card/60 backdrop-blur-xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Products Catalogue</h3>
                      <p className="text-xs text-muted-foreground">Create, read, update, and delete figurines dynamically from MongoDB Atlas.</p>
                    </div>
                    <Button onClick={initiateAddProduct} className="gap-2 font-bold h-10 px-4 shadow shadow-primary/25">
                      <Plus className="h-4 w-4" />
                      Create Product
                    </Button>
                  </div>

                  <div className="relative w-full mb-6">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search title, category..."
                      value={productQuery}
                      onChange={(e) => setProductQuery(e.target.value)}
                      className="pl-9 bg-background/80"
                    />
                  </div>

                  {loadingProducts ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                      <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                      <p className="text-xs text-muted-foreground">Fetching live inventory...</p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">No products found matching query.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredProducts.map((product) => (
                        <Card key={product.id} className="p-4 border-border bg-background flex flex-col justify-between hover:shadow-md transition-shadow">
                          <div className="space-y-3">
                            <div className="relative aspect-square rounded-md overflow-hidden bg-muted">
                              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                            </div>
                            <div>
                              <span className="text-[10px] px-2 py-0.5 bg-secondary text-secondary-foreground font-black uppercase rounded-md">{product.category}</span>
                              <h4 className="font-bold text-sm mt-1.5 line-clamp-1">{product.name}</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1">{product.description}</p>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="font-black text-sm">₹{product.price}</span>
                              <span className="text-[9px] text-muted-foreground line-through">₹{product.originalPrice}</span>
                            </div>

                            <div className="flex flex-col items-center p-1 rounded bg-secondary/20 border border-border/30 max-w-[100px] overflow-hidden" title={`Barcode: ${product.barcode || `CRB-${product.id}`}`}>
                              <img 
                                src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(product.barcode || `CRB-${product.id}`)}&scale=1.5&height=9&includetext`}
                                alt="Barcode"
                                className="object-contain h-8 filter dark:invert"
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => initiateEditProduct(product)}
                                className="h-8 w-8 border-border hover:bg-secondary"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleProductDelete(product.id)}
                                className="h-8 w-8 border-destructive/20 hover:border-destructive text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* TAB 4: CUSTOMERS REGISTRY */}
              {activeTab === "customers" && (
                <Card className="p-6 border-border bg-card/60 backdrop-blur-xl">
                  <h3 className="text-xl font-bold mb-2">Registered Buyers Workspace</h3>
                  <p className="text-xs text-muted-foreground mb-6">Aggregated sales pipelines grouped by verified unique mobile phone numbers.</p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/60 text-muted-foreground uppercase font-bold text-[10px] tracking-wider">
                          <th className="py-3 px-4">Client Name</th>
                          <th className="py-3 px-4">Contact Phone</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4 text-center">Orders Count</th>
                          <th className="py-3 px-4 text-right">Cumulative Spending</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customersList.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-10 text-center text-muted-foreground">
                              No customer records available.
                            </td>
                          </tr>
                        ) : (
                          customersList.map((cust, idx) => (
                            <tr key={idx} className="border-b border-border/20 hover:bg-secondary/10 transition-colors">
                              <td className="py-3.5 px-4 font-semibold">{cust.name}</td>
                              <td className="py-3.5 px-4 font-mono font-semibold text-primary">{cust.phone}</td>
                              <td className="py-3.5 px-4 text-muted-foreground">{cust.email}</td>
                              <td className="py-3.5 px-4 text-center font-bold">{cust.count} orders</td>
                              <td className="py-3.5 px-4 text-right font-black text-emerald-600 dark:text-emerald-400">
                                ₹{cust.spend}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedCustomerPhone(cust.phone)}
                                  className="font-bold border-primary/20 hover:border-primary text-primary hover:bg-primary/5 h-8 gap-1 text-[10px] uppercase tracking-wider"
                                >
                                  View Dashboard 📊
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* TAB 5: COLLECTIONS MANAGER */}
              {activeTab === "collections" && (
                <Card className="p-6 border-border bg-card/60 backdrop-blur-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Collections & Category Workspace</h3>
                      <p className="text-xs text-muted-foreground">Manage e-commerce storefront collections, count metrics, and styles dynamic mapping.</p>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingCollection(null)
                        setCollectionForm({ id: "", name: "", icon: "Heart" })
                        setShowCollectionModal(true)
                      }}
                      className="font-bold gap-2 text-xs h-9"
                    >
                      <Plus className="h-4 w-4" />
                      Add Collection
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 bg-secondary/20 border border-border/40 rounded-xl px-3 py-1.5 w-full sm:max-w-xs">
                    <Search className="h-4 w-4 text-muted-foreground/60" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={collectionQuery}
                      onChange={(e) => setCollectionQuery(e.target.value)}
                      className="bg-transparent border-none text-xs focus:outline-none w-full"
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/60 text-muted-foreground uppercase font-bold text-[10px] tracking-wider">
                          <th className="py-3 px-4">Slug ID</th>
                          <th className="py-3 px-4">Collection Name</th>
                          <th className="py-3 px-4">Lucide Icon</th>
                          <th className="py-3 px-4 text-center">Order</th>
                          <th className="py-3 px-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collections.filter(c => 
                          c.name.toLowerCase().includes(collectionQuery.toLowerCase()) || 
                          c.id.toLowerCase().includes(collectionQuery.toLowerCase())
                        ).length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-10 text-center text-muted-foreground">
                              No collections found matching query.
                            </td>
                          </tr>
                        ) : (
                          collections
                            .filter(c => 
                              c.name.toLowerCase().includes(collectionQuery.toLowerCase()) || 
                              c.id.toLowerCase().includes(collectionQuery.toLowerCase())
                            )
                            .map((collection, idx) => (
                              <tr key={collection.id} className="border-b border-border/20 hover:bg-secondary/10 transition-colors">
                                <td className="py-3.5 px-4 font-mono text-primary font-bold">{collection.id}</td>
                                <td className="py-3.5 px-4 font-semibold text-sm">{collection.name}</td>
                                <td className="py-3.5 px-4 font-mono text-muted-foreground font-semibold">{collection.icon}</td>
                                <td className="py-3.5 px-4 text-center">
                                  <div className="flex justify-center gap-0.5">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                                      onClick={() => handleMoveCollection(idx, "up")}
                                      disabled={idx === 0}
                                    >
                                      <ChevronUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                                      onClick={() => handleMoveCollection(idx, "down")}
                                      disabled={idx === collections.length - 1}
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <div className="flex justify-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                                      onClick={() => handleEditCollection(collection)}
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                      onClick={() => handleDeleteCollection(collection.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* TAB: BANNERS */}
              {activeTab === "banners" && (
                <Card className="p-6 border-border bg-card/60 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight mb-1 text-emerald-400">Top Banners</h2>
                      <p className="text-muted-foreground text-sm">Manage the rotating hero banners on the homepage.</p>
                    </div>
                    <Button onClick={() => { setEditingBanner(null); setBannerForm({ image: "", link: "", isActive: true }); setShowBannerModal(true); }} className="bg-emerald-600 hover:bg-emerald-700 font-bold gap-2">
                      <Plus className="h-4 w-4" />
                      Add Banner
                    </Button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-border bg-black/40">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-black/60 text-muted-foreground">
                        <tr>
                          <th className="px-6 py-4 font-bold tracking-wider">Image</th>
                          <th className="px-6 py-4 font-bold tracking-wider">Link URL</th>
                          <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                          <th className="px-6 py-4 text-right font-bold tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {loadingBanners ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                              Loading banners...
                            </td>
                          </tr>
                        ) : banners.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                              No banners found. Add one to get started.
                            </td>
                          </tr>
                        ) : (
                          banners.map((banner) => (
                            <tr key={banner.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4">
                                <div className="h-16 w-32 relative rounded-md overflow-hidden bg-muted">
                                  <Image src={banner.image || "/placeholder.svg"} alt="Banner" fill className="object-cover" />
                                </div>
                              </td>
                              <td className="px-6 py-4 font-medium max-w-xs truncate">{banner.link || "None"}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${banner.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                  {banner.isActive ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => handleEditBanner(banner)}>
                                    <Edit2 className="h-4 w-4 text-blue-400" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteBanner(banner.id)}>
                                    <Trash2 className="h-4 w-4 text-red-400" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* TAB 6: OFFERS, COUPONS & COMBOS MARKETING */}
              {activeTab === "marketing" && (
                <div className="space-y-8">
                  {/* Coupon creator card */}
                  <Card className="p-6 border-border bg-card/60 backdrop-blur-xl space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Coupon & Promo Code Management</h3>
                      <p className="text-xs text-muted-foreground">Create and manage database-backed customer promo discount codes.</p>
                    </div>

                    <form onSubmit={handleCreateCoupon} className="grid sm:grid-cols-3 gap-4 items-end bg-secondary/15 p-4 rounded-xl border border-border/20">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Promo Code</Label>
                        <Input
                          placeholder="e.g. WELCOME20"
                          value={newCouponForm.code}
                          onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value })}
                          required
                          className="h-10 bg-background"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Discount Percent (%)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          placeholder="e.g. 20"
                          value={newCouponForm.discountPct}
                          onChange={(e) => setNewCouponForm({ ...newCouponForm, discountPct: Number(e.target.value) })}
                          required
                          className="h-10 bg-background"
                        />
                      </div>
                      <Button type="submit" className="h-10 font-bold gap-2">
                        <Plus className="h-4 w-4" />
                        Create Coupon
                      </Button>
                    </form>

                    <div className="overflow-x-auto border rounded-xl bg-background/30 border-border/40 mt-4">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-border/60 text-muted-foreground uppercase font-bold text-[10px] tracking-wider bg-secondary/10">
                            <th className="py-3 px-4">Coupon Code</th>
                            <th className="py-3 px-4 text-center">Discount %</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {coupons.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-8 text-center text-muted-foreground">
                                No promo coupon codes currently configured in database.
                              </td>
                            </tr>
                          ) : (
                            coupons.map((coupon) => (
                              <tr key={coupon._id} className="border-b border-border/20 hover:bg-secondary/10 transition-colors">
                                <td className="py-3.5 px-4 font-mono font-bold text-primary text-sm">{coupon.code}</td>
                                <td className="py-3.5 px-4 text-center font-bold">{coupon.discountPct}% OFF</td>
                                <td className="py-3.5 px-4 text-center">
                                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold ${coupon.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                                    {coupon.isActive ? "ACTIVE" : "INACTIVE"}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleDeleteCoupon(coupon._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* Combo bundle pricing configurations */}
                  <Card className="p-6 border-border bg-card/60 backdrop-blur-xl space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Combo Bundle Pricing Tiers</h3>
                      <p className="text-xs text-muted-foreground">Configure global automated combo tier settings for bulk additions.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-border/20 bg-background/50 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-primary">TIER 1: DOUBLE SAVINGS</span>
                          <span className="text-xs font-extrabold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">10% OFF</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Automatically applies a 10% discount on the entire checkout if any 2 products are added to the basket.</p>
                      </div>
                      <div className="p-4 rounded-xl border border-border/20 bg-background/50 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-primary">TIER 2: TRIPLE SAVINGS (MAX)</span>
                          <span className="text-xs font-extrabold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">15% OFF</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Automatically applies a 15% discount on the entire checkout if 3 or more products are added to the basket.</p>
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground italic border-t border-dashed pt-3 mt-4">
                      Combo metrics dynamically auto-deduct total order price during customer checkout sessions.
                    </div>
                  </Card>
                </div>
              )}

              {/* TAB 8: RETURNS & CONFLICT WORKSPACE */}
              {activeTab === "returns" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <Card className="p-6 border-border bg-card/60 backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                      <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 6.3H18" />
                          </svg>
                          <span>Returns & Conflict Audit Log</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Track customer disputes, returns, full & partial refunds, and order references for conflict tracking.
                        </p>
                      </div>
                      <span className="text-xs font-extrabold bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full uppercase tracking-wider">
                        {returns.length} Return Logs
                      </span>
                    </div>

                    {loadingReturns ? (
                      <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                        <p className="text-xs text-muted-foreground">Retrieving return logs from database...</p>
                      </div>
                    ) : returns.length === 0 ? (
                      <div className="py-16 text-center border border-dashed rounded-xl flex flex-col items-center justify-center gap-3">
                        <svg className="h-10 w-10 text-muted-foreground/45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        <div>
                          <p className="text-sm font-bold text-foreground">Zero Disputes / Return Logs Found</p>
                          <p className="text-xs text-muted-foreground mt-0.5">All customer orders are currently settled with zero conflict tracking.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-border/40 text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
                              <th className="py-3 px-4">Return ID</th>
                              <th className="py-3 px-4">Order Ref (Dispute)</th>
                              <th className="py-3 px-4">Customer</th>
                              <th className="py-3 px-4">Returned Items</th>
                              <th className="py-3 px-4">Reason</th>
                              <th className="py-3 px-4">Refund Amount</th>
                              <th className="py-3 px-4">Date Logged</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/25">
                            {returns.map((ret) => (
                              <tr key={ret._id || ret.returnId} className="hover:bg-secondary/15 transition-colors">
                                <td className="py-3.5 px-4 font-extrabold text-foreground">{ret.returnId}</td>
                                <td className="py-3.5 px-4">
                                  <span className="font-bold bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] select-all cursor-pointer">
                                    {ret.orderId}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-semibold">{ret.customer.name}</div>
                                  <div className="text-[10px] text-muted-foreground">{ret.customer.phone}</div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="space-y-1">
                                    {ret.returnedItems.map((it: any, idx: number) => (
                                      <div key={idx} className="font-medium text-foreground">
                                        • {it.name} <span className="text-muted-foreground font-normal">({it.quantity} returned)</span>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-500 uppercase tracking-wide">
                                    {ret.reason}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 font-extrabold text-indigo-500">
                                  {ret.refundAmount > 0 ? `₹${ret.refundAmount}` : "None"}
                                </td>
                                <td className="py-3.5 px-4 text-muted-foreground">
                                  {new Date(ret.createdAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const order = orders.find(o => o.orderId === ret.orderId)
                                        if (!order) {
                                          toast.error("Original order not found in current view. Cannot edit return.")
                                          return
                                        }
                                        setReturningOrder(order)
                                        setEditingReturnId(ret._id)
                                        
                                        const mappedItems: { [key: string]: number } = {}
                                        ret.returnedItems.forEach((it: any) => {
                                          mappedItems[it.productId] = it.quantity
                                        })
                                        
                                        setReturnForm({
                                          returnedItems: mappedItems,
                                          refundAmount: ret.refundAmount.toString(),
                                          reason: ret.reason
                                        })
                                        setShowReturnModal(true)
                                      }}
                                      className="font-bold border-indigo-500/20 hover:border-indigo-500 text-indigo-500 hover:bg-indigo-500/10 h-7 px-2 text-[10px]"
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteReturn(ret._id)}
                                      className="font-bold border-rose-500/20 hover:border-rose-500 text-rose-500 hover:bg-rose-500/10 h-7 px-2 text-[10px]"
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* TAB 7: GLOBAL SETTINGS & DELIVERY PARTNERS */}
              {activeTab === "settings" && (
                <div className="space-y-8">
                  {/* Delivery logistics */}
                  <Card className="p-6 border-border bg-card/60 backdrop-blur-xl space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Fulfillment & Delivery Partners</h3>
                      <p className="text-xs text-muted-foreground">Indian national shipping partners carrying active Bobblehead payloads.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { name: "Blue Dart Express", type: "Air Cargo Priority", speed: "1-3 Days" },
                        { name: "Delhivery logistics", type: "Surface Express", speed: "3-5 Days" },
                        { name: "DTDC Courier", type: "Standard Priority", speed: "2-4 Days" },
                        { name: "India Post Speed", type: "Universal coverage", speed: "4-7 Days" }
                      ].map((carrier, index) => (
                        <div key={index} className="p-4 rounded-xl border border-border/20 bg-background/40 hover:border-primary/20 transition-all flex flex-col gap-2">
                          <div className="font-bold text-xs">{carrier.name}</div>
                          <div className="text-[10px] text-muted-foreground">{carrier.type}</div>
                          <div className="flex justify-between items-center mt-2 border-t pt-2 border-dashed">
                            <span className="text-[9px] text-muted-foreground uppercase font-bold">Transit</span>
                            <span className="text-[9px] font-extrabold text-primary">{carrier.speed}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Physical store specs details */}
                  <Card className="p-6 border-border bg-card/60 backdrop-blur-xl space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Store Identity Operations</h3>
                      <p className="text-xs text-muted-foreground">Custom e-commerce storefront parameters deployed in India.</p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 rounded-xl border border-border/20 bg-background/30">
                        <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">Support Contact</div>
                        <div className="font-bold text-sm text-foreground">+91 94007 57707</div>
                      </div>
                      <div className="p-4 rounded-xl border border-border/20 bg-background/30">
                        <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">Business Email</div>
                        <div className="font-bold text-sm text-foreground">crabsown@gmail.com</div>
                      </div>
                      <div className="p-4 rounded-xl border border-border/20 bg-background/30">
                        <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">Warehouse Address</div>
                        <div className="font-bold text-sm text-foreground">Karunagappally, Kerala, India</div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* POPUP MODAL: ADD / EDIT PRODUCT SPECS */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="relative w-full max-w-lg p-6 md:p-8 bg-card border-border/80 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 border"
              onClick={() => setShowProductModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <h3 className="text-xl font-bold border-b border-border/20 pb-3">
              {editingProduct ? `Edit Specifications: ${editingProduct.name}` : "Create New Custom Figurine"}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="prod_name" className="text-xs font-semibold">
                  Product Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="prod_name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Romantic Wedding Bobblehead"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="prod_price" className="text-xs font-semibold">
                    Price (INR) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="prod_price"
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="1299"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="prod_orig_price" className="text-xs font-semibold">
                    Original Price (INR)
                  </Label>
                  <Input
                    id="prod_orig_price"
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    placeholder="1999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="prod_cat" className="text-xs font-semibold">
                    Collection Category <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="prod_cat"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="couples">Couples</option>
                    <option value="superheroes">Superheroes</option>
                    <option value="professionals">Professionals</option>
                    <option value="wedding">Wedding</option>
                    <option value="family">Family</option>
                    <option value="hobbies">Hobbies</option>
                    <option value="sports">Sports</option>
                    <option value="music">Music</option>
                    <option value="travel">Travel</option>
                    <option value="pets">With Pets</option>
                    <option value="vehicles">With Vehicles</option>
                    <option value="fantasy">Fantasy</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold">Cloudinary Image Media</Label>
                  <Label className="flex items-center justify-center gap-2 border border-dashed rounded-md h-10 cursor-pointer hover:bg-secondary/40 transition-colors">
                    <UploadCloud className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-muted-foreground">
                      {uploadingImage ? "Uploading..." : "Choose Image"}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                  </Label>
                  <span className="text-[9px] text-muted-foreground mt-0.5 leading-none">
                    Best: <strong>800 × 800 px (1:1 Ratio)</strong>
                  </span>
                </div>
              </div>

              {/* Image URL preview display */}
              {productForm.image && (
                <div className="p-3 border border-border/80 bg-background/50 rounded-lg flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0 bg-muted">
                    <Image src={productForm.image} alt="Preview" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-emerald-500 font-bold">Cloudinary Resource URL:</p>
                    <p className="text-[9px] text-muted-foreground truncate">{productForm.image}</p>
                  </div>
                </div>
              )}

              {/* Additional Images Section */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold">Additional Images (Gallery)</Label>
                <Label className="flex items-center justify-center gap-2 border border-dashed rounded-md h-10 cursor-pointer hover:bg-secondary/40 transition-colors">
                  <UploadCloud className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground">
                    {uploadingAdditionalImage ? "Uploading..." : "+ Add More Images"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleAdditionalImageUpload} disabled={uploadingAdditionalImage} />
                </Label>
                <span className="text-[9px] text-muted-foreground mt-0.5 leading-none">
                  Upload multiple angle shots or detail images.
                </span>
              </div>

              {/* Additional Images Preview Grid */}
              {productForm.additionalImages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Gallery Images ({productForm.additionalImages.length})</p>
                  <div className="grid grid-cols-4 gap-2">
                    {productForm.additionalImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-border/50 bg-muted aspect-square">
                        <Image src={img} alt={`Additional ${idx + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(idx)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="prod_desc" className="text-xs font-semibold">
                  Short Description
                </Label>
                <Input
                  id="prod_desc"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Classic personalized couple figurines styled in modern custom suits"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="prod_details" className="text-xs font-semibold">
                  Specification Details
                </Label>
                <Textarea
                  id="prod_details"
                  value={productForm.details}
                  onChange={(e) => setProductForm({ ...productForm, details: e.target.value })}
                  placeholder="Perfect customized gifts with custom faces sculpted by master artisans using premium materials."
                  className="bg-background/80 min-h-[60px]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="prod_features" className="text-xs font-semibold">
                  Features checklist (Comma-separated)
                </Label>
                <Input
                  id="prod_features"
                  value={productForm.featuresText}
                  onChange={(e) => setProductForm({ ...productForm, featuresText: e.target.value })}
                  placeholder="Premium Resin, Hand-painted, Free Name plate, Gift boxed"
                />
              </div>

              <div className="flex flex-col gap-1.5 border-t border-border/20 pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="prod_barcode" className="text-xs font-semibold">
                    Product Barcode (13-digit)
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setProductForm({
                        ...productForm,
                        barcode: Math.floor(1000000000000 + Math.random() * 9000000000000).toString().substring(0, 13)
                      })
                    }}
                    className="h-6 px-2 text-[10px] font-bold text-primary hover:bg-secondary/40 border border-primary/20 rounded"
                  >
                    Auto-Generate 🔄
                  </Button>
                </div>
                <Input
                  id="prod_barcode"
                  value={productForm.barcode}
                  onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
                  placeholder="e.g. 8901234567890 (Leave blank to auto-generate)"
                />
              </div>

              <Button type="submit" className="w-full mt-6 font-bold shadow-md shadow-primary/20 h-11" disabled={uploadingImage}>
                {uploadingImage ? "Awaiting media host..." : editingProduct ? "Synchronize Specifications" : "Create Figurine"}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* POPUP MODAL: VIEW & MANAGE ORDER STATE */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="relative w-full max-w-lg p-6 md:p-8 bg-card border-border/80 shadow-2xl flex flex-col gap-5 max-h-[95vh] overflow-y-auto">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 border"
              onClick={() => setViewingOrder(null)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div>
              <h3 className="text-xl font-bold">Manage Order: <span className="font-mono text-primary">{viewingOrder.orderId}</span></h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Placed on: {new Date(viewingOrder.createdAt).toLocaleString()}</p>
            </div>

            <div className="border-t border-b border-border/20 py-4 text-xs space-y-4">
              {/* Shipping address details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">Client Billing Details:</p>
                  <p className="font-bold mt-1 text-sm">{viewingOrder.customer.name}</p>
                  <p className="text-muted-foreground">{viewingOrder.customer.email}</p>
                  <p className="text-muted-foreground">{viewingOrder.customer.phone}</p>
                </div>
                <div>
                  <p className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">Shipping Destination:</p>
                  <p className="mt-1 leading-relaxed text-muted-foreground">
                    {viewingOrder.customer.address}, {viewingOrder.customer.city}, {viewingOrder.customer.state} - {viewingOrder.customer.zip}
                  </p>
                </div>
              </div>

              {/* Items summary */}
              <div>
                <p className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider mb-2">Itemized specifications:</p>
                <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                  {viewingOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-background/50 p-2 rounded border border-border/20">
                      <span className="font-semibold">{item.name} <span className="text-muted-foreground">× {item.quantity}</span></span>
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* pricing aggregate */}
              <div className="flex justify-between items-center text-sm pt-2 border-t border-dashed">
                <span className="font-bold text-muted-foreground text-xs">Gross order value (with 18% Tax):</span>
                <span className="font-extrabold text-base text-primary">₹{viewingOrder.total + Math.round(viewingOrder.total * 0.18)}</span>
              </div>

              {/* Payment Details Visualizer */}
              <div className="pt-2 border-t border-border/20 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">Payment Method:</span>
                  <span className="font-bold bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] uppercase">
                    {viewingOrder.paymentMethod}
                  </span>
                </div>

                {viewingOrder.paymentMethod === "Card Payment" && viewingOrder.paymentDetails && (
                  <div className="p-3 rounded-lg border border-border/40 bg-secondary/20 space-y-1.5 text-xs font-medium">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[10px]">Card Brand:</span>
                      <span className="font-bold text-foreground flex items-center gap-1">
                        <svg className="h-3.5 w-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                        </svg>
                        {viewingOrder.paymentDetails.brand || "Visa / Mastercard / RuPay"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[10px]">Card Holder:</span>
                      <span className="font-bold text-foreground">{viewingOrder.paymentDetails.cardHolder || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[10px]">Card Number:</span>
                      <span className="font-mono font-bold text-foreground tracking-wider">{viewingOrder.paymentDetails.cardNumber || "**** **** **** ****"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[10px]">Expiry / CVV:</span>
                      <span className="font-bold text-foreground">
                        {viewingOrder.paymentDetails.expiry || "MM/YY"} / ***
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-dashed border-border/20">
                      <span className="text-[10px] text-muted-foreground">Transaction Status:</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 font-extrabold uppercase rounded">
                        Authorized & Captured
                      </span>
                    </div>
                  </div>
                )}

                {viewingOrder.paymentMethod === "UPI Payment" && (
                  <div className="p-3 rounded-lg border border-border/40 bg-secondary/20 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[10px]">Gateway Source:</span>
                      <span className="font-bold text-foreground">BHIM UPI Instant QR</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[10px]">Payment Status:</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 font-extrabold uppercase rounded">
                        Verified via UPI Intent
                      </span>
                    </div>
                  </div>
                )}

                {viewingOrder.paymentMethod === "Cash on Delivery" && (
                  <div className="p-3 rounded-lg border border-border/40 bg-secondary/20 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[10px]">COD Verification:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">Pending COD verification</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleOrderUpdate} className="space-y-4 pt-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ord_status" className="text-xs font-semibold">
                    Order Status
                  </Label>
                  <select
                    id="ord_status"
                    value={orderStatusForm.status}
                    onChange={(e) => setOrderStatusForm({ ...orderStatusForm, status: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Pending">Pending review</option>
                    <option value="Shipped">Shipped / Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ord_track" className="text-xs font-semibold">
                    Tracking ID (Optional)
                  </Label>
                  <Input
                    id="ord_track"
                    value={orderStatusForm.trackingNumber}
                    onChange={(e) => setOrderStatusForm({ ...orderStatusForm, trackingNumber: e.target.value })}
                    placeholder="e.g. TRK12903820"
                  />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border/20 pt-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ord_cust_name" className="text-xs font-semibold">
                    Customer Name (Billing)
                  </Label>
                  <Input
                    id="ord_cust_name"
                    value={orderStatusForm.customerName}
                    onChange={(e) => setOrderStatusForm({ ...orderStatusForm, customerName: e.target.value })}
                    placeholder="Valued Customer"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ord_payment_status" className="text-xs font-semibold">
                    Payment Status
                  </Label>
                  <select
                    id="ord_payment_status"
                    value={orderStatusForm.paymentStatus}
                    onChange={(e) => setOrderStatusForm({ ...orderStatusForm, paymentStatus: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Paid">Paid (Recorded in Sales)</option>
                    <option value="Credit">Credit (Outstanding)</option>
                    <option value="Pending">Pending / COD verification</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <Button type="submit" className="w-full font-bold shadow-md shadow-primary/20 h-11">
                  Synchronize Order Status
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handlePrintDeliverySlip(viewingOrder)}
                    className="font-bold border-border bg-background hover:bg-secondary h-10 gap-1.5 text-xs"
                  >
                    Download PDF Slip 📄
                  </Button>
                  <a
                    href={`https://wa.me/91${viewingOrder.customer.phone}?text=${encodeURIComponent(
                      `Hi ${viewingOrder.customer.name || "Valued Customer"} (+91 ${viewingOrder.customer.phone})! Your CrabsCart order ${viewingOrder.orderId} status has been updated to: *${viewingOrder.status.toUpperCase()}*. Tracking Number: ${viewingOrder.trackingNumber || "N/A"}. Thank you for shopping with us!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md flex items-center justify-center transition-all shadow shadow-emerald-700/10 h-10 gap-1.5 text-xs text-center"
                  >
                    Share Status 💬
                  </a>
                </div>

                {viewingOrder.status === "Delivered" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setReturningOrder(viewingOrder)
                      const initialItems: { [productId: string]: number } = {}
                      viewingOrder.items.forEach((it) => {
                        initialItems[it.id] = 0
                      })
                      setReturnForm({
                        returnedItems: initialItems,
                        refundAmount: "",
                        reason: "Transit damage",
                      })
                      setShowReturnModal(true)
                    }}
                    className="w-full font-bold border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 h-10 gap-1.5 text-xs"
                  >
                    Process Return / Dispute Log 🔄
                  </Button>
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOrderDelete(viewingOrder.orderId)}
                  className="w-full font-bold border-destructive/30 text-destructive hover:bg-destructive/10 h-10 gap-1.5 text-xs mt-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Permanently Delete Order 🗑️
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* POPUP MODAL: VIEW EXACT SHOPPING CART DETAILS FOR LEADS */}
      {viewingLeadCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <Card className="relative w-full max-w-md p-6 bg-card border-border/80 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 border"
              onClick={() => setViewingLeadCart(null)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span>Active Basket:</span>
                <span className="text-primary font-mono text-sm">+91 {viewingLeadCart.phone}</span>
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Last synchronized: {new Date(viewingLeadCart.updatedAt).toLocaleString()}
              </p>
            </div>

            <div className="border-t border-b border-border/20 py-4 space-y-3">
              <p className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">Itemized Cart Specs:</p>
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {viewingLeadCart.items.map((item: any, index: number) => (
                  <div key={index} className="flex gap-3 items-center bg-secondary/15 p-2.5 rounded-xl border border-border/20">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-border/50 bg-background flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-foreground truncate">{item.name}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Quantity: <span className="font-extrabold text-foreground">{item.quantity}</span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-xs text-primary">₹{item.price * item.quantity}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-dashed space-y-2 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Basket Subtotal:</span>
                  <span className="text-foreground">₹{viewingLeadCart.total}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm border-t pt-2">
                  <span className="text-foreground">Total Value:</span>
                  <span className="text-primary text-base">₹{viewingLeadCart.total}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={() => setRecoveringLead(viewingLeadCart)}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-extrabold text-xs rounded-md h-10 gap-1.5"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Recover & Fulfill Order 🛒
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setViewingLeadCart(null)}
                  className="flex-1 font-bold text-xs h-10"
                >
                  Close View
                </Button>
                <a
                  href={`https://wa.me/91${viewingLeadCart.phone}?text=Hi! We noticed you left some lovely items in your Crabscart basket. Would you like a special combo discount to finalize your order?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-md flex items-center justify-center transition-all shadow shadow-emerald-700/10 h-10"
                >
                  Recover via WhatsApp 💬
                </a>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* DYNAMIC CONFIRMATION POPUP: FULFILL RECOVERY FLOW */}
      {recoveringLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
          <Card className="relative w-full max-w-sm p-6 bg-card border border-primary/20 shadow-2xl flex flex-col gap-6 text-center animate-in zoom-in-95 duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 border"
              onClick={() => setRecoveringLead(null)}
              disabled={isProcessingRecovery}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="mx-auto bg-primary/10 text-primary p-3.5 rounded-full w-fit">
              <ShoppingBag className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-foreground">Recover & Fulfill Order</h3>
              <p className="text-xs text-muted-foreground mt-2">
                Convert this abandoned basket for <strong className="text-foreground">+91 {recoveringLead.phone}</strong> (Total: <strong>₹{recoveringLead.total}</strong>) into a fulfilled, completed order?
              </p>
              <div className="bg-secondary/20 p-2.5 rounded-lg border border-border/10 mt-3 text-left">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Fulfillment Status:</p>
                <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Delivered / Fulfilled
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground">Has payment been received for this order?</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleRecoverLeadCheckout(recoveringLead, "Paid")}
                  disabled={isProcessingRecovery}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-11 flex flex-col gap-0.5 justify-center py-2"
                >
                  <span>Yes, Paid</span>
                  <span className="text-[9px] font-medium text-emerald-100 uppercase tracking-wide">(Record in Sales)</span>
                </Button>
                <Button
                  onClick={() => handleRecoverLeadCheckout(recoveringLead, "Credit")}
                  disabled={isProcessingRecovery}
                  variant="destructive"
                  className="font-extrabold text-xs h-11 flex flex-col gap-0.5 justify-center py-2 bg-rose-600 hover:bg-rose-700"
                >
                  <span>No, Unpaid</span>
                  <span className="text-[9px] font-medium text-rose-100 uppercase tracking-wide">(Record in Credit)</span>
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => setRecoveringLead(null)}
              disabled={isProcessingRecovery}
              className="text-xs text-muted-foreground font-semibold"
            >
              Cancel Operation
            </Button>
          </Card>
        </div>
      )}

      {showReturnModal && returningOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <Card className="relative w-full max-w-md p-6 bg-card border-border/80 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 border"
              onClick={() => {
                setShowReturnModal(false)
                setReturningOrder(null)
              }}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="border-b border-border/20 pb-3">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <svg className="h-5 w-5 text-indigo-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 6.3H18" />
                </svg>
                <span>Process Return & Dispute</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Ref. Order: <strong>{returningOrder.orderId}</strong> placed by {returningOrder.customer.name || "Valued Customer"}
              </p>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Quantities to Return:</label>
                {returningOrder.items.map((item, idx) => {
                  const currentQty = returnForm.returnedItems[item.id] || 0
                  return (
                    <div key={`${item.id || "item"}-${idx}`} className="flex justify-between items-center p-3 rounded-lg border border-border/20 bg-background/50 text-xs">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold truncate text-foreground">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">Original Order: {item.quantity} purchased @ ₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-md"
                          onClick={() => {
                            setReturnForm({
                              ...returnForm,
                              returnedItems: {
                                ...returnForm.returnedItems,
                                [item.id]: Math.max(0, currentQty - 1),
                              },
                            })
                          }}
                        >
                          -
                        </Button>
                        <span className="font-extrabold text-sm w-4 text-center">{currentQty}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-md"
                          onClick={() => {
                            setReturnForm({
                              ...returnForm,
                              returnedItems: {
                                ...returnForm.returnedItems,
                                [item.id]: Math.min(item.quantity, currentQty + 1),
                              },
                            })
                          }}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <Label htmlFor="ret_refund" className="text-xs font-semibold">Refund Amount (₹, Optional)</Label>
                <Input
                  id="ret_refund"
                  type="number"
                  placeholder="e.g. 1500"
                  value={returnForm.refundAmount}
                  onChange={(e) => setReturnForm({ ...returnForm, refundAmount: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ret_reason" className="text-xs font-semibold">Dispute / Return Justification</Label>
                <select
                  id="ret_reason"
                  value={returnForm.reason}
                  onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="Transit damage">Transit / Logistics Damage</option>
                  <option value="Incorrect customization">Incorrect Customization Specs</option>
                  <option value="Customer dispute">Customer Dispute / Conflict</option>
                  <option value="Wrong product sent">Wrong Bobblehead/Figurine Sent</option>
                  <option value="Buyer change of mind">Buyer Change of Mind</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md shadow-indigo-600/10 h-11"
                disabled={processingReturn}
              >
                {processingReturn ? "Logging Return Record..." : "Log Return Transaction"}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {showBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="relative w-full max-w-md p-6 md:p-8 bg-card border-border/80 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 border"
              onClick={() => setShowBannerModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{editingBanner ? "Edit Banner" : "Create Banner"}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Configure your homepage rotating banner.
              </p>
            </div>

            <form onSubmit={handleBannerSubmit} className="flex flex-col gap-5">
              <div className="space-y-2">
                <Label>Banner Image (required)</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-white/[0.02] transition-colors relative group">
                  {bannerForm.image ? (
                    <div className="relative h-32 w-full rounded-md overflow-hidden">
                      <Image src={bannerForm.image || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Label htmlFor="banner-image" className="cursor-pointer bg-black/80 p-2 rounded-full text-white">
                          <Edit2 className="h-4 w-4" />
                        </Label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <UploadCloud className="h-6 w-6 text-emerald-500" />
                      </div>
                      <div className="text-sm font-medium">Click to upload banner image</div>
                      <p className="text-xs text-muted-foreground">Recommended size: 1920x600px</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="banner-image"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleBannerImageUpload}
                    accept="image/*"
                    disabled={uploadingBannerImage}
                  />
                  {uploadingBannerImage && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-xl">
                      <RefreshCw className="h-6 w-6 animate-spin text-emerald-500" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner-link">Target URL (optional)</Label>
                <Input
                  id="banner-link"
                  placeholder="e.g. /collections/offers"
                  value={bannerForm.link}
                  onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="banner-active"
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  checked={bannerForm.isActive}
                  onChange={(e) => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                />
                <Label htmlFor="banner-active">Banner is Active</Label>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 mt-4">
                {editingBanner ? "Update Banner" : "Create Banner"}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {showCollectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="relative w-full max-w-md p-6 md:p-8 bg-card border-border/80 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 border"
              onClick={() => setShowCollectionModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <h3 className="text-xl font-bold border-b border-border/20 pb-3">
              {editingCollection ? `Edit Collection: ${editingCollection.name}` : "Create New Storefront Collection"}
            </h3>

            <form onSubmit={handleCollectionSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="col_id" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Collection Slug ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="col_id"
                  value={collectionForm.id}
                  onChange={(e) => setCollectionForm({ ...collectionForm, id: e.target.value })}
                  placeholder="e.g. superhero-bobbleheads"
                  disabled={!!editingCollection}
                  required
                />
                <p className="text-[10px] text-muted-foreground">Unique identifier used in URLs. Allowed: a-z, 0-9, dash, underscore.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="col_name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Collection Display Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="col_name"
                  value={collectionForm.name}
                  onChange={(e) => setCollectionForm({ ...collectionForm, name: e.target.value })}
                  placeholder="e.g. Superheroes"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="col_icon" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Lucide Icon Key <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="col_icon"
                    value={collectionForm.icon}
                    onChange={(e) => setCollectionForm({ ...collectionForm, icon: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Heart">Heart Icon</option>
                    <option value="Zap">Zap / Flash</option>
                    <option value="Sparkles">Sparkles / New</option>
                    <option value="Users">Users / Couples</option>
                    <option value="Trophy">Trophy / Sports</option>
                    <option value="Music">Music / Guitar</option>
                    <option value="Smile">Smile / Fun</option>
                    <option value="Camera">Camera / Travel</option>
                    <option value="Gift">Gift / Wedding</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category Banner</Label>
                  <Label className="flex items-center justify-center gap-2 border border-dashed rounded-md h-10 cursor-pointer hover:bg-secondary/40 transition-colors">
                    <UploadCloud className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-muted-foreground truncate px-1">
                      {uploadingCollectionImage ? "Uploading..." : "Upload Image"}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCollectionImageUpload} disabled={uploadingCollectionImage} />
                  </Label>
                </div>
              </div>

              <div className="p-3 bg-secondary/15 rounded-lg border border-border/20 text-[10px] text-muted-foreground flex flex-col gap-1">
                <span className="font-bold text-amber-500 uppercase tracking-wide">Image Recommendation:</span>
                <span>Best dimensions: <strong>1200 × 600 px (2:1 Ratio)</strong>. Square ratios will be automatically centered and styled dynamically.</span>
              </div>

              {/* Image URL preview */}
              {collectionForm.image && (
                <div className="p-3 border border-border/85 bg-background/50 rounded-lg flex items-center gap-3">
                  <div className="relative h-12 w-24 rounded overflow-hidden flex-shrink-0 bg-muted">
                    <Image src={collectionForm.image} alt="Preview" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-emerald-500 font-bold">Banner Resource Link:</p>
                    <p className="text-[9px] text-muted-foreground truncate">{collectionForm.image}</p>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full mt-6 font-bold shadow-md shadow-primary/20 h-11" disabled={uploadingCollectionImage}>
                {uploadingCollectionImage ? "Uploading Banner Media..." : editingCollection ? "Synchronize Category" : "Establish Collection"}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* POPUP MODAL: CUSTOMER SINGLE VIEW DASHBOARD */}
      {selectedCustomerPhone && (() => {
        const customerOrders = orders.filter(o => (o.customer.phone || "").trim() === selectedCustomerPhone.trim())
        const customerReturns = returns.filter(r => customerOrders.some(o => o.orderId === r.orderId))
        const customerRefundsAmount = customerReturns.reduce((sum, r) => sum + (Number(r.refundAmount) || 0), 0)
        
        const customerName = customerOrders[0]?.customer.name || "Valued Customer"
        const customerEmail = customerOrders[0]?.customer.email || "N/A"
        const customerAddress = customerOrders[0]?.customer.address || "N/A"
        const customerCity = customerOrders[0]?.customer.city || ""
        const customerState = customerOrders[0]?.customer.state || ""
        const customerZip = customerOrders[0]?.customer.zip || ""

        // Financial aggregates for customer
        const totalPurchased = customerOrders
          .filter(o => o.status !== "Cancelled")
          .reduce((sum, o) => sum + (o.total + Math.round(o.total * 0.18)), 0)
        const netSpend = Math.max(0, totalPurchased - customerRefundsAmount)

        const totalUnpaidCredit = customerOrders
          .filter(o => o.status !== "Cancelled" && (o.paymentDetails?.paymentStatus === "Credit" || (o.paymentMethod === "Cash on Delivery" && o.paymentDetails?.paymentStatus !== "Paid")))
          .reduce((sum, o) => sum + (o.total + Math.round(o.total * 0.18)), 0)

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
            <Card className="relative w-full max-w-4xl p-6 md:p-8 bg-card border-border/80 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-8 w-8 border"
                onClick={() => setSelectedCustomerPhone(null)}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/20 pb-4">
                <div>
                  <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black uppercase rounded-md tracking-wider">Client Single View Dashboard</span>
                  <h3 className="text-2xl font-black mt-1 text-foreground flex items-center gap-2">
                    <span>{customerName}</span>
                    <span className="text-xs font-mono bg-secondary px-2.5 py-1 rounded text-muted-foreground font-semibold">{selectedCustomerPhone}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Full transaction pipeline, invoices, refund history, and payment standings for verified customer accounts.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                  <Button
                    onClick={() => {
                      setCustomerEditForm({
                        name: customerName,
                        email: customerEmail === "N/A" ? "" : customerEmail,
                        phone: selectedCustomerPhone || "",
                        address: customerAddress === "N/A" ? "" : customerAddress,
                        city: customerCity,
                        state: customerState,
                        zip: customerZip,
                      })
                      setIsEditingCustomer(true)
                    }}
                    className="flex-1 md:flex-none gap-1.5 font-bold h-9 text-xs border-border bg-background hover:bg-secondary"
                    variant="outline"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit Contact Details
                  </Button>
                  <Button
                    onClick={() => handleCustomerDelete(selectedCustomerPhone || "")}
                    className="flex-1 md:flex-none gap-1.5 font-bold h-9 text-xs border-destructive/20 text-destructive hover:bg-destructive/10 bg-background"
                    variant="outline"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Purge Customer Profile
                  </Button>
                </div>
              </div>

              {/* GRID: PROFILE & LTV METRICS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Profile Card */}
                <Card className="p-4 border-border bg-secondary/10 flex flex-col gap-1 text-xs">
                  <span className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider mb-1">Billing Details</span>
                  <p className="font-bold truncate text-foreground">{customerName}</p>
                  <p className="text-muted-foreground font-semibold">{customerEmail}</p>
                  <p className="text-muted-foreground mt-2 leading-relaxed">{customerAddress}</p>
                  <p className="text-muted-foreground font-bold">{customerCity}, {customerState} {customerZip}</p>
                </Card>

                {/* Lifetime Value Metric */}
                <Card className="p-4 border-border/80 bg-background flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">Net Lifetime Value (LTV)</span>
                    <p className="text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400">₹{netSpend}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 border-t border-border/20 pt-2 font-semibold">Total Gross: ₹{totalPurchased}</p>
                </Card>

                {/* Outstanding Credit Balance */}
                <Card className="p-4 border-destructive/20 bg-destructive/5 text-destructive flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-destructive/80 uppercase text-[9px] tracking-wider">Outstanding Credit</span>
                    <p className="text-2xl font-black mt-1">₹{totalUnpaidCredit}</p>
                  </div>
                  <p className="text-[10px] text-destructive/80 mt-2 border-t border-destructive/10 pt-2 font-semibold">Orders awaiting payment</p>
                </Card>

                {/* Returns Counter */}
                <Card className="p-4 border-indigo-500/20 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-indigo-500/80 uppercase text-[9px] tracking-wider">Returns & Disputes</span>
                    <p className="text-2xl font-black mt-1">{customerReturns.length}</p>
                  </div>
                  <p className="text-[10px] text-indigo-500/80 mt-2 border-t border-indigo-500/10 pt-2 font-semibold">Total Refunds: ₹{customerRefundsAmount}</p>
                </Card>
              </div>

              {/* SECTION: TIMELINE OF ORDERS */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Historical Orders & Invoice Slips</h4>
                <div className="border border-border/40 rounded-lg overflow-hidden bg-background">
                  <div className="overflow-x-auto max-h-[220px] overflow-y-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-bold uppercase text-[9px] tracking-wider">
                          <th className="py-2.5 px-4">Order ID</th>
                          <th className="py-2.5 px-4">Items Count</th>
                          <th className="py-2.5 px-4">Net Value</th>
                          <th className="py-2.5 px-4 text-center">Status</th>
                          <th className="py-2.5 px-4 text-center">Payment</th>
                          <th className="py-2.5 px-4 text-right">Invoice Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-muted-foreground">No historical orders logged for this phone number.</td>
                          </tr>
                        ) : (
                          customerOrders.map((ord) => (
                            <tr key={ord.orderId} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                              <td className="py-2.5 px-4 font-bold font-mono">{ord.orderId}</td>
                              <td className="py-2.5 px-4 font-semibold">{ord.items.reduce((sum: number, it: any) => sum + it.quantity, 0)} items</td>
                              <td className="py-2.5 px-4 font-black">₹{ord.total + Math.round(ord.total * 0.18)}</td>
                              <td className="py-2.5 px-4 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                  ord.status === "Delivered" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                                  ord.status === "Shipped" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                                  ord.status === "Cancelled" ? "bg-destructive/10 text-destructive" :
                                  "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                }`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  (ord.paymentDetails?.paymentStatus === "Paid" || ord.paymentMethod !== "Cash on Delivery") ? "bg-emerald-500/10 text-emerald-600" :
                                  ord.paymentDetails?.paymentStatus === "Credit" ? "bg-rose-500/10 text-rose-600" :
                                  "bg-amber-500/10 text-amber-600"
                                }`}>
                                  {(ord.paymentDetails?.paymentStatus === "Paid" || ord.paymentMethod !== "Cash on Delivery") ? "Paid" : "Credit / COD Pending"}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePrintDeliverySlip(ord)}
                                  className="font-bold border-border bg-background hover:bg-secondary h-7 px-2.5 gap-1 text-[10px]"
                                >
                                  Print Invoice 📄
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* SECTION: RETURN DISPUTE HISTORY */}
              {customerReturns.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Disputes & Refunds History Logs</h4>
                  <div className="border border-border/40 rounded-lg overflow-hidden bg-background">
                    <div className="overflow-x-auto max-h-[150px] overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-4">Dispute ID</th>
                            <th className="py-2 px-4">Original Order</th>
                            <th className="py-2 px-4">Refund Amount</th>
                            <th className="py-2 px-4">Reason / Justification</th>
                            <th className="py-2 px-4">Processed Date</th>
                            <th className="py-2 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerReturns.map((ret) => (
                            <tr key={ret._id} className="border-b border-border/20 text-xs">
                              <td className="py-2 px-4 font-mono font-bold">{ret._id ? ret._id.substring(0, 10).toUpperCase() : "DISP-LOG"}</td>
                              <td className="py-2 px-4 font-bold font-mono text-primary">{ret.orderId}</td>
                              <td className="py-2 px-4 font-black text-rose-600 dark:text-rose-400">₹{ret.refundAmount}</td>
                              <td className="py-2 px-4 text-muted-foreground font-semibold">{ret.reason}</td>
                              <td className="py-2 px-4 text-[10px] text-muted-foreground font-medium">{new Date(ret.createdAt).toLocaleString()}</td>
                              <td className="py-2 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const order = orders.find(o => o.orderId === ret.orderId)
                                      if (!order) {
                                        toast.error("Original order not found. Cannot edit return.")
                                        return
                                      }
                                      setReturningOrder(order)
                                      setEditingReturnId(ret._id)
                                      
                                      const mappedItems: { [key: string]: number } = {}
                                      ret.returnedItems.forEach((it: any) => {
                                        mappedItems[it.productId] = it.quantity
                                      })
                                      
                                      setReturnForm({
                                        returnedItems: mappedItems,
                                        refundAmount: ret.refundAmount.toString(),
                                        reason: ret.reason
                                      })
                                      setSelectedCustomerPhone(null) // Close the dashboard to see the modal properly
                                      setShowReturnModal(true)
                                    }}
                                    className="h-6 px-2 text-[9px] font-bold border-indigo-500/20 hover:border-indigo-500 text-indigo-500 hover:bg-indigo-500/10"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteReturn(ret._id)}
                                    className="h-6 px-2 text-[9px] font-bold border-rose-500/20 hover:border-rose-500 text-rose-500 hover:bg-rose-500/10"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )
      })()}
      {/* POPUP MODAL: EDIT CUSTOMER DETAILS */}
      {isEditingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <Card className="relative w-full max-w-md p-6 bg-card border-border/80 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 border"
              onClick={() => setIsEditingCustomer(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div>
              <span className="text-[9px] px-2 py-0.5 bg-primary/10 text-primary font-black uppercase rounded-md tracking-wider">Customer CRUD Workspace</span>
              <h3 className="text-xl font-bold mt-1">Edit Contact Details</h3>
              <p className="text-xs text-muted-foreground">Modify customer profile. Changes will immediately update all orders under phone: <strong>{customerEditForm.phone}</strong></p>
            </div>

            <form onSubmit={handleCustomerUpdate} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cust_edit_name" className="text-xs font-semibold">Full Name</Label>
                <Input
                  id="cust_edit_name"
                  value={customerEditForm.name}
                  onChange={(e) => setCustomerEditForm({ ...customerEditForm, name: e.target.value })}
                  placeholder="e.g. Muhammed Anshif"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cust_edit_email" className="text-xs font-semibold">Email Address</Label>
                <Input
                  id="cust_edit_email"
                  type="email"
                  value={customerEditForm.email}
                  onChange={(e) => setCustomerEditForm({ ...customerEditForm, email: e.target.value })}
                  placeholder="e.g. anshif@example.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cust_edit_address" className="text-xs font-semibold">Street Address</Label>
                <Textarea
                  id="cust_edit_address"
                  value={customerEditForm.address}
                  onChange={(e) => setCustomerEditForm({ ...customerEditForm, address: e.target.value })}
                  placeholder="Full delivery address details..."
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="cust_edit_city" className="text-xs font-semibold">City</Label>
                  <Input
                    id="cust_edit_city"
                    value={customerEditForm.city}
                    onChange={(e) => setCustomerEditForm({ ...customerEditForm, city: e.target.value })}
                    placeholder="City"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="cust_edit_state" className="text-xs font-semibold">State</Label>
                  <Input
                    id="cust_edit_state"
                    value={customerEditForm.state}
                    onChange={(e) => setCustomerEditForm({ ...customerEditForm, state: e.target.value })}
                    placeholder="State"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="cust_edit_zip" className="text-xs font-semibold">ZIP Code</Label>
                  <Input
                    id="cust_edit_zip"
                    value={customerEditForm.zip}
                    onChange={(e) => setCustomerEditForm({ ...customerEditForm, zip: e.target.value })}
                    placeholder="ZIP"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsEditingCustomer(false)} className="flex-1 font-bold h-10">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 font-bold h-10 shadow shadow-primary/20 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                  Update Profile
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* POPUP MODAL: CREATE MANUAL ORDER */}
      {isCreatingManualOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <Card className="relative w-full max-w-2xl p-6 md:p-8 bg-card border-border/80 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 border"
              onClick={() => setIsCreatingManualOrder(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div>
              <span className="text-[9px] px-2 py-0.5 bg-gradient-to-r from-primary to-accent text-primary-foreground font-black uppercase rounded-md tracking-wider">Sales Manager Pipeline</span>
              <h3 className="text-2xl font-black mt-1">Create Manual Sales Order</h3>
              <p className="text-xs text-muted-foreground mt-1">Directly log offline orders, Instagram or WhatsApp inquiries into the system database.</p>
            </div>

            <form onSubmit={handleManualOrderCreate} className="space-y-6">
              {/* SECTION 1: CUSTOMER DETAILS */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">1. Customer Contact Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="mo_name" className="text-[10px] font-bold">Client Full Name *</Label>
                    <Input
                      id="mo_name"
                      placeholder="e.g. John Doe"
                      value={manualOrderForm.name}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="mo_phone" className="text-[10px] font-bold">Phone Number *</Label>
                    <Input
                      id="mo_phone"
                      placeholder="e.g. 9876543210"
                      value={manualOrderForm.phone}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="mo_email" className="text-[10px] font-bold">Email Address *</Label>
                    <Input
                      id="mo_email"
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={manualOrderForm.email}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="mo_address" className="text-[10px] font-bold">Street Delivery Address *</Label>
                  <Textarea
                    id="mo_address"
                    placeholder="Full shipping address details..."
                    value={manualOrderForm.address}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, address: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="mo_city" className="text-[10px] font-bold">City</Label>
                    <Input
                      id="mo_city"
                      placeholder="City"
                      value={manualOrderForm.city}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, city: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="mo_state" className="text-[10px] font-bold">State</Label>
                    <Input
                      id="mo_state"
                      placeholder="State"
                      value={manualOrderForm.state}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, state: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="mo_zip" className="text-[10px] font-bold">ZIP Code</Label>
                    <Input
                      id="mo_zip"
                      placeholder="ZIP"
                      value={manualOrderForm.zip}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, zip: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: ADD PRODUCT ITEMS */}
              <div className="space-y-3 pt-3 border-t border-border/40">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">2. Product Line Items</h4>
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-grow flex flex-col gap-1 w-full">
                    <Label className="text-[10px] font-bold">Select Figurine Product</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring"
                      onChange={(e) => {
                        const val = e.target.value
                        if (!val) return
                        const prod = products.find(p => p.id.toString() === val)
                        if (!prod) return
                        
                        // Check if already in items list
                        const exists = manualOrderForm.items.some(item => item.product.id === prod.id)
                        if (exists) {
                          toast.error("Product already added to order list. Adjust quantity below.")
                          return
                        }

                        setManualOrderForm({
                          ...manualOrderForm,
                          items: [...manualOrderForm.items, { product: prod, quantity: 1 }]
                        })
                        e.target.value = "" // Reset select
                      }}
                    >
                      <option value="">-- Choose from Catalogue --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (₹{p.price})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* List of currently selected items */}
                {manualOrderForm.items.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground italic py-2 text-center bg-secondary/10 rounded-lg">No products added. Select a product above to add.</p>
                ) : (
                  <div className="border border-border/40 rounded-lg overflow-hidden bg-background max-h-[160px] overflow-y-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-secondary/40 border-b border-border/40 text-muted-foreground font-bold uppercase text-[9px] tracking-wider">
                          <th className="py-2 px-3">Product Name</th>
                          <th className="py-2 px-3 text-right">Price</th>
                          <th className="py-2 px-3 text-center w-24">Qty</th>
                          <th className="py-2 px-3 text-right">Subtotal</th>
                          <th className="py-2 px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {manualOrderForm.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-border/20 hover:bg-secondary/10 transition-colors">
                            <td className="py-2 px-3 font-semibold truncate max-w-[200px]">{item.product.name}</td>
                            <td className="py-2 px-3 text-right font-mono">₹{item.product.price}</td>
                            <td className="py-2 px-3 text-center">
                              <input
                                type="number"
                                min="1"
                                className="w-12 text-center rounded border border-border h-7 bg-background font-bold text-xs"
                                value={item.quantity}
                                onChange={(e) => {
                                  const val = Math.max(1, parseInt(e.target.value) || 1)
                                  const updatedItems = [...manualOrderForm.items]
                                  updatedItems[idx].quantity = val
                                  setManualOrderForm({ ...manualOrderForm, items: updatedItems })
                                }}
                              />
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-bold">₹{item.product.price * item.quantity}</td>
                            <td className="py-2 px-3 text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                  const updatedItems = manualOrderForm.items.filter((_, i) => i !== idx)
                                  setManualOrderForm({ ...manualOrderForm, items: updatedItems })
                                }}
                                className="h-6 w-6 text-destructive hover:bg-destructive/10 p-0 rounded-full"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* SECTION 3: BILLING & STATUS DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border/40">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="mo_pm" className="text-[10px] font-bold">Payment Method</Label>
                  <select
                    id="mo_pm"
                    value={manualOrderForm.paymentMethod}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, paymentMethod: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                    <option value="UPI Payment">UPI Intent Payment</option>
                    <option value="Card Payment">Credit/Debit Card</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="mo_ps" className="text-[10px] font-bold">Payment Status</Label>
                  <select
                    id="mo_ps"
                    value={manualOrderForm.paymentStatus}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, paymentStatus: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Credit">Credit (Outstanding)</option>
                    <option value="Pending COD verification">Pending COD verification</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="mo_status" className="text-[10px] font-bold">Fulfillment Status</Label>
                  <select
                    id="mo_status"
                    value={manualOrderForm.status}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, status: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Pending">Pending crafting</option>
                    <option value="Shipped">Shipped / Dispatched</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* ESTIMATED TOTAL BILL SECTION */}
              <div className="p-4 bg-secondary/15 rounded-xl border border-border/40 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-foreground">Estimated Invoice Billing Summary</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Calculated with 18% GST standard e-commerce tax.</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground font-semibold">Subtotal: ₹{manualOrderForm.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)}</p>
                  <p className="text-lg font-black text-primary mt-0.5">
                    Total: ₹{
                      Math.round(
                        manualOrderForm.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) * 1.18
                      )
                    }
                  </p>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="flex gap-3 justify-end pt-2 border-t border-border/20">
                <Button type="button" variant="outline" onClick={() => setIsCreatingManualOrder(false)} className="w-28 font-bold h-10">
                  Cancel
                </Button>
                <Button type="submit" className="w-48 font-bold h-10 shadow shadow-primary/20 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                  Log Sales Order 🚀
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      <Footer />
    </main>
  )
}
