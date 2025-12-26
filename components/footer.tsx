import Link from "next/link"
import { Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-accent shadow-lg shadow-primary/25">
                <span className="text-xl font-bold text-primary-foreground">C</span>
              </div>
              <span className="text-xl font-bold">CrabsCart</span>
            </div>
            <p className="text-sm text-muted-foreground text-pretty leading-relaxed max-w-xs">
              Creating personalized memories one figurine at a time. Premium quality custom gifts for every occasion.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="font-semibold text-base">Quick Links</h3>
            <nav className="flex flex-col gap-3 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors w-fit">
                Home
              </Link>
              <Link href="/#products" className="text-muted-foreground hover:text-primary transition-colors w-fit">
                Products
              </Link>
              <Link href="/#categories" className="text-muted-foreground hover:text-primary transition-colors w-fit">
                Collections
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors w-fit">
                About Us
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors w-fit">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="font-semibold text-base">Popular Collections</h3>
            <nav className="flex flex-col gap-3 text-sm">
              <Link
                href="/collections/for-him"
                className="text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                For Him
              </Link>
              <Link
                href="/collections/for-her"
                className="text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                For Her
              </Link>
              <Link
                href="/collections/couples"
                className="text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                For Couples
              </Link>
              <Link
                href="/collections/superheroes"
                className="text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                Superheroes
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="font-semibold text-base">Get in Touch</h3>
            <div className="flex flex-col gap-4 text-sm">
              <a
                href="tel:+918921284021"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group w-fit"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+91 89212 84021</span>
              </a>
              <a
                href="mailto:hello@crabscart.com"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group w-fit"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                  <Mail className="h-4 w-4" />
                </div>
                <span>hello@crabscart.com</span>
              </a>
              <div className="flex items-start gap-3 text-muted-foreground">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="pt-1.5">Mumbai, Maharashtra</span>
              </div>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group w-fit"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                  <Instagram className="h-4 w-4" />
                </div>
                <span>@crabscart</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/50 pt-10 text-sm text-muted-foreground md:flex-row">
          <p className="font-medium">© 2025 CrabsCart. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors font-medium">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors font-medium">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
