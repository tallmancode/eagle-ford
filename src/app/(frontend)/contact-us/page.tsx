import React from 'react'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock, UserCircle2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EnquiryForm from '@/components/contact/EnquiryForm'
import contactHero from '@/assets/Media/services/contact-us.webp'

export const metadata: Metadata = {
  title: 'Contact Us | Eagle Ford',
  description:
    'Get in touch with Eagle Ford. Find our dealership details, operating hours, team contacts and send us an enquiry.',
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const HOURS = [
  {
    id: 'sales',
    label: 'Sales',
    rows: [
      { day: 'Monday – Friday', hours: '08:00 – 17:30' },
      { day: 'Saturday', hours: '08:00 – 13:00' },
      { day: 'Sunday', hours: 'Closed' },
    ],
  },
  {
    id: 'service',
    label: 'Service',
    rows: [
      { day: 'Monday – Friday', hours: '07:00 – 17:30' },
      { day: 'Saturday', hours: '07:30 – 12:30' },
      { day: 'Sunday', hours: 'Closed' },
    ],
  },
  {
    id: 'parts',
    label: 'Parts',
    rows: [
      { day: 'Monday – Friday', hours: '08:00 – 17:00' },
      { day: 'Saturday', hours: '08:00 – 12:30' },
      { day: 'Sunday', hours: 'Closed' },
    ],
  },
  {
    id: 'wheel-tyre',
    label: 'Wheel & Tyre',
    rows: [
      { day: 'Monday – Friday', hours: '08:00 – 17:00' },
      { day: 'Saturday', hours: '08:00 – 12:30' },
      { day: 'Sunday', hours: 'Closed' },
    ],
  },
  {
    id: 'paint-panel',
    label: 'Paint & Panel',
    rows: [
      { day: 'Monday – Friday', hours: '08:00 – 17:00' },
      { day: 'Saturday', hours: '08:00 – 12:30' },
      { day: 'Sunday', hours: 'Closed' },
    ],
  },
]

type TeamMember = {
  name: string
  position: string
  email: string
  tel?: string
  image?: string
}

type Department = {
  name: string
  members: TeamMember[]
}

const DEPARTMENTS: Department[] = [
  {
    name: 'Dealer Principal',
    members: [
      {
        name: 'Craig Gillesen',
        position: 'Dealer Principal',
        email: 'Craig.Gillesen@eagleford.co.za',
        tel: '010 440 0510',
      },
    ],
  },
  {
    name: 'Ford Guest Experience',
    members: [
      {
        name: 'Natasha Jackson',
        position: 'Ford Guest Experience Manager',
        email: 'Natasha.Jackson@eagleford.co.za',
        tel: '010 440 0510',
      },
    ],
  },
  {
    name: 'Sales Department',
    members: [
      {
        name: "Rene' Victor",
        position: 'Sales Manager',
        email: 'Rene.Victor@eagleford.co.za',
      },
      {
        name: 'Adrian Victor',
        position: 'Sales Executive',
        email: 'Adrian.Victor@eagleford.co.za',
        tel: '011 531 3012',
        image: '/meet-the-team/adrian-victor.webp',
      },
      {
        name: 'Evans Mpeko',
        position: 'Sales Executive',
        email: 'Evans.Mpeko@eagleford.co.za',
        tel: '011 531 3011',
        image: '/meet-the-team/evans-mpeko.webp',
      },
      {
        name: 'Humphrey Mabuza',
        position: 'Sales Executive',
        email: 'Humphrey.Mabuza@eagleford.co.za',
        tel: '011 531 3050',
        image: '/meet-the-team/humphrey-mabuza.webp',
      },
      {
        name: 'Rob Wood',
        position: 'Sales Executive',
        email: 'Rob.Wood@eagleford.co.za',
        tel: '011 531 3071',
        image: '/meet-the-team/rob-wood.webp',
      },
      {
        name: 'Thabang Molefe',
        position: 'Sales Executive',
        email: 'Thabang.Molefe@eagleford.co.za',
        tel: '011 531 3055',
        image: '/meet-the-team/thabang-molefe.webp',
      },
      {
        name: 'Sergio Fernandez',
        position: 'Sales Executive',
        email: 'Sergio.Fernandez@eagleford.co.za',
        tel: '011 531 3008',
        image: '/meet-the-team/sergio-fernandez.webp',
      },
      {
        name: 'Mzimkhulu Twala',
        position: 'Sales Executive',
        email: 'Mzimkhulu.Twala@eagleford.co.za',
        tel: '011 531 3072',
        image: '/meet-the-team/mzi-twala.webp',
      },
      {
        name: 'Daphney Maruana',
        position: 'Sales Executive',
        email: 'Daphney.Maruana@eagleford.co.za',
        tel: '011 531 3005',
        image: '/meet-the-team/daphney-maruana.webp',
      },
      {
        name: 'Eugene Jonker',
        position: 'Sales Executive',
        email: 'Eugene.Jonker@eagleford.co.za',
        tel: '011 531 3057',
      },
    ],
  },
  {
    name: 'Pre-Owned Sales',
    members: [
      {
        name: 'Ivan Reymond',
        position: 'Pre-Owned Sales Manager',
        email: 'Ivan.Reymond@eagleford.co.za',
        tel: '011 531 3021',
      },
    ],
  },
  {
    name: 'Fleet Sales',
    members: [
      {
        name: 'Charline Clarke',
        position: 'Fleet Sales Executive',
        email: 'Charline.Clarke@eagleford.co.za',
        tel: '011 531 3107',
        image: '/meet-the-team/charline-clark.webp',
      },
    ],
  },
  {
    name: 'Admin',
    members: [
      {
        name: 'Karisma Singh-Jalilal',
        position: 'Financial Admin Manager',
        email: 'Karisma.Singh-Jalilal@eagleford.co.za',
        tel: '010 440 0510',
      },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactUsPage() {
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden min-h-[320px] md:min-h-[420px]">
        <Image
          src={contactHero}
          alt="Eagle Ford dealership"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
        <div className="relative z-10 container mx-auto flex flex-col justify-center py-20 px-4">
          <p className="text-white/70 uppercase tracking-widest text-sm font-medium mb-3">
            Eagle Ford — Johannesburg
          </p>
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Contact Us
          </h1>
          <p className="text-white/80 text-lg max-w-xl mb-8">
            We&apos;re here to help. Reach out to our team for sales, service, parts or any general
            enquiries.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:0115313000">
              <Button className="rounded-full bg-white text-black hover:bg-white/90 gap-2">
                <Phone className="size-4" />
                011 531 3000
              </Button>
            </a>
            <a href="mailto:sales@eagleford.co.za">
              <Button
                variant="outline"
                className="rounded-full border-white text-white hover:bg-white/10 gap-2"
              >
                <Mail className="size-4" />
                sales@eagleford.co.za
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Dealership Details + Operating Hours ──────────────────────────── */}
      <section className="container mx-auto py-14 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Dealership Details */}
          <div className="bg-card border rounded-2xl p-8 shadow-sm space-y-6">
            <h2 className="text-primary text-2xl font-bold">Dealership Details</h2>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Phone className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Sales</p>
                  <a
                    href="tel:0115313000"
                    className="text-base font-medium hover:text-primary transition-colors"
                  >
                    011 531 3000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Service</p>
                  <a
                    href="tel:0105971555"
                    className="text-base font-medium hover:text-primary transition-colors"
                  >
                    010 597 1555
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Assistance
                  </p>
                  <a
                    href="tel:0104400510"
                    className="text-base font-medium hover:text-primary transition-colors"
                  >
                    010 440 0510
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
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
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Address</p>
                  <p className="text-base font-medium">229 Corlett Dr, Bramley</p>
                  <p className="text-sm text-muted-foreground">Johannesburg, Gauteng</p>
                </div>
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

          {/* Operating Hours */}
          <div className="space-y-4">
            <h2 className="text-primary text-2xl font-bold">Operating Hours</h2>
            <Tabs defaultValue="sales">
              <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/60 p-1">
                {HOURS.map((dept) => (
                  <TabsTrigger key={dept.id} value={dept.id} className="text-xs sm:text-sm">
                    {dept.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {HOURS.map((dept) => (
                <TabsContent key={dept.id} value={dept.id}>
                  <div className="bg-card border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        {dept.rows.map((row, i) => (
                          <tr key={row.day} className={i % 2 === 0 ? 'bg-muted/30' : 'bg-card'}>
                            <td className="px-5 py-3.5 font-medium text-foreground">{row.day}</td>
                            <td
                              className={`px-5 py-3.5 text-right font-semibold ${
                                row.hours === 'Closed' ? 'text-muted-foreground' : 'text-primary'
                              }`}
                            >
                              {row.hours}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Talk to the Boss */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-6 flex items-start gap-4">
              <MessageCircle className="size-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Talk to the Boss</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Have a concern or feedback? Reach our Dealer Principal directly.
                </p>
                <a
                  href="mailto:TalktotheBossEagleFord@eagleford.co.za"
                  className="text-sm font-medium text-primary hover:underline underline-offset-2 transition-colors"
                >
                  TalktotheBossEagleFord@eagleford.co.za
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Location ──────────────────────────────────────────────────── */}
      <section className="w-full">
        <div className="container mx-auto px-4 mb-4">
          <h2 className="text-primary text-2xl font-bold">Our Location</h2>
        </div>
        <div className="w-full h-80 md:h-[450px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.6!2d28.0838!3d-26.1052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950c7a94c9b0d9%3A0x9f9b74cc9b55c1df!2s229%20Corlett%20Dr%2C%20Bramley%2C%20Johannesburg%2C%202090!5e0!3m2!1sen!2sza!4v1700000000000!5m2!1sen!2sza"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Eagle Ford location"
          />
        </div>
      </section>

      {/* ── Our Team ──────────────────────────────────────────────────────── */}
      <section className="container mx-auto py-14 px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-foreground mb-3">
            Our Team
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Meet the people behind Eagle Ford. Our dedicated team is here to ensure you receive an
            exceptional experience every time.
          </p>
        </div>

        <div className="space-y-12">
          {DEPARTMENTS.map((dept) => (
            <div key={dept.name}>
              <h3 className="text-lg font-semibold uppercase tracking-widest text-primary border-b pb-2 mb-6">
                {dept.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {dept.members.map((member) => (
                  <div
                    key={member.email}
                    className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-full aspect-square bg-muted">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                          <UserCircle2 className="w-1/2 h-1/2 text-neutral-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="font-semibold text-foreground leading-tight">{member.name}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {member.position}
                      </p>
                      <div className="pt-1 space-y-1">
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-1.5 text-xs text-primary hover:underline underline-offset-2 transition-colors truncate"
                        >
                          <Mail className="size-3 shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </a>
                        {member.tel && (
                          <a
                            href={`tel:${member.tel.replace(/\s/g, '')}`}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Phone className="size-3 shrink-0" />
                            {member.tel}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Enquire Now ───────────────────────────────────────────────────── */}
      <section className="bg-muted/40 py-14 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-primary text-3xl font-bold mb-3">Enquire Now</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Have a question or comment? Send us a message and we&apos;ll get back to you as soon
              as possible.
            </p>
          </div>
          <EnquiryForm />
        </div>
      </section>

      {/* ── Location strip ────────────────────────────────────────────────── */}
      <section className="border-t py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary shrink-0" />
            <span>229 Corlett Dr, Bramley, Johannesburg, Gauteng</span>
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
