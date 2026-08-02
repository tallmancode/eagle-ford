import { DEFAULT_OG_DESCRIPTION, DEFAULT_OG_IMAGE_PATH, SITE_NAME } from '@/constants/site'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'
import type { ContactInfo1 } from '@/payload-types'

export const PRICE_CURRENCY = 'ZAR'

const DEFAULT_PHONE = '+27 10 440 0510'
const DEFAULT_EMAIL = 'sales@eagleford.co.za'
const DEFAULT_ADDRESS = {
  streetAddress: '229 Corlett Dr, Bramley',
  addressLocality: 'Johannesburg',
  addressRegion: 'Gauteng',
  postalCode: '2090',
  addressCountry: 'ZA',
} as const

export type BreadcrumbItem = {
  name: string
  path: string
}

export type FaqItem = {
  question?: string | null
  answer?: string | null
}

export type ItemListEntry = {
  name: string
  path: string
  imageUrl?: string | null
}

export type DealershipContactInput = Partial<ContactInfo1> | null | undefined

function absoluteUrl(pathOrUrl: string, base = getServerSideURL().replace(/\/$/, '')): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${base}${path}`
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

function isFinitePrice(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function omitUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T
}

function stripContext(node: Record<string, unknown>): Record<string, unknown> {
  const { '@context': _context, ...rest } = node
  return rest
}

/** Combine multiple schema nodes into one `@graph` document. */
export function buildJsonLdGraph(
  ...nodes: Array<Record<string, unknown> | null | undefined>
): Record<string, unknown> {
  const graph = nodes.filter((node): node is Record<string, unknown> => Boolean(node)).map(stripContext)

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

function dealerSellerRef(base: string): Record<string, unknown> {
  return {
    '@type': 'AutoDealer',
    name: SITE_NAME,
    url: base,
  }
}

function postalAddressFromContact(contact?: DealershipContactInput): Record<string, unknown> {
  const address = contact?.address
  if (!address?.street && !address?.city) {
    return {
      '@type': 'PostalAddress',
      ...DEFAULT_ADDRESS,
    }
  }

  const streetParts = [address.street, address.suburb].filter(Boolean)
  return omitUndefined({
    '@type': 'PostalAddress',
    streetAddress: streetParts.join(', ') || DEFAULT_ADDRESS.streetAddress,
    addressLocality: address.city || DEFAULT_ADDRESS.addressLocality,
    addressRegion: address.province || DEFAULT_ADDRESS.addressRegion,
    postalCode: address.postCode || DEFAULT_ADDRESS.postalCode,
    addressCountry: 'ZA',
  })
}

/** AutoDealer / Organization JSON-LD for the dealership sitewide. */
export function getDealershipJsonLd(contact?: DealershipContactInput): Record<string, unknown> {
  const url = getServerSideURL().replace(/\/$/, '')

  return omitUndefined({
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: SITE_NAME,
    description: DEFAULT_OG_DESCRIPTION,
    url,
    image: `${url}${DEFAULT_OG_IMAGE_PATH}`,
    telephone: contact?.phone?.trim() || DEFAULT_PHONE,
    email: contact?.email?.trim() || DEFAULT_EMAIL,
    address: postalAddressFromContact(contact),
    openingHours: contact?.operationHours?.trim() || undefined,
    areaServed: {
      '@type': 'AdministrativeArea',
      name: contact?.address?.city?.trim() || 'Johannesburg',
    },
    brand: {
      '@type': 'Brand',
      name: 'Ford',
    },
    sameAs: contact?.address?.mapsLink?.trim()
      ? [contact.address.mapsLink.trim()]
      : undefined,
  })
}

/** Sitewide WebSite node (publisher points at the dealer). */
export function getWebSiteJsonLd(): Record<string, unknown> {
  const url = getServerSideURL().replace(/\/$/, '')

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url,
    description: DEFAULT_OG_DESCRIPTION,
    publisher: dealerSellerRef(url),
  }
}

export type WebPageJsonLdArgs = {
  name: string
  description?: string | null
  path: string
  dateModified?: string | null
  imageUrl?: string | null
  /** Extra schema.org types, e.g. ContactPage or CollectionPage */
  types?: string[]
}

export function getWebPageJsonLd(args: WebPageJsonLdArgs): Record<string, unknown> {
  const base = getServerSideURL().replace(/\/$/, '')
  const path = normalizePath(args.path)
  const types = args.types?.length ? ['WebPage', ...args.types.filter((t) => t !== 'WebPage')] : ['WebPage']

  return omitUndefined({
    '@context': 'https://schema.org',
    '@type': types.length === 1 ? types[0] : types,
    name: args.name,
    description: args.description || undefined,
    url: `${base}${path}`,
    dateModified: args.dateModified || undefined,
    image: args.imageUrl ? absoluteUrl(args.imageUrl, base) : undefined,
    publisher: dealerSellerRef(base),
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: base,
    },
  })
}

export type ServiceJsonLdArgs = {
  name: string
  description?: string | null
  path: string
  serviceType?: string
}

export function getServiceJsonLd(args: ServiceJsonLdArgs): Record<string, unknown> {
  const base = getServerSideURL().replace(/\/$/, '')
  const path = normalizePath(args.path)

  return omitUndefined({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: args.name,
    description: args.description || undefined,
    url: `${base}${path}`,
    serviceType: args.serviceType || args.name,
    provider: dealerSellerRef(base),
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Johannesburg',
    },
  })
}

/** Map CMS page slugs to WebPage subtype / Service metadata. */
export function getCmsPageJsonLd(args: {
  slug: string
  name: string
  description?: string | null
  path: string
  dateModified?: string | null
  imageUrl?: string | null
}): Record<string, unknown> {
  const slug = args.slug === 'home' ? 'home' : args.slug.replace(/^\//, '')

  const collectionSlugs = new Set(['vehicles', 'specials', 'showroom'])
  const contactSlugs = new Set(['contact-us'])
  const serviceBySlug: Record<string, string> = {
    service: 'Vehicle servicing',
    'parts-accessories': 'Genuine parts',
    'paint-panel': 'Paint and panel',
    'wheel-tyre': 'Wheel and tyre',
    'test-drive': 'Test drive booking',
    sell: 'Sell your vehicle',
    finance: 'Vehicle finance',
  }

  if (contactSlugs.has(slug)) {
    return getWebPageJsonLd({ ...args, types: ['ContactPage'] })
  }

  if (collectionSlugs.has(slug)) {
    return getWebPageJsonLd({ ...args, types: ['CollectionPage'] })
  }

  const serviceType = serviceBySlug[slug]
  if (serviceType) {
    return buildJsonLdGraph(
      getWebPageJsonLd(args),
      getServiceJsonLd({
        name: args.name,
        description: args.description,
        path: args.path,
        serviceType,
      }),
    )
  }

  return getWebPageJsonLd(args)
}

export function getBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> | null {
  if (items.length === 0) return null
  const base = getServerSideURL().replace(/\/$/, '')

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const path = normalizePath(item.path)
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${base}${path}`,
      }
    }),
  }
}

export function getFaqPageJsonLd(faqs: FaqItem[] | null | undefined): Record<string, unknown> | null {
  const valid = (faqs ?? []).filter(
    (faq): faq is { question: string; answer: string } =>
      Boolean(faq.question?.trim() && faq.answer?.trim()),
  )
  if (valid.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: valid.map((faq) => ({
      '@type': 'Question',
      name: faq.question.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.trim(),
      },
    })),
  }
}

export function getItemListJsonLd(args: {
  name: string
  path: string
  items: ItemListEntry[]
}): Record<string, unknown> | null {
  if (args.items.length === 0) return null
  const base = getServerSideURL().replace(/\/$/, '')
  const path = normalizePath(args.path)

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: args.name,
    url: `${base}${path}`,
    numberOfItems: args.items.length,
    itemListElement: args.items.map((item, index) =>
      omitUndefined({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path, base),
        image: item.imageUrl ? absoluteUrl(item.imageUrl, base) : undefined,
      }),
    ),
  }
}

export type VehiclePriceOfferArgs = {
  /** Single fixed price (variant / stock unit). */
  price?: number | null
  /** Range page aggregate. */
  lowPrice?: number | null
  highPrice?: number | null
  offerCount?: number | null
}

function buildVehicleOffers(
  args: VehiclePriceOfferArgs,
  base: string,
  offerUrl: string,
): Record<string, unknown> | undefined {
  if (isFinitePrice(args.price)) {
    return {
      '@type': 'Offer',
      price: args.price,
      priceCurrency: PRICE_CURRENCY,
      availability: 'https://schema.org/InStock',
      url: offerUrl,
      seller: dealerSellerRef(base),
    }
  }

  if (isFinitePrice(args.lowPrice)) {
    const high = isFinitePrice(args.highPrice) ? args.highPrice : args.lowPrice
    return omitUndefined({
      '@type': 'AggregateOffer',
      lowPrice: args.lowPrice,
      highPrice: high,
      offerCount: args.offerCount && args.offerCount > 0 ? args.offerCount : undefined,
      priceCurrency: PRICE_CURRENCY,
      availability: 'https://schema.org/InStock',
      url: offerUrl,
      seller: dealerSellerRef(base),
    })
  }

  return undefined
}

export function getVariantPriceStats(
  variants: Array<{ price?: number | null }>,
): { lowPrice: number; highPrice: number; offerCount: number } | null {
  const prices = variants.map((v) => v.price).filter(isFinitePrice)
  if (prices.length === 0) return null
  return {
    lowPrice: Math.min(...prices),
    highPrice: Math.max(...prices),
    offerCount: prices.length,
  }
}

export function getVehicleJsonLd(args: {
  name: string
  description?: string | null
  path: string
  imageUrl?: string | null
  brandName?: string
  dateModified?: string | null
  price?: number | null
  lowPrice?: number | null
  highPrice?: number | null
  offerCount?: number | null
  vehicleModel?: string | null
  mileageFromOdometer?: number | null
}): Record<string, unknown> {
  const base = getServerSideURL().replace(/\/$/, '')
  const path = normalizePath(args.path)
  const url = `${base}${path}`
  const offers = buildVehicleOffers(args, base, url)

  return omitUndefined({
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: args.name,
    description: args.description || undefined,
    brand: {
      '@type': 'Brand',
      name: args.brandName ?? 'Ford',
    },
    model: args.vehicleModel || undefined,
    url,
    image: args.imageUrl ? absoluteUrl(args.imageUrl, base) : undefined,
    dateModified: args.dateModified || undefined,
    mileageFromOdometer: isFinitePrice(args.mileageFromOdometer)
      ? {
          '@type': 'QuantitativeValue',
          value: args.mileageFromOdometer,
          unitCode: 'KMT',
        }
      : undefined,
    offers,
  })
}

export function getSpecialOfferJsonLd(args: {
  name: string
  description?: string | null
  path: string
  price?: number | null
  imageUrl?: string | null
  dateModified?: string | null
  validThrough?: string | null
}): Record<string, unknown> {
  const base = getServerSideURL().replace(/\/$/, '')
  const path = normalizePath(args.path)
  const url = `${base}${path}`

  const offer = isFinitePrice(args.price)
    ? omitUndefined({
        '@type': 'Offer',
        name: args.name,
        price: args.price,
        priceCurrency: PRICE_CURRENCY,
        url,
        availability: 'https://schema.org/InStock',
        priceValidUntil: args.validThrough || undefined,
        seller: dealerSellerRef(base),
        image: args.imageUrl ? absoluteUrl(args.imageUrl, base) : undefined,
      })
    : undefined

  return omitUndefined({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: args.name,
    description: args.description || undefined,
    url,
    dateModified: args.dateModified || undefined,
    image: args.imageUrl ? absoluteUrl(args.imageUrl, base) : undefined,
    publisher: dealerSellerRef(base),
    mainEntity: offer,
  })
}

export function getStockVehicleJsonLd(args: {
  name: string
  description?: string | null
  path: string
  imageUrl?: string | null
  price?: number | null
  brandName?: string | null
  model?: string | null
  vehicleModelDate?: number | null
  mileage?: number | null
  sku?: string | null
  color?: string | null
}): Record<string, unknown> {
  const base = getServerSideURL().replace(/\/$/, '')
  const path = normalizePath(args.path)
  const url = `${base}${path}`
  const offers = buildVehicleOffers({ price: args.price }, base, url)

  return omitUndefined({
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: args.name,
    description: args.description || undefined,
    brand: {
      '@type': 'Brand',
      name: args.brandName?.trim() || 'Ford',
    },
    model: args.model || undefined,
    vehicleModelDate: args.vehicleModelDate ? String(args.vehicleModelDate) : undefined,
    color: args.color || undefined,
    sku: args.sku || undefined,
    url,
    image: args.imageUrl ? absoluteUrl(args.imageUrl, base) : undefined,
    mileageFromOdometer: isFinitePrice(args.mileage)
      ? {
          '@type': 'QuantitativeValue',
          value: args.mileage,
          unitCode: 'KMT',
        }
      : undefined,
    offers,
  })
}
