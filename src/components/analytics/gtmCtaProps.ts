type GtmCtaPropsArgs = {
  trackAsCta?: boolean | null
  name: string
  location: string
}

function slugifyCtaName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Returns `data-gtm-cta` / `data-gtm-cta-location` for conversion CTAs.
 * Opt out with `trackAsCta: false`. Missing/undefined defaults to on.
 */
export function gtmCtaProps({
  trackAsCta,
  name,
  location,
}: GtmCtaPropsArgs): Record<string, string> {
  if (trackAsCta === false) return {}

  const slug = slugifyCtaName(name)
  if (!slug) return {}

  return {
    'data-gtm-cta': slug,
    'data-gtm-cta-location': location,
  }
}
