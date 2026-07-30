import { DEFAULT_OG_DESCRIPTION, DEFAULT_OG_IMAGE_PATH, SITE_NAME } from '@/constants/site'
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
    image: `${url}${DEFAULT_OG_IMAGE_PATH}`,
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

export type BreadcrumbItem = {
  name: string
  path: string
}

/** BreadcrumbList JSON-LD for vehicle / model / showroom detail pages. */
export function getBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  const base = getServerSideURL().replace(/\/$/, '')

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const path = item.path.startsWith('/') ? item.path : `/${item.path}`
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${base}${path}`,
      }
    }),
  }
}
