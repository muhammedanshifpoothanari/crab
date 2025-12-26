"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div
        className="absolute top-20 left-10 w-20 h-20 border-2 border-primary/20 rounded-2xl rotate-12 animate-bounce"
        style={{ animationDuration: "3s" }}
      />
      <div
        className="absolute bottom-32 right-20 w-16 h-16 border-2 border-accent/20 rounded-full animate-bounce"
        style={{ animationDuration: "4s", animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg rotate-45 animate-pulse"
        style={{ animationDuration: "2s" }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col gap-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 px-5 py-2.5 text-sm font-medium text-accent w-fit mx-auto lg:mx-0 shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span>Personalized Gifts That Tell Your Story</span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-balance leading-[1.1] sm:text-6xl md:text-7xl lg:text-7xl">
              Create Unique
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mt-2">
                Memories
              </span>
            </h1>

            <p className="text-lg text-muted-foreground text-pretty leading-relaxed md:text-xl max-w-xl mx-auto lg:mx-0">
              Transform your favorite moments into custom figurines and collectibles. Perfect for birthdays,
              anniversaries, and special celebrations.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 mx-auto lg:mx-0">
              <Button
                size="lg"
                className="gap-2 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                onClick={() => scrollToSection("products")}
              >
                Browse Collection
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base border-2 hover:bg-secondary/50 bg-transparent"
                onClick={() => scrollToSection("gallery")}
              >
                See Examples
              </Button>
            </div>

            <div className="flex items-center gap-12 text-sm mx-auto lg:mx-0 pt-4">
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold text-foreground">10K+</span>
                <span className="text-muted-foreground font-medium">Happy Customers</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold text-foreground">4.9</span>
                <span className="text-muted-foreground font-medium">Average Rating</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold text-foreground">Fast</span>
                <span className="text-muted-foreground font-medium">Delivery</span>
              </div>
            </div>
          </div>

          <div className="relative h-[450px] md:h-[550px] lg:h-[650px]">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-2xl opacity-50" />

            <div className="grid grid-cols-2 gap-6 h-full relative">
              <div className="flex flex-col gap-6">
                <div className="relative h-2/3 overflow-hidden rounded-3xl bg-muted shadow-2xl shadow-black/10 ring-1 ring-black/5 hover:ring-2 hover:ring-primary/20 transition-all duration-300">
                  <Image
                    src="/custom-superhero-figurine.jpg"
                    alt="Custom Superhero Figurine"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="relative h-1/3 overflow-hidden rounded-3xl bg-muted shadow-2xl shadow-black/10 ring-1 ring-black/5 hover:ring-2 hover:ring-primary/20 transition-all duration-300">
                  <Image
                    src="/custom-couple-figurine.jpg"
                    alt="Custom Couple Figurine"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-6 pt-12">
                <div className="relative h-1/3 overflow-hidden rounded-3xl bg-muted shadow-2xl shadow-black/10 ring-1 ring-black/5 hover:ring-2 hover:ring-primary/20 transition-all duration-300">
                  <Image
                    src="/personalized-gift-figurine.jpg"
                    alt="Personalized Gift"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="relative h-2/3 overflow-hidden rounded-3xl bg-muted shadow-2xl shadow-black/10 ring-1 ring-black/5 hover:ring-2 hover:ring-primary/20 transition-all duration-300">
                  <Image
                    src="/custom-action-figure.jpg"
                    alt="Custom Action Figure"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
