import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Wifi, Clock, Truck, Coffee, MapPin, Phone, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About Us | Eagle Ford',
  description:
    "Eagle Corner, one of South Africa's most loved automotive families. Founded in 1983, we've grown to a team of 200 dedicated members across Ford, Mazda, Mahindra and Suzuki. Four-time Dealer of the Year.",
}

const PERKS = [
  {
    icon: Wifi,
    title: 'Free Wi-Fi & Refreshments',
    description:
      'Relax with complimentary coffee or tea and free Wi-Fi while we take care of your vehicle.',
  },
  {
    icon: Clock,
    title: '60-Min Express Servicing',
    description: 'Back on the road in under an hour — your time matters to us.',
  },
  {
    icon: Truck,
    title: 'Pick-Up & Delivery',
    description:
      "We'll fetch your car and drop it off at your convenience, within a 30 km radius. Special arrangements available beyond 30 km.",
  },
  {
    icon: Coffee,
    title: 'Eagle Café On-Site',
    description:
      'Enjoy great snacks, full meals, and cappuccinos at our on-site café while you wait.',
  },
]

const STATS = [
  { value: '1983', label: 'Founded' },
  { value: '4×', label: 'Dealer of the Year' },
  { value: '200+', label: 'Team Members' },
  { value: '25 000m²', label: 'Premises' },
]

const CTA_CARDS = [
  {
    title: 'Browse New Vehicles',
    description: 'Explore the full Ford range — Ranger, Everest, Mustang and more.',
    href: '/new/',
    label: 'View New Vehicles',
  },
  {
    title: 'View Pre-Owned',
    description: 'Find a quality pre-owned vehicle that suits your needs and budget.',
    href: '/showroom/',
    label: 'View Pre-Owned',
  },
  {
    title: 'Book a Service',
    description: 'Quality Care accredited by Ford Motor Company SA. Book online today.',
    href: '/services/service/',
    label: 'Book a Service',
  },
]

export default function AboutUsPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: '38vh' }}>
        <div className="relative w-full aspect-[16/5]">
          <Image
            src="/about-us/hero.webp"
            alt="Eagle Ford dealership exterior at 229 Corlett Drive, Bramley"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
          <div className="absolute inset-0 flex flex-col justify-end pb-10 pl-6 md:pl-12">
            <p className="text-white/70 uppercase tracking-widest text-xs md:text-sm font-medium mb-2">
              Eagle Corner — Since 1983
            </p>
            <h1 className="text-white text-4xl md:text-6xl font-bold uppercase tracking-wider mb-3">
              About Us
            </h1>
            <p className="text-white/85 text-base md:text-lg max-w-xl">
              Find out what makes us the right place to buy your next vehicle.
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA buttons below hero ── */}
      <div className="bg-muted/50 border-b py-5 px-4">
        <div className="container mx-auto flex flex-wrap gap-3 justify-center">
          <Link href="/specials/">
            <Button className="rounded-full">View All Offers</Button>
          </Link>
          <Link href="/new/">
            <Button variant="outline" className="rounded-full">
              View New Vehicles
            </Button>
          </Link>
          <Link href="/showroom/">
            <Button variant="outline" className="rounded-full">
              View Pre-Owned
            </Button>
          </Link>
        </div>
      </div>

      {/* ── About Section ── */}
      <section className="container mx-auto py-14 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              We take our customers &amp; customer service —{' '}
              <span className="text-primary">Very seriously.</span>
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Eagle Corner is South Africa&apos;s most loved automotive family. Founded in 1983,
                we&apos;ve grown from start-up to a team of{' '}
                <strong className="text-foreground">200 dedicated family members</strong> across
                three brands. From day one, exceptional service has been Eagle Ford&apos;s hallmark.
              </p>
              <p>
                Because we go out of our way to ensure that you are delighted in all your dealings
                with us, our customers have chosen to keep entrusting us with their motoring needs.
                Most of our team have been with us for a long time — every time you return,
                you&apos;ll be assisted by the same people you&apos;ve learned to trust.
              </p>
              <p>
                We also have <strong className="text-foreground">Eagle Wheel &amp; Tyre</strong> and
                an accredited <strong className="text-foreground">Paint &amp; Panel Centre</strong>{' '}
                on-site, across four brands: Ford, Mazda, Mahindra, and Suzuki.
              </p>
              <p>
                As one of South Africa&apos;s top Ford dealerships and{' '}
                <strong className="text-foreground">
                  four-time winners of the Dealer of the Year
                </strong>{' '}
                title, we combine decades of industry experience with down-home friendliness to
                deliver the most pleasant one-stop-shop experience you could ask for.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <Link href="/contact-us/">
                <Button className="rounded-full gap-2">
                  <Phone className="size-4" />
                  Contact Us
                </Button>
              </Link>
              <Link href="/meet-the-team/">
                <Button variant="outline" className="rounded-full gap-2">
                  Meet the Team
                  <ChevronRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
            <Image
              src="/about-us/about.webp"
              alt="Eagle Ford service technician at work"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-foreground text-background py-12 px-4">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
              <p className="text-sm uppercase tracking-widest opacity-70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Hospitality Perks ── */}
      <section className="container mx-auto py-14 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            And then we add the flourishes.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            We see our customers as part of our family. That&apos;s why we go much further — giving
            you more than you&apos;d expect to ensure you feel right at home.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PERKS.map((perk) => {
            const Icon = perk.icon
            return (
              <div
                key={perk.title}
                className="bg-card border rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="size-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{perk.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── CTA Cards ── */}
      <section className="bg-muted/40 py-14 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">
            Get the Full Ford Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CTA_CARDS.map((card) => (
              <div
                key={card.title}
                className="bg-card border rounded-2xl p-8 flex flex-col justify-between shadow-sm"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <Link href={card.href}>
                  <Button variant="outline" className="rounded-full w-full">
                    {card.label}
                    <ChevronRight className="size-4 ml-1" />
                  </Button>
                </Link>
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
            <Phone className="size-4 text-primary shrink-0" />
            <a href="tel:0104400510" className="hover:text-primary transition-colors">
              010 440 0510
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary shrink-0" />
            <span>Mon – Fri: 08:00 – 17:30 &nbsp;|&nbsp; Sat: 08:30 – 13:00</span>
          </div>
        </div>
      </section>
    </div>
  )
}
