import type { OfferType } from '@/lib/specials/constants'

/**
 * Static seed data for specials import.
 * Generated from https://www.eagleford.co.za/specials/ via scripts/generate-specials-data.mjs
 * Catalog links (vehicleSlug / modelSlug) enriched via scripts/enrich-specials-catalog-links.mjs
 */
export type SpecialSeedEntry = {
  specialsCategory: string
  slug: string
  title: string
  subTitle: string
  offerType: OfferType
  pricingLabel?: string
  specialOffer?: number
  bestSaving?: number
  sortOrder: number
  cardImageUrl: string
  detailImageUrl: string
  contentSubheading: string
  bodyHtml: string
  /** Parent vehicle family slug from vehicles seed (omit when not applicable) */
  vehicleSlug?: string
  /** Vehicle model / variant slug (omit when not applicable) */
  modelSlug?: string
}

export const SPECIALS_SEED_DATA: SpecialSeedEntry[] = [
  {
    specialsCategory: 'Truck Month Ranger Double Cab Offers',
    slug: '15849-next-level-ranger-2.0-xl-4x2-dc-manual',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.0 XL 4x2 DC Manual',
    offerType: 'price-point',
    sortOrder: 1,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/15849-next-level-ranger-2.0-xl-4x2-dc-manual/images/15849-1195fd5a-702f-4a6e-8d81-e87b0c87f342c7986659-91a4-4056-8626-8baa73cd57f8_Next-Level-Ranger-2-0-XL-4x2-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/15849-next-level-ranger-2.0-xl-4x2-dc-manual/images/15849-1195fd5a-702f-4a6e-8d81-e87b0c87f342c7986659-91a4-4056-8626-8baa73cd57f8_Next-Level-Ranger-2-0-XL-4x2-DC.webp',
    contentSubheading: 'Special Offer: R1 219 900*',
    bodyHtml:
      '<p><strong>Special Offer: R1 219 900*</strong></p><p><strong>Best Saving: R120 100*</strong></p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    specialOffer: 569000,
    bestSaving: 51100,
    vehicleSlug: 'next-level-ranger',
    modelSlug: '20-sit-double-cab-xl-4x2-6mt',
  },
  {
    specialsCategory: 'Truck Month Ranger Double Cab Offers',
    slug: '15849-next-level-ranger-2.0-xl-4x2-dc-manual',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.0 XL 4x2 DC Manual',
    offerType: 'payment',
    sortOrder: 2,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/15849-next-level-ranger-2.0-xl-4x2-dc-manual/images/15849-1195fd5a-702f-4a6e-8d81-e87b0c87f342c7986659-91a4-4056-8626-8baa73cd57f8_Next-Level-Ranger-2-0-XL-4x2-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/15849-next-level-ranger-2.0-xl-4x2-dc-manual/images/15849-1195fd5a-702f-4a6e-8d81-e87b0c87f342c7986659-91a4-4056-8626-8baa73cd57f8_Next-Level-Ranger-2-0-XL-4x2-DC.webp',
    contentSubheading: 'Special Offer: R1 219 900*',
    bodyHtml:
      '<p><strong>Special Offer: R1 219 900*</strong></p><p><strong>Best Saving: R120 100*</strong></p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    specialOffer: 8399,
    vehicleSlug: 'next-level-ranger',
    modelSlug: '20-sit-double-cab-xl-4x2-6mt',
  },
]
