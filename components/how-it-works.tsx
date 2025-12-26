import { Card } from "@/components/ui/card"
import { Upload, Palette, Package, Heart } from "lucide-react"

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Photo",
    description: "Share a clear photo of yourself or your loved one through our simple upload process",
  },
  {
    icon: Palette,
    step: "02",
    title: "Choose Your Style",
    description: "Select from our collection of themes, poses, and accessories to personalize your figurine",
  },
  {
    icon: Package,
    step: "03",
    title: "We Craft It",
    description: "Our skilled artisans handcraft your custom figurine with meticulous attention to detail",
  },
  {
    icon: Heart,
    step: "04",
    title: "Delivered to You",
    description: "Receive your unique gift with free delivery anywhere in India within 7-10 days",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl mb-6">How It Works</h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed max-w-2xl mx-auto">
            Creating your personalized gift is easy. Just follow these simple steps
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card
              key={step.step}
              className="relative p-8 border-border bg-card hover:shadow-xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <span className="text-6xl font-bold text-muted/10">{step.step}</span>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-semibold leading-tight">{step.title}</h3>
                  <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{step.description}</p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-border to-transparent" />
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
