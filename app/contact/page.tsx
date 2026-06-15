"use client"

import type React from "react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Instagram, Send, Sparkles } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Failed to send message")
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours.",
      })
      setFormData({ name: "", email: "", message: "" })
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2.5 mb-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 text-accent text-sm font-medium shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span>Contact Us</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-balance leading-[1.1] sm:text-6xl md:text-7xl mb-8">
              Let's Create Something
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mt-2">
                Special Together
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Have a question or ready to start your custom order? We're here to help bring your vision to life.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="lg:col-span-2">
              <Card className="p-10 md:p-12 border-border bg-card shadow-2xl shadow-black/5">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label htmlFor="name" className="text-sm font-semibold">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-12 border-border"
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="email" className="text-sm font-semibold">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="h-12 border-border"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="message" className="text-sm font-semibold">
                      Your Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your custom figurine idea..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={8}
                      className="resize-none border-border"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2 h-12 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6 border-border bg-card hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <a
                      href="tel:+919778300633"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      +91 97783 00633
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border bg-card hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-lg shadow-accent/20">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Email</h3>
                    <a
                      href="mailto:crabscart@gmail.com"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      crabscart@gmail.com
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border bg-card hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p className="text-sm text-muted-foreground">Karunagappally, Kerala, India</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border bg-card hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-lg shadow-accent/20">
                    <Instagram className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Social</h3>
                    <a
                      href="https://instagram.com/crabscart"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      @crabscart
                    </a>
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
