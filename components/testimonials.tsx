import { Card } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Birthday Gift Buyer",
    content:
      "Ordered a custom figurine for my husband's birthday. The attention to detail was incredible! He absolutely loved it.",
    rating: 5,
  },
  {
    name: "Raj Patel",
    role: "Anniversary Gift",
    content:
      "Got a couple figurine for our anniversary. The quality exceeded expectations and delivery was super fast. Highly recommend!",
    rating: 5,
  },
  {
    name: "Sneha Reddy",
    role: "Superhero Fan",
    content:
      "My son wanted a custom superhero figurine and CrabsCart made it perfect. The craftsmanship is outstanding!",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl mb-6">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed max-w-2xl mx-auto">
            Join thousands of happy customers who've created memories with us
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="relative p-8 border-border bg-card hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-accent/10" />

              <div className="flex flex-col gap-6">
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>

                <p className="text-muted-foreground text-pretty leading-relaxed relative z-10">
                  "{testimonial.content}"
                </p>

                <div className="flex flex-col gap-1.5 pt-2 border-t border-border/50">
                  <p className="font-semibold text-base">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground font-medium">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
