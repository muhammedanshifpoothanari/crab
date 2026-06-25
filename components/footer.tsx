import Image from "next/image"
import Link from "next/link"
import { Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <>
      <footer className="border-t border-border/50 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="CrabsCart Logo"
                  width={150}
                  height={42}
                  className="h-9 w-auto object-contain"
                />
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
                  href="/collections/professionals"
                  className="text-muted-foreground hover:text-primary transition-colors w-fit"
                >
                  Professionals
                </Link>
                <Link
                  href="/collections/wedding"
                  className="text-muted-foreground hover:text-primary transition-colors w-fit"
                >
                  Wedding
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
                  href="tel:+919778300633"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group w-fit"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span>+91 97783 00633</span>
                </a>
                <a
                  href="mailto:crabscart@gmail.com"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group w-fit"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span>crabscart@gmail.com</span>
                </a>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="pt-1.5">Karunagappally, Kerala, India</span>
                </div>
                <a
                  href="https://instagram.com/crabscart"
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
            <p className="font-medium">© 2026 CrabsCart. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-primary transition-colors font-medium">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors font-medium">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
 
      {/* Floating WhatsApp Widget */}
      <a
        href="https://wa.me/919778300633"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 md:bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-110 transition-all duration-300 group"
        aria-label="Contact support on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping group-hover:animate-none scale-105" />
        
        {/* Live Blinking Notification Red Dot */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4 z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 border border-white"></span>
        </span>

        <svg
          className="h-7 w-7 fill-current relative z-10"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  )
}
