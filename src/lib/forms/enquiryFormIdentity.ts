/**
 * Stable marketing identities for the ten Ford enquiry forms.
 * Matches GTM / Ads `form_name` values (issue #356) and thank-you routing (#355).
 */

export type EnquiryDepartment = 'sales' | 'service'

export type EnquiryFormName =
  | 'general_enquiry'
  | 'new_vehicle_quote'
  | 'used_vehicle_quote'
  | 'special_offer'
  | 'test_drive'
  | 'service_booking'
  | 'parts'
  | 'sell_your_car'
  | 'wheel_tyre'
  | 'paint_panel'

export const SALES_THANK_YOU_SLUG = 'sales-form-submitted'
export const SERVICE_THANK_YOU_SLUG = 'service-form-submitted'

export const THANK_YOU_SLUGS = [SALES_THANK_YOU_SLUG, SERVICE_THANK_YOU_SLUG] as const

export type ThankYouSlug = (typeof THANK_YOU_SLUGS)[number]

type EnquiryFormIdentity = {
  formName: EnquiryFormName
  department: EnquiryDepartment
  thankYouSlug: ThankYouSlug
  /** Normalized title fragments that identify this form (substring match after normalize). */
  titleMatchers: string[]
}

const ENQUIRY_FORM_IDENTITIES: EnquiryFormIdentity[] = [
  {
    formName: 'general_enquiry',
    department: 'sales',
    thankYouSlug: SALES_THANK_YOU_SLUG,
    titleMatchers: ['general enquiry'],
  },
  {
    formName: 'new_vehicle_quote',
    department: 'sales',
    thankYouSlug: SALES_THANK_YOU_SLUG,
    titleMatchers: ['new vehicle quote'],
  },
  {
    formName: 'used_vehicle_quote',
    department: 'sales',
    thankYouSlug: SALES_THANK_YOU_SLUG,
    titleMatchers: ['used vehicle quote'],
  },
  {
    formName: 'special_offer',
    department: 'sales',
    thankYouSlug: SALES_THANK_YOU_SLUG,
    titleMatchers: ['special offer'],
  },
  {
    formName: 'test_drive',
    department: 'sales',
    thankYouSlug: SALES_THANK_YOU_SLUG,
    titleMatchers: ['test drive'],
  },
  {
    formName: 'sell_your_car',
    department: 'sales',
    thankYouSlug: SALES_THANK_YOU_SLUG,
    titleMatchers: ['sell your car', 'sell my car', 'sell enquiry'],
  },
  {
    formName: 'service_booking',
    department: 'service',
    thankYouSlug: SERVICE_THANK_YOU_SLUG,
    titleMatchers: ['service booking'],
  },
  {
    formName: 'parts',
    department: 'service',
    thankYouSlug: SERVICE_THANK_YOU_SLUG,
    titleMatchers: ['parts enquiry', 'parts form'],
  },
  {
    formName: 'wheel_tyre',
    department: 'service',
    thankYouSlug: SERVICE_THANK_YOU_SLUG,
    titleMatchers: ['wheel & tyre', 'wheel and tyre', 'wheel tyre'],
  },
  {
    formName: 'paint_panel',
    department: 'service',
    thankYouSlug: SERVICE_THANK_YOU_SLUG,
    titleMatchers: ['paint & panel', 'paint and panel', 'paint panel'],
  },
]

export function normalizeFormTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
}

export function resolveEnquiryFormIdentity(
  title: string | null | undefined,
): EnquiryFormIdentity | null {
  if (!title?.trim()) return null
  const normalized = normalizeFormTitle(title)

  for (const identity of ENQUIRY_FORM_IDENTITIES) {
    for (const matcher of identity.titleMatchers) {
      if (normalized.includes(normalizeFormTitle(matcher))) {
        return identity
      }
    }
  }

  return null
}

export function isThankYouSlug(slug: string | null | undefined): slug is ThankYouSlug {
  return THANK_YOU_SLUGS.includes(slug as ThankYouSlug)
}

export function getThankYouPathForFormTitle(title: string | null | undefined): string | null {
  const identity = resolveEnquiryFormIdentity(title)
  if (!identity) return null
  return `/${identity.thankYouSlug}`
}
