import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Wrench,
  Settings2,
  RotateCcw,
  Zap,
  CircleDot,
  Plus,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import WheelTyreEnquiryForm from '@/components/services/WheelTyreEnquiryForm'

export const metadata: Metadata = {
  title: 'Wheel & Tyre | Eagle Ford',
  description:
    'Eagle Wheel and Tyre — expert wheel alignment, balancing, tyre rotation, puncture repair, mag wheels and new tyres. Serving all makes and models.',
}

const SERVICES = [
  {
    icon: Wrench,
    title: 'Wheel Alignment',
    description:
      'Precision adjustment of wheel angles to factory specifications, improving contact with the road and extending tyre life.',
  },
  {
    icon: Settings2,
    title: 'Wheel Balancing',
    description:
      'Eliminate vibrations and uneven wear by perfectly balancing each wheel and tyre assembly.',
  },
  {
    icon: RotateCcw,
    title: 'Tyre Rotation',
    description:
      'Regular rotation to ensure even tyre wear across all four positions, maximising tyre longevity.',
  },
  {
    icon: Zap,
    title: 'Puncture Repair',
    description:
      'Fast, professional puncture repairs to get you safely back on the road as quickly as possible.',
  },
  {
    icon: CircleDot,
    title: 'Mag Wheels',
    description:
      'Upgrade or repair your mag wheels with our expert fitment and restoration service.',
  },
  {
    icon: Plus,
    title: 'New Tyres',
    description:
      'A wide selection of tyres across all makes and models. We will find the right tyre for your vehicle and budget.',
  },
]

type FaqItem = {
  question: string
  answer: string | null
  prefix?: string
  bullets?: string[]
  image?: string
}

const FAQS: FaqItem[] = [
  {
    question: 'Do You Attend To All Brands Of Cars?',
    answer: 'We assist all cars from any brand!',
  },
  {
    question: 'What Is Wheel Alignment?',
    answer:
      "An alignment is the process of adjusting the angles of your vehicle's wheels back within original specifications to improve their contact with the road.",
  },
  {
    question: 'What Affects Wheel Alignment?',
    answer: null,
    bullets: [
      "Normal wear and tear on your car's suspension",
      'Hitting potholes or debris',
      'Aggressive driving',
      'A fender-bender',
    ],
    prefix: 'Common causes for misaligned tyres are:',
  },
  {
    question: 'How Often Should You Get Your Wheels Aligned?',
    answer:
      "It's important to get your car's alignment checked once a year or every 10 000 km, particularly if you've had any of these incidents or if your tyres are wearing unevenly. When you get your alignment checked, you can expect a thorough inspection of your tyres and suspension, along with adjustments to the camber, caster, and toe of each wheel as needed. This process usually takes about an hour — grab a coffee or tea on us while we take care of it.",
  },
  {
    question: 'How To Read Your Tyre Size?',
    answer:
      'Please refer to the image below for guidance on reading your tyre size. We will require your tyre size beforehand to help you as quickly as possible.',
    image: '/images/services/wheel-tyre/tyre-size-diagram.webp',
  },
]

export default function WheelTyrePage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden min-h-[420px] md:min-h-[520px]">
        <Image
          src="/images/services/wheel-tyre/hero-desktop.webp"
          alt="Eagle Wheel and Tyre service bay"
          fill
          className="object-cover object-center hidden md:block"
          priority
          sizes="100vw"
        />
        <Image
          src="/images/services/wheel-tyre/hero-mobile.webp"
          alt="Eagle Wheel and Tyre service bay"
          fill
          className="object-cover object-center md:hidden"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        <div className="relative z-10 container mx-auto flex flex-col justify-center py-20 px-4">
          <p className="text-white/70 uppercase tracking-widest text-sm font-medium mb-3">
            Eagle Ford — Wheel &amp; Tyre
          </p>
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Eagle Wheel and Tyre
          </h1>
          <p className="text-white/80 text-lg max-w-xl mb-8">
            <strong className="text-white">Your wheels and tyres</strong> are your vehicle&apos;s
            only contact with the road. Ensure their perfect alignment and condition with the
            expertise of our professionals — prioritise your family&apos;s safety and the longevity
            of your wheels.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:+27104400510">
              <Button className="rounded-full bg-white text-black hover:bg-white/90 gap-2">
                <Phone className="size-4" />
                010 440 0510
              </Button>
            </a>
            <a href="#enquiry-form">
              <Button
                variant="outline"
                className="rounded-full border-white text-white hover:bg-white/10"
              >
                Enquire Now
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Contact bar ── */}
      <section className="bg-primary text-white py-4 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm">
          <a
            href="tel:+27104400510"
            className="flex items-center gap-2 hover:text-white/80 transition-colors"
          >
            <Phone className="size-4 shrink-0" />
            <span>010 440 0510</span>
          </a>
          <a
            href="mailto:wheelandtyre@eaglemc.co.za"
            className="flex items-center gap-2 hover:text-white/80 transition-colors"
          >
            <Mail className="size-4 shrink-0" />
            <span>wheelandtyre@eaglemc.co.za</span>
          </a>
          <div className="flex items-center gap-2">
            <Clock className="size-4 shrink-0" />
            <span>Mon – Fri: 08:00 – 17:00&nbsp;&nbsp;|&nbsp;&nbsp;Sat: 08:00 – 12:30</span>
          </div>
        </div>
      </section>

      {/* ── Services We Offer ── */}
      <section className="container mx-auto py-14 px-4">
        <div className="text-center mb-10">
          <h2 className="text-primary text-3xl font-bold mb-3">Services We Offer</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our on-site Wheel &amp; Tyre team is ready to help you with all makes and models for
            your car with the following services:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                className="flex gap-4 p-6 border rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="shrink-0">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="size-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── FAQ intro ── */}
      <section className="bg-muted/40 py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-primary text-3xl font-bold mb-4">FAQ on Wheels &amp; Tyres</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Ever find your steering wheel veering off to the left or the right, or having an
            off-centre steering wheel? That&apos;s a sure sign your wheels are misaligned. Still not
            sure or want to find out more about the importance of wheel &amp; tyre alignment? Check
            out our frequently asked questions below, or feel free to contact us on{' '}
            <a href="tel:+27108221850" className="text-primary hover:underline font-medium">
              010 822 1850
            </a>{' '}
            for an obligation-free quote and assistance.
          </p>
        </div>
      </section>

      {/* ── FAQ Accordion ── */}
      <section className="container mx-auto py-10 px-4 max-w-3xl">
        <div className="flex flex-col divide-y divide-border border rounded-2xl overflow-hidden shadow-sm">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none bg-card hover:bg-muted/50 transition-colors group-open:bg-primary group-open:text-primary-foreground">
                <span className="font-medium">{faq.question}</span>
                <ChevronDown className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="px-6 py-5 bg-background text-muted-foreground text-sm leading-relaxed">
                {faq.prefix && <p className="mb-2">{faq.prefix}</p>}
                {faq.bullets && (
                  <ul className="list-disc list-inside space-y-1 mb-2">
                    {faq.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
                {faq.image && (
                  <div className="my-4">
                    <Image
                      src={faq.image}
                      alt="How to read your tyre size"
                      width={600}
                      height={400}
                      className="rounded-lg w-full max-w-md mx-auto"
                    />
                  </div>
                )}
                {faq.answer && <p>{faq.answer}</p>}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── Enquiry Form ── */}
      <section id="enquiry-form" className="bg-muted/40 py-14 px-4 scroll-mt-24">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-primary text-3xl font-bold mb-3">
              Enquire About Our Wheel &amp; Tyre Services
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Fill in your details and our team will get back to you promptly.
            </p>
          </div>
          <div className="border rounded-2xl p-6 md:p-10 shadow-sm bg-card">
            <WheelTyreEnquiryForm />
          </div>
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
            <span>Mon – Fri: 08:00 – 17:00&nbsp;&nbsp;|&nbsp;&nbsp;Sat: 08:00 – 12:30</span>
          </div>
        </div>
      </section>
    </div>
  )
}
