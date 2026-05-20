import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — CrabsCart",
  description: "CrabsCart Privacy Policy. Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: May 20, 2026</p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
              <p>
                Welcome to CrabsCart (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We are committed to protecting your personal information
                and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you visit our website and use our services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
              <p className="mb-3">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and shipping address when you place an order.</li>
                <li><strong>Order Information:</strong> Products purchased, order history, payment method selected, and transaction details.</li>
                <li><strong>Custom Content:</strong> Photos and special instructions you upload for personalized figurine creation.</li>
                <li><strong>Communication Data:</strong> Messages you send to us via email, WhatsApp, or contact forms.</li>
                <li><strong>Device Information:</strong> Browser type, IP address, and browsing behavior collected automatically via cookies.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Process and fulfill your orders, including custom figurine creation</li>
                <li>Send order confirmations, shipping updates, and delivery notifications</li>
                <li>Respond to your inquiries, comments, and support requests</li>
                <li>Improve our website, products, and services</li>
                <li>Send promotional communications (only with your consent)</li>
                <li>Prevent fraudulent transactions and protect against illegal activities</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Information Sharing</h2>
              <p className="mb-3">We do not sell your personal information. We may share your data with:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><strong>Service Providers:</strong> Payment processors, shipping carriers, and cloud hosting providers who assist in our operations.</li>
                <li><strong>Legal Compliance:</strong> When required by law, regulation, or legal process.</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of company assets.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal information, including encrypted
                data transmission (SSL/TLS), secure database storage, and access controls. However, no method of
                transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Cookies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience, remember your
                preferences, and analyze site traffic. You can control cookie settings through your browser preferences.
                Disabling cookies may affect some features of our website.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Third-Party Services</h2>
              <p className="mb-3">Our website integrates the following third-party services:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><strong>Cloudinary:</strong> For secure product image hosting and management</li>
                <li><strong>MongoDB Atlas:</strong> For secure database storage</li>
                <li><strong>Vercel Analytics:</strong> For anonymous website performance monitoring</li>
                <li><strong>WhatsApp:</strong> For customer communication</li>
              </ul>
              <p className="mt-3">Each service operates under its own privacy policy.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Access, update, or delete your personal information</li>
                <li>Opt out of promotional emails at any time</li>
                <li>Request a copy of data we hold about you</li>
                <li>Withdraw consent for data processing</li>
              </ul>
              <p className="mt-3">To exercise these rights, contact us at <strong>crabsown@gmail.com</strong>.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this
                policy, unless a longer retention period is required by law. Order records are retained for accounting and
                legal compliance purposes.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Children&apos;s Privacy</h2>
              <p>
                Our services are not directed to individuals under the age of 13. We do not knowingly collect personal
                information from children. If you believe we have collected information from a child, please contact us
                immediately.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting
                the new policy on this page and updating the &quot;Last updated&quot; date. Your continued use of our services
                constitutes acceptance of the revised policy.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">12. Contact Us</h2>
              <p>If you have questions or concerns about this Privacy Policy, contact us at:</p>
              <div className="mt-3 p-4 rounded-xl border border-border/60 bg-secondary/10 space-y-1 text-sm">
                <p className="font-semibold text-foreground">CrabsCart</p>
                <p>Email: crabsown@gmail.com</p>
                <p>Phone: +91 94007 57707</p>
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
