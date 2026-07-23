/**
 * Page SEO seed data keyed by CMS page slug.
 * Titles are stored WITHOUT the "| Eagle Ford" suffix — generateMeta applies it at render.
 */
export type PageSeoSeed = {
  slug: string
  title: string
  description: string
}

export const pageSeoSeeds: PageSeoSeed[] = [
  {
    slug: 'home',
    title: 'Johannesburg Ford Dealership',
    description:
      'Eagle Ford on Corlett Drive, Johannesburg — new Ranger, Everest, Territory, Mustang and commercial Fords, Ford Approved used stock, finance, and accredited workshop service since 1983.',
  },
  {
    slug: 'about-us',
    title: 'About Us',
    description:
      'Meet Eagle Ford — a full Ford dealership in Johannesburg since 1983. New and used sales, finance, and Ford-accredited service with consultants who know your name.',
  },
  {
    slug: 'contact-us',
    title: 'Contact Us',
    description:
      'Contact Eagle Ford Johannesburg for sales, service, parts or general enquiries. Call 010 440 0510 or visit us on Corlett Drive, Sandton.',
  },
  {
    slug: 'service',
    title: 'Book a Service',
    description:
      'Book Ford Quality Care service online at Eagle Ford Johannesburg. Award-winning, Ford-accredited workshop — pick a date and get instant confirmation.',
  },
  {
    slug: 'test-drive',
    title: 'Book a Test Drive',
    description:
      'Book a test drive at Eagle Ford Johannesburg. Try the Ranger, Everest, Territory, Mustang or commercial Ford range with our sales team.',
  },
  {
    slug: 'vehicles',
    title: 'New Ford Vehicles',
    description:
      'Browse new Ford vehicles at Eagle Ford Johannesburg — Ranger, Everest, Territory, Mustang, Tourneo and Transit. View models, pricing and book a quote.',
  },
  {
    slug: 'showroom',
    title: 'Ford Approved Used Vehicles',
    description:
      'Shop Ford Approved used vehicles at Eagle Ford Johannesburg. Inspected, certified pre-owned Fords with the backing you expect from a franchise dealer.',
  },
  {
    slug: 'specials',
    title: 'Ford Specials & Deals',
    description:
      'Current Ford specials at Eagle Ford Johannesburg — deals on new Rangers, Everests, Mustangs and more. View offers and enquire online.',
  },
  {
    slug: 'sell',
    title: 'Sell Your Car',
    description:
      'Sell your low-mileage pre-owned vehicle to Eagle Ford Johannesburg. Competitive offers on 2022 or newer cars — get a valuation online.',
  },
  {
    slug: 'finance',
    title: 'Apply for Finance',
    description:
      'Apply for vehicle finance through Eagle Fin at Eagle Ford Johannesburg. Quick, secure applications with instant feedback on your Ford purchase.',
  },
  {
    slug: 'parts-accessories',
    title: 'Ford Parts & Accessories',
    description:
      'Order genuine Ford parts and accessories from Eagle Ford Johannesburg. Request the part you need and get franchise-dealer pricing and fitment.',
  },
  {
    slug: 'paint-panel',
    title: 'Paint & Panel',
    description:
      'Eagle Ford Paint & Panel — expert automotive finishing from touch-ups to complete resprays. Restore your Ford to look like new in Johannesburg.',
  },
  {
    slug: 'wheel-tyre',
    title: 'Wheel & Tyre',
    description:
      'Eagle Wheel and Tyre at Eagle Ford Johannesburg — alignment, balancing and tyre care so your Ford stays safe and sure-footed on the road.',
  },
  {
    slug: 'meet-the-team',
    title: 'Meet the Team',
    description:
      'Meet the Eagle Ford sales team in Johannesburg. Know who will look after you from first enquiry through delivery and beyond.',
  },
  {
    slug: 'ford-family-promise',
    title: 'Ford Family Promise',
    description:
      'The Ford Family Promise at Eagle Ford — no shortcuts, no excuses. Online service booking, care commitments and franchise-dealer standards.',
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    description:
      'Privacy policy for Eagle Ford Johannesburg. How we collect, use and protect your personal information when you use our website and services.',
  },
  {
    slug: 'sales-form-submitted',
    title: 'Thank You — Sales Enquiry',
    description:
      'Thank you for contacting Eagle Ford sales. Our team will be in touch shortly about your enquiry.',
  },
  {
    slug: 'service-form-submitted',
    title: 'Thank You — Service Booking',
    description:
      'Thank you for your Eagle Ford service booking request. Our service team will confirm your appointment shortly.',
  },
]
