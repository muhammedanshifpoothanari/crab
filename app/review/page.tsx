"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Star, CheckCircle, Loader2 } from "lucide-react"

export default function ReviewPage() {
  const [form, setForm] = useState({ name: "", role: "", content: "", rating: 0 })
  const [hoveredStar, setHoveredStar] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.rating === 0) {
      setError("Please select a star rating")
      return
    }
    setError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to submit")
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-28 px-4">
        <div className="w-full max-w-lg">
          {submitted ? (
            <div className="flex flex-col items-center gap-6 text-center py-16">
              <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-3">Thank You, {form.name}! 🎉</h1>
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Your review has been submitted and is awaiting approval. It will appear on our website shortly!
                </p>
              </div>
              <div className="flex gap-1 mt-2">
                {Array.from({ length: form.rating }).map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                  <Star className="h-7 w-7 text-primary fill-primary/20" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">Share Your Experience</h1>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                  Your honest review helps others discover the perfect custom figurine. We appreciate every word!
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5 bg-card border border-border rounded-2xl p-8 shadow-xl shadow-black/5"
              >
                {/* Star Rating */}
                <div className="flex flex-col gap-2 items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Your Rating *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setForm((f) => ({ ...f, rating: star }))}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-9 w-9 transition-colors ${
                            star <= (hoveredStar || form.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {form.rating > 0 && (
                    <span className="text-xs text-muted-foreground font-medium">
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent!"][form.rating]}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* Role / Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Occasion / Title <span className="font-normal text-muted-foreground/60">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Birthday Gift Buyer, Anniversary Gift"
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* Review Text */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your experience with CrabsCart..."
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive font-medium text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-bold text-sm tracking-wide hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting Review...
                    </>
                  ) : (
                    "Submit My Review ✨"
                  )}
                </button>

                <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                  Reviews are moderated before appearing publicly. By submitting, you confirm this review reflects your genuine experience.
                </p>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
