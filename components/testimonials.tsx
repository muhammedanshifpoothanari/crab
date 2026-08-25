"use client"

import { Card } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import { useEffect, useState } from "react"

interface Review {
  _id: string
  name: string
  role: string
  content: string
  rating: number
}

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Nothing to show if no approved reviews yet
  if (!loading && reviews.length === 0) return null

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl mb-6">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed max-w-2xl mx-auto">
            Join thousands of happy customers who&apos;ve created memories with us
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="relative p-8 border-border bg-card animate-pulse">
                  <div className="flex flex-col gap-6">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div key={j} className="h-5 w-5 rounded bg-muted" />
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-4/5" />
                      <div className="h-3 bg-muted rounded w-3/5" />
                    </div>
                    <div className="border-t border-border/50 pt-4 space-y-1">
                      <div className="h-3 bg-muted rounded w-1/3" />
                      <div className="h-2.5 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                </Card>
              ))
            : reviews.map((review) => (
                <Card
                  key={review._id}
                  className="relative p-8 border-border bg-card hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
                >
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-accent/10" />

                  <div className="flex flex-col gap-6">
                    <div className="flex gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                      ))}
                    </div>

                    <p className="text-muted-foreground text-pretty leading-relaxed relative z-10">
                      &ldquo;{review.content}&rdquo;
                    </p>

                    <div className="flex flex-col gap-1.5 pt-2 border-t border-border/50">
                      <p className="font-semibold text-base">{review.name}</p>
                      <p className="text-sm text-muted-foreground font-medium">{review.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
        </div>
      </div>
    </section>
  )
}
