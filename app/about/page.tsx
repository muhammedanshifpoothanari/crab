import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Heart, Award, Users, Target, Sparkles } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
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
              <span>About Us</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-balance leading-[1.1] sm:text-6xl md:text-7xl mb-8">
              Crafting Memories,
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mt-2">
                One Figurine at a Time
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              At CrabsCart, we believe every person has a unique story worth celebrating. Our mission is to transform
              your precious moments and cherished relationships into beautiful, handcrafted figurines that last a
              lifetime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-32 max-w-6xl mx-auto">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black/10 ring-1 ring-black/5">
              <Image
                src="/artisan-crafting-custom-figurines-workshop.jpg"
                alt="Our crafting process"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Founded in 2020, CrabsCart started with a simple vision: to make personalized gifting accessible,
                meaningful, and extraordinary. What began as a small workshop has grown into a thriving community of
                artisans dedicated to capturing life's special moments.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Each figurine is meticulously handcrafted by our skilled artisans, combining traditional craftsmanship
                with modern design techniques. We work closely with you to ensure every detail reflects the personality
                and essence of your loved ones.
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-32 max-w-6xl mx-auto">
            <Card className="p-10 text-center border-border bg-card hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground mb-6 shadow-lg shadow-primary/25">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-3">10,000+</h3>
              <p className="text-muted-foreground font-medium">Happy Customers</p>
            </Card>
            <Card className="p-10 text-center border-border bg-card hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/80 text-accent-foreground mb-6 shadow-lg shadow-accent/25">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-3">15,000+</h3>
              <p className="text-muted-foreground font-medium">Figurines Crafted</p>
            </Card>
            <Card className="p-10 text-center border-border bg-card hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground mb-6 shadow-lg shadow-primary/25">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-3">50+</h3>
              <p className="text-muted-foreground font-medium">Skilled Artisans</p>
            </Card>
            <Card className="p-10 text-center border-border bg-card hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/80 text-accent-foreground mb-6 shadow-lg shadow-accent/25">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-3">4.9/5</h3>
              <p className="text-muted-foreground font-medium">Average Rating</p>
            </Card>
          </div>

          <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-3xl p-12 md:p-20 text-center border border-primary/10 shadow-xl max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Quality First</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We never compromise on materials or craftsmanship.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Customer Delight</h3>
                <p className="text-muted-foreground leading-relaxed">Your satisfaction drives everything we do.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Attention to Detail</h3>
                <p className="text-muted-foreground leading-relaxed">Every figurine tells a unique, personal story.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
