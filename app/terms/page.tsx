import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service — CrabsCart",
  description: "CrabsCart Terms of Service. Read about the terms and conditions governing the use of our platform and services.",
}

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last updated: May 20, 2026</p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the CrabsCart website and services, you agree to be bound by these Terms of Service.
                If you do not agree with any part of these terms, you must not use our website or services. These terms
                apply to all visitors, users, and customers of CrabsCart.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Products & Services</h2>
              <p className="mb-3">CrabsCart offers custom handcrafted bobblehead figurines and personalized collectibles. By placing an order, you acknowledge:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>All figurines are handmade and may have minor variations from product images.</li>
                <li>Custom orders require clear photographs and specific instructions for personalization.</li>
                <li>Production timelines are estimated and may vary based on order complexity and volume.</li>
                <li>Colors may appear slightly different due to screen display variations.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Orders & Payments</h2>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise.</li>
                <li>GST at 18% is applied on all orders as per Indian tax regulations.</li>
                <li>We accept Card payments, UPI, and Cash on Delivery (COD) at our discretion.</li>
                <li>An order is confirmed only after successful payment processing or COD acceptance.</li>
                <li>We reserve the right to refuse or cancel any order at our discretion, including for suspected fraud.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Custom Orders & Intellectual Property</h2>
              <p className="mb-3">When submitting photos and content for custom figurines:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>You confirm you have the right to use all photos and content submitted.</li>
                <li>You grant CrabsCart a non-exclusive license to use submitted materials solely for order fulfillment.</li>
                <li>We may use anonymized or generic images of completed figurines for portfolio and marketing purposes, unless you opt out.</li>
                <li>CrabsCart retains all intellectual property rights in its product designs, branding, and website content.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Shipping & Delivery</h2>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Shipping timelines are estimates and not guarantees. Delays may occur due to factors beyond our control.</li>
                <li>Risk of loss and title for products pass to you upon delivery to the shipping carrier.</li>
                <li>You are responsible for providing accurate shipping information. CrabsCart is not liable for delivery issues caused by incorrect addresses.</li>
                <li>A tracking number will be provided for all shipped orders where available.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Returns & Refunds</h2>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Returns must be initiated within <strong>7 days</strong> of delivery.</li>
                <li>Items must be returned in their original packaging and condition.</li>
                <li>We accept returns for: transit damage, manufacturing defects, wrong items received, and significant quality issues.</li>
                <li>Custom-made figurines cannot be returned for change of mind or personal preference.</li>
                <li>Refunds are processed within <strong>5–7 business days</strong> after we receive and inspect the returned item.</li>
                <li>Refunds will be issued to the original payment method used for the purchase.</li>
                <li>Shipping costs for returns due to our error will be borne by CrabsCart.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Cancellations</h2>
              <p>
                Orders may be cancelled within <strong>24 hours</strong> of placement if production has not yet begun. Once
                an order enters the crafting stage, cancellations are not possible due to the custom nature of our products.
                To request a cancellation, contact us immediately at <strong>crabscart@gmail.com</strong>.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Coupon Codes & Promotions</h2>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Coupon codes are single-use unless otherwise specified.</li>
                <li>Coupons cannot be combined with other offers or promotions.</li>
                <li>We reserve the right to modify or discontinue any promotion at any time without notice.</li>
                <li>Coupon codes have no cash value and cannot be redeemed for cash.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. User Conduct</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Use our services for any unlawful purpose</li>
                <li>Submit false or misleading information</li>
                <li>Upload content that is offensive, defamatory, or infringes on third-party rights</li>
                <li>Attempt to gain unauthorized access to our systems or databases</li>
                <li>Interfere with the proper functioning of our website</li>
                <li>Use automated systems (bots, scrapers) to access our services without permission</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, CrabsCart shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising from your use of our services. Our total liability shall not
                exceed the amount paid by you for the specific product or service giving rise to the claim.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">11. Disclaimer of Warranties</h2>
              <p>
                Our services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no warranties, express or implied,
                regarding the merchantability, fitness for a particular purpose, or non-infringement of our products and
                services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">12. Governing Law</h2>
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes
                arising from these terms shall be subject to the exclusive jurisdiction of the courts in Kerala, India.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">13. Changes to Terms</h2>
              <p>
                We reserve the right to update or modify these Terms of Service at any time. Changes will be effective
                immediately upon posting to this page. Your continued use of our services after any changes constitutes
                acceptance of the new terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">14. Contact Us</h2>
              <p>For questions about these Terms of Service, please contact us:</p>
              <div className="mt-3 p-4 rounded-xl border border-border/60 bg-secondary/10 space-y-1 text-sm">
                <p className="font-semibold text-foreground">CrabsCart</p>
                <p>Email: crabscart@gmail.com</p>
                <p>Phone: +91 97783 00633</p>
                <p>Address: Karunagappally, Kerala, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
