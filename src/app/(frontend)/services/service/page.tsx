import React from 'react'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ServiceBookingForm from '@/components/services/ServiceBookingForm'
import serviceHero from '@/assets/Media/services/service.webp'

const FEATURES = [
  {
    title: '60-Min Express Servicing',
    description:
      'Relax at Eagle Café with free Wi-Fi while we take care of your car — back on the road in under an hour.',
  },
  {
    title: 'Pick Up & Delivery',
    description:
      "We'll fetch your car and drop it off at your convenience within a 30 km radius. Special arrangements available beyond 30 km — speak to your Service Advisor.",
  },
  {
    title: 'Saturday & Early Weekday Hours',
    description:
      'Open from 07:00 on weekdays and 07:30 on Saturdays — servicing that fits your schedule.',
  },
]

export default function ServicePage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden min-h-[380px] md:min-h-[480px]">
        <Image
          src={serviceHero}
          alt="Eagle Ford Service Centre"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        <div className="relative z-10 container mx-auto flex flex-col justify-center py-20 px-4">
          <p className="text-white/70 uppercase tracking-widest text-sm font-medium mb-3">
            Eagle Ford — Service Centre
          </p>
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Book a Service
          </h1>
          <p className="text-white/80 text-lg max-w-xl mb-8">
            Award-winning service excellence. Quality Care accredited by Ford Motor Company South
            Africa for three consecutive years.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:0105971555">
              <Button className="rounded-full bg-white text-black hover:bg-white/90 gap-2">
                <Phone className="size-4" />
                010 597 1555
              </Button>
            </a>
            <a href="mailto:service@eagleford.co.za">
              <Button
                variant="outline"
                className="rounded-full border-white text-white hover:bg-white/10 gap-2"
              >
                <Mail className="size-4" />
                service@eagleford.co.za
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── About / Features ── */}
      <section className="container mx-auto py-14 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: accreditation + features */}
          <div>
            <h2 className="text-primary text-3xl font-bold mb-4">Why Service With Us?</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our dealership has been awarded and accredited as a{' '}
              <strong className="text-foreground">Quality Care Dealer</strong> by Ford Motor Company
              South Africa for the last three years. Many of our staff have received awards for
              service excellence and are always striving to go the extra mile for our customers. You
              can be confident that the best team is working on your pride and joy.
            </p>
            <ul className="space-y-6">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="flex gap-4">
                  <CheckCircle2 className="size-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: contact card */}
          <div className="bg-card border rounded-2xl p-8 shadow-sm space-y-6">
            <h2 className="text-primary text-2xl font-bold">Get in Touch</h2>

            <div className="flex items-start gap-3">
              <Phone className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                  Contact Us Today
                </p>
                <a
                  href="tel:0105971555"
                  className="text-lg font-semibold hover:text-primary transition-colors"
                >
                  010 597 1555
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
                  href="mailto:service@eagleford.co.za"
                  className="text-base font-medium hover:text-primary transition-colors"
                >
                  service@eagleford.co.za
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                  Address
                </p>
                <p className="text-base font-medium">229 Corlett Dr, Bramley</p>
                <p className="text-sm text-muted-foreground">Sandton, Johannesburg, Gauteng</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                  Business Hours
                </p>
                <p className="text-sm font-medium">Mon – Fri: 07:00 – 17:30</p>
                <p className="text-sm font-medium">Saturday: 07:30 – 12:30</p>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=229+Corlett+Dr+Bramley+Johannesburg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full rounded-full mt-2">
                Get Directions
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Booking Form ── */}
      <section className="bg-muted/40 py-14 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-primary text-3xl font-bold mb-3">Schedule Your Service</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Fill in your details below and our service team will confirm your booking within 24
              hours.
            </p>
          </div>
          <ServiceBookingForm />
        </div>
      </section>

      {/* ── Location strip ── */}
      <section className="border-t py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary shrink-0" />
            <span>229 Corlett Dr, Bramley, Sandton, Johannesburg, Gauteng</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary shrink-0" />
            <span>Mon – Fri: 07:00 – 17:30 &nbsp;|&nbsp; Sat: 07:30 – 12:30</span>
          </div>
        </div>
      </section>
    </div>
  )
}
