import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Categories } from "@/components/categories"
import { Products } from "@/components/products"
import { CategoryDeals } from "@/components/category-deals"
import { HowItWorks } from "@/components/how-it-works"
import { Gallery } from "@/components/gallery"
import { Testimonials } from "@/components/testimonials"
import { FooterPromo } from "@/components/footer-promo"
import { Footer } from "@/components/footer"
import { ConfettiTrigger } from "@/components/confetti-trigger"

export default function Home() {
  return (
    <main className="min-h-screen">
      <ConfettiTrigger />
      <Navbar />
      <Hero />
      <Features />
      <Categories />
      <Products />
      <CategoryDeals />
      <HowItWorks />
      <Gallery />
      <Testimonials />
      <FooterPromo />
      <Footer />
    </main>
  )
}
