import type { Setting } from '@/payload-types'
import { DEFAULT_OG_DESCRIPTION, SITE_NAME } from '@/constants/site'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'

type SiteJsonLdProps = {
  settings: Setting | null | undefined
}

function buildAddress(settings: Setting | null | undefined) {
  const address = settings?.contactInfo?.address
  if (!address?.street || !address?.city) return undefined

  return {
    '@type': 'PostalAddress',
    streetAddress: [address.street, address.suburb].filter(Boolean).join(', '),
    addressLocality: address.city,
    addressRegion: address.province,
    postalCode: address.postCode || undefined,
    addressCountry: 'ZA',
  }
}

/**
 * Organization / AutoDealer JSON-LD for Google rich results.
 * Safe when settings are incomplete — omits optional fields rather than inventing data.
 */
export function SiteJsonLd({ settings }: SiteJsonLdProps) {
  const baseUrl = getServerSideURL()
  const phone = settings?.contactInfo?.phone || undefined
  const email = settings?.contactInfo?.email || undefined
  const address = buildAddress(settings)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: SITE_NAME,
    url: baseUrl,
    description: DEFAULT_OG_DESCRIPTION,
    ...(phone ? { telephone: phone } : {}),
    ...(email ? { email } : {}),
    ...(address ? { address } : {}),
    brand: {
      '@type': 'Brand',
      name: 'Ford',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
