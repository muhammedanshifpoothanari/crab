"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutGrid, Heart, ClipboardList, User } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Categories", icon: LayoutGrid, href: "/#categories" },
    { label: "Wishlist", icon: Heart, href: "/#products" },
    { label: "Orders", icon: ClipboardList, href: "/profile" },
    { label: "Account", icon: User, href: "/profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] tracking-wide">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
