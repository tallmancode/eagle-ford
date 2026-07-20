import type { Special } from '@/payload-types'
import { getOfferTypeLabel } from '@/lib/specials/constants'

type SpecialTitleSource = Pick<Special, 'title' | 'subTitle' | 'offerType' | 'slug'>

export function getSpecialDisplayTitle(special: SpecialTitleSource): string {
  if (special.title?.trim()) {
    return special.title.trim()
  }

  if (special.subTitle?.trim()) {
    return special.subTitle.trim()
  }

  if (special.offerType) {
    return getOfferTypeLabel(special.offerType)
  }

  return special.slug ?? 'Special Offer'
}
