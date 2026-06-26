import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Paintbrush,
  PanelTop,
  ShieldCheck,
  Droplets,
  Wrench,
  Layers,
  Settings,
  Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import PaintPanelEnquiryForm from '@/components/services/PaintPanelEnquiryForm'

export const metadata: Metadata = {
  title: 'Paint & Panel | Eagle Ford',
  description:
    "Eagle Ford's Paint & Panel shop specialises in high quality automotive solutions — from minor touch-ups to complete paint jobs, panel repairs, dent removal and more.",
}

const SERVICES = [
  { label: 'Spray Painting', icon: Paintbrush },
  { label: 'Panel Repair / Replace', icon: PanelTop },
  { label: 'Bumper Repairs', icon: ShieldCheck },
  { label: 'Touch Ups', icon: Droplets },
  { label: 'Dent Removal', icon: Wrench },
  { label: 'Paintless Dent Removal', icon: Layers },
  { label: 'Out of Warranty Services', icon: Settings },
  { label: 'Accessory Fitments', icon: Package },
]

export default function PaintPanelPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden min-h-[380px] md:min-h-[480px]">
        <Image
          src="/images/services/paint-panel-hero.webp"
          alt="Eagle Ford Paint & Panel Shop"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        <div className="relative z-10 container mx-auto flex flex-col justify-center py-20 px-4">
          <p className="text-white/70 uppercase tracking-widest text-sm font-medium mb-3">
            Eagle Ford — Paint &amp; Panel
          </p>
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Want Your Car to Look Like New?
          </h1>
          <p className="text-white/80 text-lg max-w-xl mb-8">
            Our expert team specialises in high-quality automotive finishing — from minor touch-ups
            to complete paint jobs and panel repairs, using top-notch materials for lasting
            durability.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:0104400510">
              <Button className="rounded-full bg-white text-black hover:bg-white/90 gap-2">
                <Phone className="size-4" />
                010 440 0510
              </Button>
            </a>
            <a href="mailto:paintandpanel@eaglemc.co.za">
              <Button
                variant="outline"
                className="rounded-full border-white text-white hover:bg-white/10 gap-2"
              >
                <Mail className="size-4" />
                paintandpanel@eaglemc.co.za
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Services + Contact card ── */}
      <section className="container mx-auto py-14 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: description + service list */}
          <div>
            <h2 className="text-primary text-3xl font-bold mb-4">Our Paint &amp; Panel Services</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Eagle Ford&apos;s Paint &amp; Panel Shop specialises in high-quality automotive
              solutions. Our expert team ensures your car looks like new, from minor touch-ups to
              complete paint jobs. We use top-notch materials for lasting durability and a brilliant
              finish. Our panel services repair or replace damaged panels, guaranteeing both safety
              and aesthetics. Trust us with your vehicle, knowing we treat it with the utmost care
              and attention.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICES.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="flex items-center justify-center size-9 rounded-full bg-primary/10 shrink-0">
                    <Icon className="size-4 text-primary" />
                  </span>
                  <span className="font-medium text-foreground">{label}</span>
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
                  href="mailto:paintandpanel@eaglemc.co.za"
                  className="text-base font-medium hover:text-primary transition-colors break-all"
                >
                  paintandpanel@eaglemc.co.za
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                  Address
                </p>
                <p className="text-base font-medium">15 10th Rd, Bramley</p>
                <p className="text-sm text-muted-foreground">Johannesburg, Gauteng</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                  Business Hours
                </p>
                <p className="text-sm font-medium">Mon – Fri: 08:00 – 17:00</p>
                <p className="text-sm font-medium">Saturday: 08:00 – 13:00</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <a href="#enquiry-form">
                <Button className="w-full rounded-full">Enquire Now</Button>
              </a>
              <a
                href="https://maps.google.com/?q=15+10th+Rd+Bramley+Johannesburg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full rounded-full">
                  Get Directions
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why choose us ── */}
      <section className="border-y bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-primary text-2xl font-bold text-center mb-8">
            Why Choose Eagle Ford Paint &amp; Panel?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: 'Expert Technicians',
                description:
                  'Our team of skilled technicians brings years of experience in automotive finishing, ensuring a flawless result every time.',
              },
              {
                title: 'Premium Materials',
                description:
                  "We use only top-notch paints, primers and materials matched to your vehicle's original finish for lasting durability.",
              },
              {
                title: 'All Makes &amp; Models',
                description:
                  'From Fords to any other make — we repair, repaint and restore vehicles of all makes and models.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <CheckCircle2 className="size-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3
                    className="font-semibold text-foreground mb-1"
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  />
                  <p
                    className="text-muted-foreground text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enquiry form ── */}
      <section id="enquiry-form" className="py-14 px-4 scroll-mt-24">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-primary text-3xl font-bold mb-3">Send Us an Enquiry</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Fill in your details below and our paint &amp; panel team will get back to you as soon
              as possible.
            </p>
          </div>
          <div className="border rounded-2xl p-6 md:p-10 shadow-sm bg-card">
            <PaintPanelEnquiryForm />
          </div>
        </div>
      </section>

      {/* ── Location strip ── */}
      <section className="border-t py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary shrink-0" />
            <span>15 10th Rd, Bramley, Johannesburg, Gauteng</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="size-4 text-primary shrink-0" />
            <a href="tel:0104400510" className="hover:text-primary transition-colors">
              010 440 0510
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary shrink-0" />
            <span>Mon – Fri: 08:00 – 17:00 &nbsp;|&nbsp; Sat: 08:00 – 13:00</span>
          </div>
        </div>
      </section>
    </div>
  )
}
