import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin, Clock, TrendingUp, ShieldCheck, HandshakeIcon } from 'lucide-react'
import SellEnquiryForm from '@/components/sell/SellEnquiryForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sell Your Car | Eagle Ford',
  description:
    'Get more for your pre-owned vehicle. Eagle Ford buys low mileage, 2022 or younger vehicles for more than the major market players will offer.',
}

const WHY_ITEMS = [
  {
    icon: TrendingUp,
    title: 'Best Market Price',
    description:
      'We offer above-market valuations on low mileage, 2022 or newer pre-owned vehicles — guaranteed to beat the major market players.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent Process',
    description:
      'No hidden fees, no pressure. Bring your vehicle in for a free evaluation and receive a fair, transparent offer on the spot.',
  },
  {
    icon: HandshakeIcon,
    title: 'Trade-In Welcome',
    description:
      "Don't want to sell outright? We're happy to help you trade in your vehicle for one of our sought-after New or Nearly New Fords.",
  },
]

export default function SellPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden min-h-[380px] md:min-h-[480px]">
        <Image
          src="/sell-hero.webp"
          alt="Sell your car at Eagle Ford"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 container mx-auto flex flex-col justify-end py-20 px-4 h-full min-h-[380px] md:min-h-[480px]">
          <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
            Want to sell your car?
          </h1>
        </div>
      </section>

      {/* ── Value proposition strip ── */}
      <section className="bg-primary text-white py-6 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-base md:text-lg font-medium max-w-2xl">
            We want your low mileage, 2022 or younger pre-owned vehicle so badly that we&apos;ll buy
            it for <strong>more</strong> than what the major market players will offer.
          </p>
          <a href="#enquiry-form">
            <Button className="rounded-full bg-white text-primary hover:bg-white/90 font-bold shrink-0 px-8">
              ENQUIRE NOW
            </Button>
          </a>
        </div>
      </section>

      {/* ── Why section ── */}
      <section className="container mx-auto py-14 px-4">
        <div className="max-w-3xl">
          <h2 className="text-primary text-3xl md:text-4xl font-bold mb-4">
            So why settle for less when you can get <span className="uppercase">MORE?</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Bring your vehicle to the dealership for an evaluation, or simply complete the contact
            request form below and we&apos;ll contact you in no time at all.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Don&apos;t want to sell outright? We are happy to help you trade it in for one of our
            sought-after New or Nearly New vehicles, or help find your next vehicle if we don&apos;t
            have exactly what you want.
          </p>
        </div>

        {/* Why cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {WHY_ITEMS.map((item) => (
            <div
              key={item.title}
              className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-3"
            >
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="size-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-lg">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Enquiry Form ── */}
      <section id="enquiry-form" className="bg-muted/40 py-14 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-primary text-3xl font-bold mb-3">Get Your Free Valuation</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Complete the form below and our team will prepare an offer for your vehicle within one
              business day.
            </p>
          </div>
          <SellEnquiryForm />
        </div>
      </section>

      {/* ── Contact strip ── */}
      <section className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-primary text-2xl font-bold mb-5">Prefer to talk to us directly?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                    Sales
                  </p>
                  <a
                    href="tel:0104400510"
                    className="text-lg font-semibold hover:text-primary transition-colors"
                  >
                    010 440 0510
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                    Email
                  </p>
                  <a
                    href="mailto:sales@eagleford.co.za"
                    className="text-base font-medium hover:text-primary transition-colors"
                  >
                    sales@eagleford.co.za
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                    Visit Us
                  </p>
                  <p className="text-base font-medium">229 Corlett Dr, Bramley</p>
                  <p className="text-sm text-muted-foreground">Sandton, Johannesburg, Gauteng</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                    Hours
                  </p>
                  <p className="text-sm font-medium">Mon – Fri: 08:00 – 17:30</p>
                  <p className="text-sm font-medium">Saturday: 08:00 – 13:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full rounded-2xl overflow-hidden border shadow-sm aspect-video">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.227!2d28.0742!3d-26.1154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950e3d6a2b3a7b%3A0x1234567890abcdef!2s229+Corlett+Dr%2C+Bramley%2C+Johannesburg!5e0!3m2!1sen!2sza!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Eagle Ford location"
            />
          </div>
        </div>
      </section>

      {/* ── Bottom strip ── */}
      <section className="border-t py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary shrink-0" />
            <span>229 Corlett Dr, Bramley, Sandton, Johannesburg, Gauteng</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary shrink-0" />
            <span>Mon – Fri: 08:00 – 17:30 &nbsp;|&nbsp; Sat: 08:00 – 13:00</span>
          </div>
        </div>
      </section>
    </div>
  )
}
