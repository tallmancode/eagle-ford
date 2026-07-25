/**
 * SEO seed content keyed by URL slug (matching the live/dev sitemap).
 * Used by `/next/seed-seo` to update existing CMS documents only — never creates pages.
 */

export type PageSeoSeed = {
  /** CMS page slug (`home` for `/`). */
  slug: string
  title: string
  description: string
}

export type VehicleSeoSeed = {
  slug: string
  metaTitle: string
  metaDescription: string
}

export type VehicleModelSeoSeed = {
  vehicleSlug: string
  modelSlug: string
  metaTitle: string
  metaDescription: string
}

/** Fallback descriptions for special category pages (no CMS meta fields today). */
export type SpecialCategorySeoFallback = {
  slug: string
  description: string
}

const LOCATION = 'at Eagle Ford in Sandton, Johannesburg'

export const PAGE_SEO_SEED: PageSeoSeed[] = [
  {
    slug: 'home',
    title: 'Ford Dealer Sandton | New & Used Fords',
    description: `Official Ford dealership on Corlett Drive, Sandton since 1983. New Ranger, Everest, Territory, Mustang & commercial vehicles, Ford Approved used stock, finance and workshop ${LOCATION}.`,
  },
  {
    slug: 'about-us',
    title: 'About Eagle Ford | Since 1983 on Corlett Drive',
    description: `Meet the Sandton Ford dealership that has served Johannesburg since 1983. New and used sales, finance, and a Ford-accredited workshop ${LOCATION}.`,
  },
  {
    slug: 'contact-us',
    title: 'Contact Eagle Ford | Sales, Service & Enquiries',
    description: `Get in touch with Eagle Ford on Corlett Drive, Sandton. Speak to sales, book a service, or ask about finance and specials ${LOCATION}.`,
  },
  {
    slug: 'meet-the-team',
    title: 'Meet the Team | Eagle Ford Sandton',
    description: `Meet the sales, finance and service team at Eagle Ford. Local Ford specialists who treat every customer like their first ${LOCATION}.`,
  },
  {
    slug: 'vehicles',
    title: 'New Ford Range | Ranger, Everest, Territory & More',
    description: `Explore the full Ford range ${LOCATION}: Next Level Ranger, Everest, Territory, Mustang, Tourneo Custom, Transit Custom and Transit Van.`,
  },
  {
    slug: 'showroom',
    title: 'Ford Showroom | New & Used Stock',
    description: `Browse live Ford stock ${LOCATION}. Filter new and Ford Approved used vehicles, compare specs and enquire online.`,
  },
  {
    slug: 'specials',
    title: 'Ford Specials & Offers | Eagle Ford',
    description: `Current Ford deals on Ranger, Everest, Territory, Mustang and commercial models ${LOCATION}. Finance packages and savings updated regularly.`,
  },
  {
    slug: 'service',
    title: 'Ford Service Booking | Accredited Workshop',
    description: `Book a Ford service online ${LOCATION}. Ford-accredited technicians, genuine parts and transparent workshop communication.`,
  },
  {
    slug: 'parts-accessories',
    title: 'Ford Parts & Accessories | Eagle Ford',
    description: `Order genuine Ford parts and accessories ${LOCATION}. Fitment advice for Ranger, Everest, Territory and commercial vehicles.`,
  },
  {
    slug: 'paint-panel',
    title: 'Paint & Panel | Ford Body Repairs',
    description: `Ford paint and panel repairs ${LOCATION}. Accident damage, dent repair and finish work with dealership-backed quality.`,
  },
  {
    slug: 'wheel-tyre',
    title: 'Wheels & Tyres | Fitment at Eagle Ford',
    description: `Wheel and tyre services for Ford vehicles ${LOCATION}. Fitting, balancing and advice matched to your Ranger, Everest or passenger Ford.`,
  },
  {
    slug: 'finance',
    title: 'Ford Finance & Insurance | Eagle Ford',
    description: `Vehicle finance and insurance options ${LOCATION}. Structured deals, clear repayments and help from our F&I team.`,
  },
  {
    slug: 'sell',
    title: 'Sell Your Car | Trade-In at Eagle Ford',
    description: `Get a trade-in or sell your vehicle ${LOCATION}. Fast valuations and straightforward paperwork from a trusted Ford dealer.`,
  },
  {
    slug: 'test-drive',
    title: 'Book a Ford Test Drive | Eagle Ford Sandton',
    description: `Book a test drive of the Ranger, Everest, Territory, Mustang or commercial Ford ${LOCATION}. Choose a time that suits you.`,
  },
  {
    slug: 'ford-family-promise',
    title: 'Ford Family Promise | Eagle Ford',
    description: `Learn about the Ford Family Promise ${LOCATION} — peace of mind on qualifying Ford vehicles with dealership support.`,
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy | Eagle Ford',
    description: `How Eagle Ford collects, uses and protects your personal information when you enquire, book a service or browse our site.`,
  },
  {
    slug: 'service-form-submitted',
    title: 'Service Booking Received',
    description: `Thank you — your Ford service booking enquiry was received. Eagle Ford will confirm your appointment shortly.`,
  },
  {
    slug: 'sales-form-submitted',
    title: 'Enquiry Received',
    description: `Thank you — your Eagle Ford enquiry was received. A consultant will contact you shortly.`,
  },
]

export const VEHICLE_SEO_SEED: VehicleSeoSeed[] = [
  {
    slug: 'next-level-ranger',
    metaTitle: 'Next Level Ranger | Ford Bakkie Sandton',
    metaDescription: `Explore the Next Level Ford Ranger ${LOCATION}. Sport, Wildtrak, Raptor and more — book a test drive or view current bakkie specials.`,
  },
  {
    slug: 'next-level-everest',
    metaTitle: 'Next Level Everest | Ford SUV Sandton',
    metaDescription: `Discover the Next Level Ford Everest ${LOCATION}. Active, Sport, Wildtrak and Platinum trims with 7-seat capability — enquire or test drive.`,
  },
  {
    slug: 'new-level-territory',
    metaTitle: 'New Territory | Ford SUV Sandton',
    metaDescription: `The New Level Ford Territory ${LOCATION}. Ambiente, Trend and Titanium — stylish SUV value with Ford warranty and local dealer support.`,
  },
  {
    slug: 'mustang',
    metaTitle: 'Ford Mustang GT & Dark Horse | Sandton',
    metaDescription: `Experience the Ford Mustang GT and Dark Horse ${LOCATION}. Book a test drive and view current Mustang offers.`,
  },
  {
    slug: 'new-tourneo-custom',
    metaTitle: 'New Tourneo Custom | Ford People Mover',
    metaDescription: `New Ford Tourneo Custom Trend, Sport and Titanium ${LOCATION}. Comfortable people-mover for family and business — enquire today.`,
  },
  {
    slug: 'new-transit-custom',
    metaTitle: 'New Transit Custom | Ford Commercial Van',
    metaDescription: `New Ford Transit Custom ${LOCATION}. Practical commercial van configurations with Ford service backup in Sandton.`,
  },
  {
    slug: 'transit-van',
    metaTitle: 'Ford Transit Van | Commercial Panel Van',
    metaDescription: `Ford Transit Van 350 LWB and 470 ELWB ${LOCATION}. Load space for business with dealership parts and workshop support.`,
  },
]

/** Model-level SEO keyed to live sitemap paths under /vehicles/{vehicle}/{model}. */
export const VEHICLE_MODEL_SEO_SEED: VehicleModelSeoSeed[] = [
  // Ranger
  {
    vehicleSlug: 'next-level-ranger',
    modelSlug: 'super-cab',
    metaTitle: 'Ranger Super Cab | Next Level Ranger',
    metaDescription: `Ford Ranger Super Cab specs, pricing and variants ${LOCATION}. Compare XL and Wildtrak Super Cab configurations.`,
  },
  {
    vehicleSlug: 'next-level-ranger',
    modelSlug: 'single-cab',
    metaTitle: 'Ranger Single Cab | Next Level Ranger',
    metaDescription: `Ford Ranger Single Cab for work and play ${LOCATION}. View XL 4x2 and 4x4 options and book a test drive.`,
  },
  {
    vehicleSlug: 'next-level-ranger',
    modelSlug: 'sport',
    metaTitle: 'Ranger Sport | Next Level Ranger',
    metaDescription: `Ford Ranger Sport double and super cab ${LOCATION}. Dynamic styling with Ranger capability — enquire for pricing.`,
  },
  {
    vehicleSlug: 'next-level-ranger',
    modelSlug: 'platinum',
    metaTitle: 'Ranger Platinum | Next Level Ranger',
    metaDescription: `Ford Ranger Platinum luxury bakkie ${LOCATION}. Premium cabin and V6 diesel power — book a viewing in Sandton.`,
  },
  {
    vehicleSlug: 'next-level-ranger',
    modelSlug: 'tremor',
    metaTitle: 'Ranger Tremor | Next Level Ranger',
    metaDescription: `Ford Ranger Tremor off-road trim ${LOCATION}. Raised capability for adventure — view specs and specials.`,
  },
  {
    vehicleSlug: 'next-level-ranger',
    modelSlug: 'raptor',
    metaTitle: 'Ranger Raptor | Next Level Ranger',
    metaDescription: `Ford Ranger Raptor high-performance bakkie ${LOCATION}. Twin-turbo V6 thrills — book a test drive today.`,
  },
  {
    vehicleSlug: 'next-level-ranger',
    modelSlug: 'wildtrak',
    metaTitle: 'Ranger Wildtrak | Next Level Ranger',
    metaDescription: `Ford Ranger Wildtrak lifestyle bakkie ${LOCATION}. BiTurbo and V6 options — compare variants and offers.`,
  },
  {
    vehicleSlug: 'next-level-ranger',
    modelSlug: 'wildtrak-x',
    metaTitle: 'Ranger Wildtrak X | Next Level Ranger',
    metaDescription: `Ford Ranger Wildtrak X ${LOCATION}. Extra adventure kit on the Wildtrak platform — enquire at Eagle Ford.`,
  },
  {
    vehicleSlug: 'next-level-ranger',
    modelSlug: 'xl',
    metaTitle: 'Ranger XL | Next Level Ranger',
    metaDescription: `Ford Ranger XL workhorse bakkie ${LOCATION}. Practical double cab value with Ford warranty and service plans.`,
  },
  {
    vehicleSlug: 'next-level-ranger',
    modelSlug: 'xlt',
    metaTitle: 'Ranger XLT | Next Level Ranger',
    metaDescription: `Ford Ranger XLT mid-range bakkie ${LOCATION}. Comfort and capability — view 4x2 and 4x4 configurations.`,
  },
  // Everest
  {
    vehicleSlug: 'next-level-everest',
    modelSlug: 'active',
    metaTitle: 'Everest Active | Next Level Everest',
    metaDescription: `Ford Everest Active SUV ${LOCATION}. Everyday 7-seat versatility — compare 4x2 and 4x4 Active trims.`,
  },
  {
    vehicleSlug: 'next-level-everest',
    modelSlug: 'sport',
    metaTitle: 'Everest Sport | Next Level Everest',
    metaDescription: `Ford Everest Sport ${LOCATION}. Bold styling and V6 diesel performance — book a Sandton test drive.`,
  },
  {
    vehicleSlug: 'next-level-everest',
    modelSlug: 'wildtrak',
    metaTitle: 'Everest Wildtrak | Next Level Everest',
    metaDescription: `Ford Everest Wildtrak adventure SUV ${LOCATION}. Rugged looks with family space — enquire for pricing.`,
  },
  {
    vehicleSlug: 'next-level-everest',
    modelSlug: 'platinum',
    metaTitle: 'Everest Platinum | Next Level Everest',
    metaDescription: `Ford Everest Platinum flagship SUV ${LOCATION}. Premium comfort and capability — view stock and specials.`,
  },
  // Territory
  {
    vehicleSlug: 'new-level-territory',
    modelSlug: 'ambiente',
    metaTitle: 'Territory Ambiente | New Level Territory',
    metaDescription: `Ford Territory Ambiente entry SUV ${LOCATION}. Smart value for Johannesburg families — book a test drive.`,
  },
  {
    vehicleSlug: 'new-level-territory',
    modelSlug: 'trend',
    metaTitle: 'Territory Trend | New Level Territory',
    metaDescription: `Ford Territory Trend ${LOCATION}. Popular mid-spec SUV with comfort features — enquire at Eagle Ford.`,
  },
  {
    vehicleSlug: 'new-level-territory',
    modelSlug: 'titanium',
    metaTitle: 'Territory Titanium | New Level Territory',
    metaDescription: `Ford Territory Titanium top trim ${LOCATION}. Premium SUV finishes — view offers in Sandton.`,
  },
  // Mustang
  {
    vehicleSlug: 'mustang',
    modelSlug: 'gt',
    metaTitle: 'Mustang GT | Ford Mustang Sandton',
    metaDescription: `Ford Mustang GT ${LOCATION}. Iconic performance coupe — book a test drive and check current offers.`,
  },
  {
    vehicleSlug: 'mustang',
    modelSlug: 'dark-horse',
    metaTitle: 'Mustang Dark Horse | Ford Mustang',
    metaDescription: `Ford Mustang Dark Horse ${LOCATION}. Track-inspired performance — enquire with Eagle Ford Sandton.`,
  },
  // Tourneo
  {
    vehicleSlug: 'new-tourneo-custom',
    modelSlug: 'trend',
    metaTitle: 'Tourneo Custom Trend | Eagle Ford',
    metaDescription: `Ford Tourneo Custom Trend people mover ${LOCATION}. Flexible seating for family and shuttle use.`,
  },
  {
    vehicleSlug: 'new-tourneo-custom',
    modelSlug: 'sport',
    metaTitle: 'Tourneo Custom Sport | Eagle Ford',
    metaDescription: `Ford Tourneo Custom Sport ${LOCATION}. Stylish MPV with Ford reliability — book a viewing.`,
  },
  {
    vehicleSlug: 'new-tourneo-custom',
    modelSlug: 'titanium',
    metaTitle: 'Tourneo Custom Titanium | Eagle Ford',
    metaDescription: `Ford Tourneo Custom Titanium ${LOCATION}. Premium people-mover comfort — enquire today.`,
  },
  // Transit Custom
  {
    vehicleSlug: 'new-transit-custom',
    modelSlug: 'base',
    metaTitle: 'Transit Custom Base | Eagle Ford',
    metaDescription: `New Ford Transit Custom Base van ${LOCATION}. Commercial load space with local Ford support.`,
  },
  // Transit Van
  {
    vehicleSlug: 'transit-van',
    modelSlug: '350lwb',
    metaTitle: 'Transit Van 350 LWB | Eagle Ford',
    metaDescription: `Ford Transit Van 350 LWB ${LOCATION}. Long-wheelbase panel van for business — request a quote.`,
  },
  {
    vehicleSlug: 'transit-van',
    modelSlug: '470elwb',
    metaTitle: 'Transit Van 470 ELWB | Eagle Ford',
    metaDescription: `Ford Transit Van 470 ELWB ${LOCATION}. Extra-long commercial van capacity — speak to Eagle Ford.`,
  },
]

export const SPECIAL_CATEGORY_SEO_FALLBACKS: SpecialCategorySeoFallback[] = [
  {
    slug: 'ranger-double-cab-specials',
    description: `Current Ford Ranger Double Cab specials and finance deals ${LOCATION}. Compare savings and enquire online.`,
  },
  {
    slug: 'ranger-super-cab-specials',
    description: `Ford Ranger Super Cab offers ${LOCATION}. View payment-from deals and book a consultation.`,
  },
  {
    slug: 'ranger-single-cab-specials',
    description: `Ford Ranger Single Cab specials ${LOCATION}. Work-ready bakkie deals with local dealer support.`,
  },
  {
    slug: 'territory-specials',
    description: `Ford Territory SUV specials ${LOCATION}. Limited offers on Ambiente, Trend and Titanium.`,
  },
  {
    slug: 'everest-specials',
    description: `Ford Everest specials ${LOCATION}. Savings on Active, Sport, Wildtrak and Platinum trims.`,
  },
  {
    slug: 'ranger-raptor-specials',
    description: `Ford Ranger Raptor specials ${LOCATION}. High-performance bakkie deals — enquire at Eagle Ford.`,
  },
  {
    slug: 'mustang-specials',
    description: `Ford Mustang GT and Dark Horse offers ${LOCATION}. Current performance car specials.`,
  },
  {
    slug: 'transit-custom-specials',
    description: `Ford Transit Custom commercial specials ${LOCATION}. Van deals for business buyers.`,
  },
  {
    slug: 'tourneo-custom-specials',
    description: `Ford Tourneo Custom specials ${LOCATION}. People-mover offers with finance options.`,
  },
]

export function getSpecialCategorySeoDescription(slug: string): string | undefined {
  return SPECIAL_CATEGORY_SEO_FALLBACKS.find((entry) => entry.slug === slug)?.description
}
