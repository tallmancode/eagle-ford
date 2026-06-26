import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Phone, Mail, CheckCircle2, Car, GraduationCap, Shield, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import FinanceCalculator from '@/components/services/FinanceCalculator'

export const metadata: Metadata = {
  title: 'Finance | Eagle Ford',
  description:
    'Apply for instant online vehicle finance through Eagle Ford. Use our finance calculator, explore Ford Options, Graduate Programme, and Ford Protect.',
}

const FORD_OPTIONS_BENEFITS = [
  'A new vehicle more often — Ford guarantees the future value of your vehicle.',
  'Choose from four annual mileage options: 10k km to 40k km.',
  'Choose from three terms: 24 months to 48 months with a fixed or linked interest rate.',
  'Three great options at the end of the agreement: RENEW, RETAIN, or RETURN.',
]

const GRADUATE_BENEFITS = [
  'Offers recently qualified graduates a 5% discount off the purchase price of a new Ford and a preferential interest rate.',
  'Available on any finance plan.',
]

const GRADUATE_CRITERIA = [
  "Graduates who have obtained a bachelor's, honours or master's degree, national diploma, BTech or MTech degree within the last five years.",
  'Maximum age of 30 years at the time of initial application — proof of age and an original degree certificate required (no copies).',
  'The vehicle must be registered and financed in the name of the applicant.',
  'Offer cannot be used in conjunction with other offers or promotions.',
  'The preferential interest rate will be determined by the risk profile of the applicant.',
]

const PROTECT_PRODUCTS = [
  'Premium Maintenance Plan — Scheduled services, wear-and-tear components, and mechanical & electrical cover.',
  'Service Plans — Cover all required scheduled services for the selected period, intervals, and kilometres.',
  'Premium Care Warranty — Cover against mechanical and electrical failures beyond your Factory Warranty.',
  'Wear Care — Cover for maintenance components that fail due to normal wear and tear.',
  'Roadside Assistance — 24/7 help in the event of a breakdown.',
  'Vehicle Insurance — Comprehensive insurance arranged for you.',
  'Credit Protection — Protection in the event of retrenchment, death, permanent/temporary disability, or critical illness.',
]

export default function FinancePage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden min-h-[380px] md:min-h-[500px]">
        {/* Desktop image */}
        <Image
          src="/images/finance/finance-hero-desktop.webp"
          alt="Eagle Ford Finance"
          fill
          className="object-cover object-center hidden md:block"
          priority
          sizes="100vw"
        />
        {/* Mobile image */}
        <Image
          src="/images/finance/finance-hero-mobile.webp"
          alt="Eagle Ford Finance"
          fill
          className="object-cover object-center md:hidden"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        <div className="relative z-10 container mx-auto flex flex-col justify-center py-24 px-4">
          <p className="text-white/70 uppercase tracking-widest text-sm font-medium mb-3">
            Eagle Ford — Financial Services
          </p>
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Apply For Finance
          </h1>
          <p className="text-white/80 text-lg max-w-xl mb-8">
            Quick, easy and secure vehicle financing through Eagle Fin — with instant feedback on
            your application.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="https://eaglefin.co.za" target="_blank" rel="noopener noreferrer">
              <Button className="rounded-full bg-white text-black hover:bg-white/90 font-semibold">
                Apply For Instant Finance
              </Button>
            </a>
            <a href="tel:0105971555">
              <Button
                variant="outline"
                className="rounded-full border-white text-white hover:bg-white/10 gap-2"
              >
                <Phone className="size-4" />
                010 597 1555
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Finance Intro ── */}
      <section className="container mx-auto py-14 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: copy */}
          <div>
            <h2 className="text-primary text-3xl font-bold mb-4">Eagle Ford Finance</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              <strong className="text-foreground">WHY WAIT?</strong> Apply for instant online
              financing through <strong className="text-foreground">Eagle Fin</strong>! Eagle Ford
              has various options to finance your next vehicle.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              The application process is:
            </p>
            <ul className="space-y-3 mb-6">
              {(['Quick', 'Easy', 'Secure'] as const).map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-primary shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Upon completing the application, you will receive instant feedback! Or, if you prefer,
              email us at{' '}
              <a
                href="mailto:sales@eagleford.co.za"
                className="text-primary hover:underline underline-offset-2"
              >
                sales@eagleford.co.za
              </a>
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              By submitting an enquiry, you consent to Eagle Corner obtaining and sharing your
              personal details in order to obtain finance through their financial service providers.
              *Subject to bank finance credit qualification. Ts &amp; Cs apply.
            </p>
          </div>

          {/* Right: contact card */}
          <div className="bg-card border rounded-2xl p-8 shadow-sm space-y-6">
            <h2 className="text-primary text-2xl font-bold">Get in Touch</h2>

            <div className="flex items-start gap-3">
              <Phone className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                  Sales Team
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
                <p className="text-sm font-medium">Mon – Fri: 08:00 – 17:30</p>
                <p className="text-sm font-medium">Saturday: 08:00 – 13:00</p>
              </div>
            </div>

            <a href="https://eaglefin.co.za" target="_blank" rel="noopener noreferrer">
              <Button className="w-full rounded-full mt-2">Apply For Instant Finance</Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Finance Calculator ── */}
      <section className="bg-muted/40 py-14 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-primary text-3xl font-bold mb-3">Finance Calculator</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Estimate your monthly instalment based on the vehicle price, deposit, interest rate,
              and your preferred term. Results update in real time.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <FinanceCalculator />
          </div>
        </div>
      </section>

      {/* ── Ford Finance Products ── */}
      <section className="container mx-auto py-14 px-4">
        <div className="text-center mb-10">
          <h2 className="text-primary text-3xl font-bold mb-3">Ford Finance Options</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore the range of Ford-backed finance products available to you at Eagle Ford.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ford Options */}
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/images/finance/ford-options.webp"
                alt="Ford Options"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Car className="size-5 text-white" />
                <span className="text-white font-semibold text-lg">Ford Options</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                Provides security plus flexible terms and mileage options. Drive a new Ford more
                often with a Guaranteed Future Value agreement.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-full w-full">
                    Find Out More
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                  <DialogHeader className="px-6 pt-6">
                    <DialogTitle className="text-primary text-2xl">Ford Options</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      Provides security plus flexible terms and mileage options.
                    </p>
                  </DialogHeader>
                  <div className="px-6 pb-6 space-y-5">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-2">
                        Vehicle Type
                      </p>
                      <p className="font-medium">New Vehicles</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                        Benefits
                      </p>
                      <ul className="space-y-2">
                        {FORD_OPTIONS_BENEFITS.map((b, i) => (
                          <li key={i} className="flex gap-3 text-sm">
                            <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t pt-4 space-y-3 text-sm text-muted-foreground">
                      <p>
                        <strong className="text-foreground">Deposit:</strong> You choose your own
                        deposit, agreement length (24, 36 or 48 months) and anticipated annual
                        mileage (20k, 30k, 40k km).
                      </p>
                      <p>
                        <strong className="text-foreground">Balance:</strong> Ford deducts your
                        deposit and the vehicle&apos;s Guaranteed Future Value (GFV) so your monthly
                        payments are based on the balance plus interest.
                      </p>
                      <p>
                        <strong className="text-foreground">GFV:</strong> At the end of your
                        agreement, you can choose to Renew, Retain or Return your Ford, subject to
                        excess mileage and Fair Wear &amp; Tear standards.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Ford Graduate */}
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/images/finance/ford-graduate.webp"
                alt="Ford Graduate Programme"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <GraduationCap className="size-5 text-white" />
                <span className="text-white font-semibold text-lg">Ford Graduate</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                Designed to help recent graduates drive their first Ford vehicle with a 5% discount
                and preferential interest rate.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-full w-full">
                    Find Out More
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                  <DialogHeader className="px-6 pt-6">
                    <DialogTitle className="text-primary text-2xl">
                      Ford Graduate Programme
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      Designed to help graduates drive their first Ford vehicle.
                    </p>
                  </DialogHeader>
                  <div className="px-6 pb-6 space-y-5">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-2">
                        Vehicle Type
                      </p>
                      <p className="font-medium">New Vehicles</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                        Benefits
                      </p>
                      <ul className="space-y-2">
                        {GRADUATE_BENEFITS.map((b, i) => (
                          <li key={i} className="flex gap-3 text-sm">
                            <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                        Qualifying Criteria
                      </p>
                      <ul className="space-y-2">
                        {GRADUATE_CRITERIA.map((c, i) => (
                          <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                            <span className="size-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Ford Protect */}
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/images/finance/ford-protect.webp"
                alt="Ford Protect - Warranty"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Shield className="size-5 text-white" />
                <span className="text-white font-semibold text-lg">Ford Protect</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                Worry-free motoring with Ford Protect — 100% backed by Ford SA using genuine parts
                installed by authorised technicians.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-full w-full">
                    Find Out More
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                  <DialogHeader className="px-6 pt-6">
                    <DialogTitle className="text-primary text-2xl">
                      Ford Protect – Warranty
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      Worry-free motoring with Ford Protect.
                    </p>
                  </DialogHeader>
                  <div className="px-6 pb-6 space-y-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Eagle Ford offers Ford Protect — the only plan designed to keep your Ford a
                      Ford. 100% backed by Ford SA, it guarantees that we only use genuine Ford
                      parts installed by authorised, trained technicians.
                    </p>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                        Products Available
                      </p>
                      <ul className="space-y-2">
                        {PROTECT_PRODUCTS.map((p, i) => (
                          <li key={i} className="flex gap-3 text-sm">
                            <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-2">
                        If Your Ford Is Stolen or Written Off
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Return to Invoice</strong> — pays the
                        original vehicle purchase price less the greater of: the vehicle&apos;s
                        market value at date of loss, or the amount paid by your vehicle&apos;s
                        insurer.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* ── Finance Partners ── */}
      <section className="bg-muted/40 border-t py-14 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-primary text-3xl font-bold mb-3">Our Finance Partners</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Vehicle finance doesn&apos;t have to be intimidating. Our financing experts provide
              top-notch financial advice and flexible vehicle finance options so you can find the
              package that matches your needs and your budget.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { src: '/images/finance/eagle-fin-logo.webp', alt: 'Eagle Fin' },
              { src: '/images/finance/standard-bank.webp', alt: 'Standard Bank' },
              { src: '/images/finance/nedbank.webp', alt: 'Nedbank' },
            ].map(({ src, alt }) => (
              <div
                key={alt}
                className="flex w-56 h-36 items-center justify-center bg-white rounded-2xl shadow-sm border px-6"
              >
                <Image
                  src={src}
                  alt={alt}
                  width={180}
                  height={90}
                  className="object-contain max-h-20"
                  sizes="224px"
                />
              </div>
            ))}
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
            <span>Mon – Fri: 08:00 – 17:30 &nbsp;|&nbsp; Sat: 08:00 – 13:00</span>
          </div>
        </div>
      </section>
    </div>
  )
}
