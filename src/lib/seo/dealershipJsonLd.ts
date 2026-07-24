import { DEFAULT_OG_DESCRIPTION, SITE_NAME } from '@/constants/site'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'

/** AutoDealer / Organization JSON-LD for the dealership sitewide. */
export function getDealershipJsonLd(): Record<string, unknown> {
  const url = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: SITE_NAME,
    description: DEFAULT_OG_DESCRIPTION,
    url,
    image: `${url}/eagle-motor-city-og.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Corlett Drive',
      addressLocality: 'Sandton',
      addressRegion: 'Gauteng',
      addressCountry: 'ZA',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Johannesburg',
    },
    brand: {
      '@type': 'Brand',
      name: 'Ford',
    },
  }
}

export function getVehicleJsonLd(args: {
  name: string
  description?: string | null
  path: string
  imageUrl?: string | null
  brandName?: string
}): Record<string, unknown> {
  const base = getServerSideURL().replace(/\/$/, '')
  const path = args.path.startsWith('/') ? args.path : `/${args.path}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: args.name,
    description: args.description || undefined,
    brand: {
      '@type': 'Brand',
      name: args.brandName ?? 'Ford',
    },
    url: `${base}${path}`,
    image: args.imageUrl
      ? args.imageUrl.startsWith('http')
        ? args.imageUrl
        : `${base}${args.imageUrl}`
      : undefined,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'AutoDealer',
        name: SITE_NAME,
        url: base,
      },
    },
  }
}
