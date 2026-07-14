import type { OfferType } from '@/lib/specials/constants'

/**
 * Static seed data for specials import.
 * Generated from https://www.eagleford.co.za/specials/ via scripts/generate-specials-data.mjs
 * Catalog links (vehicleSlug / modelSlug) enriched via scripts/enrich-specials-catalog-links.mjs
 */
export type SpecialSeedEntry = {
  slug: string
  title: string
  subTitle: string
  offerType: OfferType
  pricingLabel?: string
  specialOffer?: number
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
    slug: '18394-everest-3.0-v6-platinum-auto',
    title: 'Ford Next Level Everest',
    subTitle: 'Everest 3.0 V6 Platinum Auto',
    offerType: 'price-point',
    sortOrder: 1,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/18394-everest-3.0-v6-platinum-auto/images/18394-fd299fb2-1666-4830-96a0-369f5cdfd6a8472b7a36-17a3-479d-a43f-cd5efe382fe4_3d9deee8-3029-47be-a20c-13411c784077.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/18394-everest-3.0-v6-platinum-auto/images/18394-fd299fb2-1666-4830-96a0-369f5cdfd6a8472b7a36-17a3-479d-a43f-cd5efe382fe4_3d9deee8-3029-47be-a20c-13411c784077.webp',
    contentSubheading: 'Special Offer: R1 219 900*',
    bodyHtml:
      '<p><strong>Special Offer: R1 219 900*</strong></p><p><strong>Best Saving: R120 100*</strong></p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    specialOffer: 1219900,
    vehicleSlug: 'next-level-everest',
    modelSlug: '3.0-v6-platinum-4x4-10at',
  },
  {
    slug: '18393-next-level-ranger-3.0-v6-platinum-4x4-dc-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 3.0 V6 Platinum 4x4 DC Auto',
    offerType: 'price-point',
    sortOrder: 2,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/18393-next-level-ranger-3.0-v6-platinum-4x4-dc-auto/images/18393-9629bc08-335a-4ad8-b6dc-832e597f75a64ea97ad2-4b19-495e-8718-996282063744_download.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/18393-next-level-ranger-3.0-v6-platinum-4x4-dc-auto/images/18393-9629bc08-335a-4ad8-b6dc-832e597f75a64ea97ad2-4b19-495e-8718-996282063744_download.webp',
    contentSubheading: 'Special Offer: R1 064 900*',
    bodyHtml:
      '<p><strong>Special Offer: R1 064 900*</strong></p><p><strong>Best Saving: R114 600*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Power Roller shutter</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    specialOffer: 1064900,
    vehicleSlug: 'next-level-ranger',
    modelSlug: '3.0l-v6-double-cab-platinum-4x4-10at',
  },
  {
    slug: '18388-everest-3.0l-v6-platinum-10at-4x4',
    title: 'Ford Next Level Everest',
    subTitle: 'Everest 3.0L V6 PLATINUM 10AT 4X4',
    offerType: 'payment',
    sortOrder: 3,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/18388-everest-3.0l-v6-platinum-10at-4x4/images/18388-9df2e6d8-c9b1-4598-a36b-aad80ca7070908db4f1b-33d4-4bb8-ba5c-fcf6621ed054_download.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/18388-everest-3.0l-v6-platinum-10at-4x4/images/18388-9df2e6d8-c9b1-4598-a36b-aad80ca7070908db4f1b-33d4-4bb8-ba5c-fcf6621ed054_download.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R17 999 pm</p><p><br></p><p>• Retail Price: R1 340 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 813 929</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R536 000</p><p>• Term: 72 months</p><p>• Contract Rate: 7.85%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R20 199 pm</p><p><br></p><p>• Retail Price: R1 340 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 705 381</p><p>• GFV Percentage: 56.4%</p><p>• GFV Amount: R756 028</p><p>• Term: 48 months</p><p>• Contract Rate: 8.25%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 17999,
    vehicleSlug: 'next-level-everest',
    modelSlug: '3.0-v6-platinum-4x4-10at',
  },
  {
    slug: '18386-everest-3.0l-v6-sport-10at-4x4',
    title: 'Ford Next Level Everest',
    subTitle: 'Everest 3.0L V6 SPORT 10AT 4X4',
    offerType: 'payment',
    sortOrder: 4,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/18386-everest-3.0l-v6-sport-10at-4x4/images/18386-2e484007-1138-49c7-b71a-7b58b35f190fa1e38f50-27b4-4853-a53f-a2c76808dc62_223f3861-1254-4034-9b1e-8f6015e06504.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/18386-everest-3.0l-v6-sport-10at-4x4/images/18386-2e484007-1138-49c7-b71a-7b58b35f190fa1e38f50-27b4-4853-a53f-a2c76808dc62_223f3861-1254-4034-9b1e-8f6015e06504.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R15 699 pm</p><p><br></p><p>• Retail Price: R1 149 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 574 229</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R459 600</p><p>• Term: 72 months</p><p>• Contract Rate: 8.20%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R17 399 pm</p><p><br></p><p>• Retail Price: R1 149 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 463 956</p><p>• GFV Percentage: 56.2%</p><p>• GFV Amount: R646 203</p><p>• Term: 48 months</p><p>• Contract Rate: 8.35%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 15699,
    vehicleSlug: 'next-level-everest',
    modelSlug: '3.0-v6-sport-4x4-10at',
  },
  {
    slug: '18387-everest-3.0l-v6-wildtrak-10at-4x4',
    title: 'Ford Next Level Everest',
    subTitle: 'Everest 3.0L V6 WILDTRAK 10AT 4X4',
    offerType: 'payment',
    sortOrder: 5,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/18387-everest-3.0l-v6-wildtrak-10at-4x4/images/18387-9025dd3b-8354-467c-920f-50ec73528ce392a725d2-c143-4ed1-bef8-de00eda06a54_52e0f5ad-8565-4603-90a8-8ac82774e0ee.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/18387-everest-3.0l-v6-wildtrak-10at-4x4/images/18387-9025dd3b-8354-467c-920f-50ec73528ce392a725d2-c143-4ed1-bef8-de00eda06a54_52e0f5ad-8565-4603-90a8-8ac82774e0ee.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R16 599 pm</p><p><br></p><p>• Retail Price: R1 244 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 676 129</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R497 600</p><p>• Term: 72 months</p><p>• Contract Rate: 7.75%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R18 599 pm</p><p><br></p><p>• Retail Price: R1 244 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 574 981</p><p>• GFV Percentage: 56.3%</p><p>• GFV Amount: R700 828</p><p>• Term: 48 months</p><p>• Contract Rate: 8.10%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 16599,
    vehicleSlug: 'next-level-everest',
    modelSlug: '3.0-v6-wildtrak-4x4-10at',
  },
  {
    slug: '18389-next-level-ranger-2.0-xl-4x4-super-cab-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.0 XL 4x4 Super Cab Auto',
    offerType: 'price-point',
    sortOrder: 6,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/18389-next-level-ranger-2.0-xl-4x4-super-cab-auto/images/18389-74e29c4e-ec0f-4677-b9c6-e2f3fdeff4afcffc8b10-4b0a-4bc4-acf1-4ee4ef80612a_9a8f40d7-44aa-45a9-bb9c-2c45729bc535.png',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/18389-next-level-ranger-2.0-xl-4x4-super-cab-auto/images/18389-74e29c4e-ec0f-4677-b9c6-e2f3fdeff4afcffc8b10-4b0a-4bc4-acf1-4ee4ef80612a_9a8f40d7-44aa-45a9-bb9c-2c45729bc535.png',
    contentSubheading: 'Special Offer: R582 900*',
    bodyHtml:
      '<p><strong>Special Offer: R582 900*</strong></p><p><strong>Best Saving: R67 432*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Tow Hitch</li><li>17" Alloy</li><li>Vinyl Floors</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p><p><br></p><p><br></p>',
    pricingLabel: 'Special Offer',
    specialOffer: 582900,
    vehicleSlug: 'ranger-super-cab',
    modelSlug: 'ranger-2.0-sit-supercab-xl-auto',
  },
  {
    slug: '18390-next-level-ranger-2.3-sport-4x2-super-cab-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.3 Sport 4x2 Super Cab Auto',
    offerType: 'price-point',
    sortOrder: 7,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/18390-next-level-ranger-2.3-sport-4x2-super-cab-auto/images/18390-52c83fb4-1014-4ad7-9406-03641327a0b77d90b5d3-fdc4-4198-9805-8fb38074a52d_download.png',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/18390-next-level-ranger-2.3-sport-4x2-super-cab-auto/images/18390-52c83fb4-1014-4ad7-9406-03641327a0b77d90b5d3-fdc4-4198-9805-8fb38074a52d_download.png',
    contentSubheading: 'Special Offer: R676 900*',
    bodyHtml:
      '<p><strong>Special Offer: R676 900*</strong></p><p><strong>Best Saving: R58 100*</strong></p><p><strong style="background-color: transparent;">Includes Maintenance Plan</strong></p><p><br></p><p>Subject to finance approval through Ford Credit.</p><p><br></p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'ranger-super-cab',
  },
  {
    slug: '18391-next-level-ranger-3.0-v6-sport-4x4-super-cab-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 3.0 V6 Sport 4x4 Super Cab Auto',
    offerType: 'price-point',
    sortOrder: 8,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/18391-next-level-ranger-3.0-v6-sport-4x4-super-cab-auto/images/18391-da7bdc16-442c-4714-b917-a45240cc19185dd6aa0f-1f90-4dcb-8c7e-2472ee55ecae_download.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/18391-next-level-ranger-3.0-v6-sport-4x4-super-cab-auto/images/18391-da7bdc16-442c-4714-b917-a45240cc19185dd6aa0f-1f90-4dcb-8c7e-2472ee55ecae_download.webp',
    contentSubheading: 'Special Offer: R767 900*',
    bodyHtml:
      '<p><strong>Special Offer: R767 900*</strong></p><p><strong>Best Saving: R57 100*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Sport Bar</li><li>Cargo Management</li><li>Trailer Back up assist</li><li>Fuel Tank Accessory Switch</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    specialOffer: 767900,
    vehicleSlug: 'ranger-super-cab',
  },
  {
    slug: '18392-next-level-ranger-3.0-v6-wildtrak-4x4-super-cab-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 3.0 V6 Wildtrak 4x4 Super Cab Auto',
    offerType: 'price-point',
    sortOrder: 9,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/18392-next-level-ranger-3.0-v6-wildtrak-4x4-super-cab-auto/images/18392-7b168679-f5a5-4d76-ad62-919c7184de825bcbf40b-295e-43f6-bfbf-7414990923f1_download.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/18392-next-level-ranger-3.0-v6-wildtrak-4x4-super-cab-auto/images/18392-7b168679-f5a5-4d76-ad62-919c7184de825bcbf40b-295e-43f6-bfbf-7414990923f1_download.webp',
    contentSubheading: 'Special Offer: R784 900*',
    bodyHtml:
      '<p><strong>Special Offer: R784 900*</strong></p><p><strong>Best Saving: R80 100*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Cargo Management</li><li>Under Body Protection</li><li>Pro Trailer</li><li>20 Inch Alloy</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p><p><br></p><p><br></p>',
    pricingLabel: 'Special Offer',
    specialOffer: 784900,
    vehicleSlug: 'ranger-super-cab',
  },
  {
    slug: '18384-everest-2.0l-sit-active-10at-4x2',
    title: 'Ford Next Level Everest',
    subTitle: 'Everest 2.0L SiT ACTIVE 10AT 4X2',
    offerType: 'payment',
    sortOrder: 10,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/18384-everest-2.0l-sit-active-10at-4x2/images/18384-10ed4d51-7b63-4333-b6c8-fe4009ed82816281b866-f7af-43d4-8ec2-3520a48fc588_download.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/18384-everest-2.0l-sit-active-10at-4x2/images/18384-10ed4d51-7b63-4333-b6c8-fe4009ed82816281b866-f7af-43d4-8ec2-3520a48fc588_download.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R11 199 pm</p><p><br></p><p>• Retail Price: R825 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 125 129</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R330 000</p><p>• Term: 72 months</p><p>• Contract Rate: 7.90%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R12 599 pm</p><p><br></p><p>• Retail Price: R825 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 052 056</p><p>• GFV Percentage: 55.7%</p><p>• GFV Amount: R459 903</p><p>• Term: 48 months</p><p>• Contract Rate: 8.30%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 11199,
    vehicleSlug: 'next-level-everest',
    modelSlug: '2.0-sit-active-4x2-10at',
  },
  {
    slug: '18385-everest-2.0l-sit-active-10at-4x4',
    title: 'Ford Next Level Everest',
    subTitle: 'Everest 2.0L SiT ACTIVE 10AT 4X4',
    offerType: 'payment',
    sortOrder: 11,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/18385-everest-2.0l-sit-active-10at-4x4/images/18385-bc48f800-d7e3-4f46-9115-59b163f1761e58ef278a-5f34-4611-bc34-cd24fcee8bf4_847a2cfe-9c1f-4b98-95c5-955281fe9262.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/18385-everest-2.0l-sit-active-10at-4x4/images/18385-bc48f800-d7e3-4f46-9115-59b163f1761e58ef278a-5f34-4611-bc34-cd24fcee8bf4_847a2cfe-9c1f-4b98-95c5-955281fe9262.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R11 899 pm</p><p><br></p><p>• Retail Price: R875 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 194 829</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R350 000</p><p>• Term: 72 months</p><p>• Contract Rate: 8.10%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R13 499 pm</p><p><br></p><p>• Retail Price: R875 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 123 106</p><p>• GFV Percentage: 55.8%</p><p>• GFV Amount: R488 653</p><p>• Term: 48 months</p><p>• Contract Rate: 8.60%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 11899,
    vehicleSlug: 'next-level-everest',
    modelSlug: '2.0-sit-active-4x4-10at',
  },
  {
    slug: '17908-ranger-3.0l-v6-ecoboost-raptor-4wd-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER 3.0L V6 ECOBOOST RAPTOR 4WD 10AT',
    offerType: 'payment',
    sortOrder: 12,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17908-ranger-3.0l-v6-ecoboost-raptor-4wd-10at/images/17908-6267a5f1-d1e3-429f-bf64-dea781c093dc830b8391-0bb2-4e2e-84ee-7c8b00922fb5_26MY_IMG_JB_P703_RANRAP_RPTR_DOUBLECAB_ARCWHI_ANGLE21_RHD_4X4.png',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17908-ranger-3.0l-v6-ecoboost-raptor-4wd-10at/images/17908-6267a5f1-d1e3-429f-bf64-dea781c093dc830b8391-0bb2-4e2e-84ee-7c8b00922fb5_26MY_IMG_JB_P703_RANRAP_RPTR_DOUBLECAB_ARCWHI_ANGLE21_RHD_4X4.png',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R19 399 pm</p><p><br></p><p>• Retail Price: R1 307 300</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 900 249</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R522 920</p><p>• Term: 72 months</p><p>• Contract Rate: 10.00%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R21 999 pm</p><p><br></p><p>• Retail Price: R1 307 300</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 784 000</p><p>• GFV Percentage: 57.4%</p><p>• GFV Amount: R750 047</p><p>• Term: 48 months</p><p>• Contract Rate: 11.05%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'From',
    specialOffer: 19399,
    vehicleSlug: 'next-level-ranger',
    modelSlug: '3.0l-v6-tt-double-cab-raptor-4x4-10at',
  },
  {
    slug: '17907-ranger-dc-4wd-3.0l-v6-platinum-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER DC 4WD 3.0L V6 PLATINUM 10AT',
    offerType: 'payment',
    sortOrder: 13,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17907-ranger-dc-4wd-3.0l-v6-platinum-10at/images/17907-51d9fe60-a1cb-47fe-81e2-a66ea44d3f6f18072a38-2ce2-4021-a077-35512f4b1bc3_Ranger-Platinum.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17907-ranger-dc-4wd-3.0l-v6-platinum-10at/images/17907-51d9fe60-a1cb-47fe-81e2-a66ea44d3f6f18072a38-2ce2-4021-a077-35512f4b1bc3_Ranger-Platinum.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R15 499 pm</p><p><br></p><p>• Retail Price: R1 187 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 575 229</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R474 800</p><p>• Term: 72 months</p><p>• Contract Rate: 7.30%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R16 799 pm</p><p><br></p><p>• Retail Price: R1 187 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 469 225</p><p>• GFV Percentage: 57.3%</p><p>• GFV Amount: R679 672</p><p>• Term: 48 months</p><p>• Contract Rate: 7.20%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'From',
    specialOffer: 15499,
    vehicleSlug: 'next-level-ranger',
    modelSlug: '3.0l-v6-double-cab-platinum-4x4-10at',
  },
  {
    slug: '17904-ranger-dc-4wd-3.0l-v6-sport-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER DC 4WD 3.0L V6 SPORT 10AT',
    offerType: 'payment',
    sortOrder: 14,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17904-ranger-dc-4wd-3.0l-v6-sport-10at/images/17904-e9e228b7-c0d2-449c-9048-09d8218fba0d27f2fc2b-aa72-4827-acd0-b86054e2a0c9_Sport-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17904-ranger-dc-4wd-3.0l-v6-sport-10at/images/17904-e9e228b7-c0d2-449c-9048-09d8218fba0d27f2fc2b-aa72-4827-acd0-b86054e2a0c9_Sport-DC.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R13 099 pm</p><p><br></p><p>• Retail Price: R1 001 300</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 330 549</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R400 520</p><p>• Term: 72 months</p><p>• Contract Rate: 7.30%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R14 499 pm</p><p><br></p><p>• Retail Price: R1 001 300</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 252 490</p><p>• GFV Percentage: 57.0%</p><p>• GFV Amount: R571 037</p><p>• Term: 48 months</p><p>• Contract Rate: 7.55%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'From',
    specialOffer: 13099,
    vehicleSlug: 'next-level-ranger',
    modelSlug: '3.0l-v6-double-cab-tremor-4x4-10at',
  },
  {
    slug: '17905-ranger-dc-4wd-3.0l-v6-tremor-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER DC 4WD 3.0L V6 TREMOR 10AT',
    offerType: 'payment',
    sortOrder: 15,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17905-ranger-dc-4wd-3.0l-v6-tremor-10at/images/17905-a9ba8196-1847-418b-86c8-6e5ba14099df43bf0576-6d3b-4418-bcd1-5f84a501567f_Tremor.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17905-ranger-dc-4wd-3.0l-v6-tremor-10at/images/17905-a9ba8196-1847-418b-86c8-6e5ba14099df43bf0576-6d3b-4418-bcd1-5f84a501567f_Tremor.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R13 999 pm</p><p><br></p><p>• Retail Price: R1 045 600</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 412 169</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R418 240</p><p>• Term: 72 months</p><p>• Contract Rate: 7.75%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R15 399 pm</p><p><br></p><p>• Retail Price: R1 045 600</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 320 706</p><p>• GFV Percentage: 57.1%</p><p>• GFV Amount: R596 953</p><p>• Term: 48 months</p><p>• Contract Rate: 7.95%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'From',
    specialOffer: 13999,
    vehicleSlug: 'next-level-ranger',
    modelSlug: '3.0l-v6-double-cab-tremor-4x4-10at',
  },
  {
    slug: '17906-ranger-dc-4wd-3.0l-v6-wildtrak-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER DC 4WD 3.0L V6 WILDTRAK 10AT',
    offerType: 'payment',
    sortOrder: 16,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17906-ranger-dc-4wd-3.0l-v6-wildtrak-10at/images/17906-b7ddae63-bb40-4554-86f5-36af9b33bd9c66bebfee-ec68-40ad-9848-5acd1b9cde07_Wildtrack-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17906-ranger-dc-4wd-3.0l-v6-wildtrak-10at/images/17906-b7ddae63-bb40-4554-86f5-36af9b33bd9c66bebfee-ec68-40ad-9848-5acd1b9cde07_Wildtrack-DC.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R13 899 pm</p><p><br></p><p>• Retail Price: R1 076 800</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 417 549</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R430 720</p><p>• Term: 72 months</p><p>• Contract Rate: 7.05%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R14 899 pm</p><p><br></p><p>• Retail Price: R1 076 800</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 315 458</p><p>• GFV Percentage: 57.1%</p><p>• GFV Amount: R615 205</p><p>• Term: 48 months</p><p>• Contract Rate: 6.70%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'From',
    specialOffer: 13899,
    vehicleSlug: 'next-level-ranger',
    modelSlug: '3.0l-v6-double-cab-wildtrak-4x4-10at',
  },
  {
    slug: '17897-ranger-dc-4x2-2.0l-sit-xl-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER DC 4X2 2.0L SIT XL 10AT',
    offerType: 'payment',
    sortOrder: 17,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17897-ranger-dc-4x2-2.0l-sit-xl-10at/images/17897-a5df5995-b01b-42d1-979c-aa569e131d061e9ef5ee-9d0c-4d90-8844-0022a15dce71_Ranger-Double-Cab-XL.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17897-ranger-dc-4x2-2.0l-sit-xl-10at/images/17897-a5df5995-b01b-42d1-979c-aa569e131d061e9ef5ee-9d0c-4d90-8844-0022a15dce71_Ranger-Double-Cab-XL.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R8 099 pm</p><p><br></p><p>• Retail Price: R655 600</p><p>• Deposit: 0%</p><p>• Total Repayment: R837 269</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R262 240</p><p>• Term: 72 months</p><p>• Contract Rate: 5.90%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R9 899 pm</p><p><br></p><p>• Retail Price: R655 600</p><p>• Deposit: 0%</p><p>• Total Repayment: R837 208</p><p>• GFV Percentage: 56.7%</p><p>• GFV Amount: R371 955</p><p>• Term: 48 months</p><p>• Contract Rate: 8.15%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 8099,
    vehicleSlug: 'next-level-ranger',
    modelSlug: '2.0-sit-double-cab-xl-4x2-6mt',
  },
  {
    slug: '17896-ranger-dc-4x2-2.0l-sit-xl-6mt',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER DC 4X2 2.0L SIT XL 6MT',
    offerType: 'payment',
    sortOrder: 18,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17896-ranger-dc-4x2-2.0l-sit-xl-6mt/images/17896-3106717d-b086-4521-9d32-bc94e8ccbe7d64b80faf-9990-4689-8402-9354e22b19da_Ranger-Double-Cab-XL.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17896-ranger-dc-4x2-2.0l-sit-xl-6mt/images/17896-3106717d-b086-4521-9d32-bc94e8ccbe7d64b80faf-9990-4689-8402-9354e22b19da_Ranger-Double-Cab-XL.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R8 399 pm</p><p><br></p><p>• Retail Price: R624 900</p><p>• Deposit: 0%</p><p>• Total Repayment: R846 289</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R249 960</p><p>• Term: 72 months</p><p>• Contract Rate: 7.70%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R9 599 pm</p><p><br></p><p>• Retail Price: R624 900</p><p>• Deposit: 0%</p><p>• Total Repayment: R804 995</p><p>• GFV Percentage: 56.6%</p><p>• GFV Amount: R353 842</p><p>• Term: 48 months</p><p>• Contract Rate: 8.55%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 8399,
    vehicleSlug: 'next-level-ranger',
    modelSlug: '2.0-sit-double-cab-xl-4x2-6mt',
  },
  {
    slug: '17900-ranger-dc-4x2-2.0l-sit-xlt-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER DC 4X2 2.0L SIT XLT 10AT',
    offerType: 'payment',
    sortOrder: 19,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17900-ranger-dc-4x2-2.0l-sit-xlt-10at/images/17900-3faf86a6-db21-404d-aa4e-c81d30da24414aeca424-48b1-4a7a-88f9-fd8fd2aaf1f7_XLT-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17900-ranger-dc-4x2-2.0l-sit-xlt-10at/images/17900-3faf86a6-db21-404d-aa4e-c81d30da24414aeca424-48b1-4a7a-88f9-fd8fd2aaf1f7_XLT-DC.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R8 599 pm</p><p><br></p><p>• Retail Price: R703 900</p><p>• Deposit: 0%</p><p>• Total Repayment: R892 089</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R281 560</p><p>• Term: 72 months</p><p>• Contract Rate: 5.70%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R9 199 pm</p><p><br></p><p>• Retail Price: R703 900</p><p>• Deposit: 0%</p><p>• Total Repayment: R832 805</p><p>• GFV Percentage: 56.9%</p><p>• GFV Amount: R400 452</p><p>• Term: 48 months</p><p>• Contract Rate: 5.40%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'From',
    specialOffer: 8599,
    vehicleSlug: 'next-level-ranger',
    modelSlug: '2.0-sit-double-cab-xlt-4x2-10at',
  },
  {
    slug: '17902-ranger-dc-4x2-2.3l-tc-sport-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER DC 4X2 2.3L TC SPORT 10AT',
    offerType: 'payment',
    sortOrder: 20,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17902-ranger-dc-4x2-2.3l-tc-sport-10at/images/17902-2e2e384b-31ec-46d0-98b6-4660e2fa8eed52053b59-0c4d-4250-abe0-7a14056e15f7_Sport-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17902-ranger-dc-4x2-2.3l-tc-sport-10at/images/17902-2e2e384b-31ec-46d0-98b6-4660e2fa8eed52053b59-0c4d-4250-abe0-7a14056e15f7_Sport-DC.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R10 899 pm</p><p><br></p><p>• Retail Price: R844 900</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 111 789</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R337 960</p><p>• Term: 72 months</p><p>• Contract Rate: 6.85%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R11 499 pm</p><p><br></p><p>• Retail Price: R844 900</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 024 095</p><p>• GFV Percentage: 57.2%</p><p>• GFV Amount: R483 642</p><p>• Term: 48 months</p><p>• Contract Rate: 6.30%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'From',
    specialOffer: 10899,
    vehicleSlug: 'next-level-ranger',
    modelSlug: '2.3l-double-cab-sport-4x2-10at',
  },
  {
    slug: '17903-ranger-dc-4x2-2.3l-tc-wildtrak-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER DC 4X2 2.3L TC WILDTRAK 10AT',
    offerType: 'payment',
    sortOrder: 21,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17903-ranger-dc-4x2-2.3l-tc-wildtrak-10at/images/17903-2e417ec7-e981-4a71-b43a-e1b1aa6c6fd0557a237a-bc15-4275-bf6e-ff49a7411412_Sport-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17903-ranger-dc-4x2-2.3l-tc-wildtrak-10at/images/17903-2e417ec7-e981-4a71-b43a-e1b1aa6c6fd0557a237a-bc15-4275-bf6e-ff49a7411412_Sport-DC.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R11 699 pm</p><p><br></p><p>• Retail Price: R904 700</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 192 509</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R361 880</p><p>• Term: 72 months</p><p>• Contract Rate: 6.95%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R12 399 pm</p><p><br></p><p>• Retail Price: R904 700</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 101 677</p><p>• GFV Percentage: 57.4%</p><p>• GFV Amount: R518 924</p><p>• Term: 48 months</p><p>• Contract Rate: 6.45%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'From',
    specialOffer: 11699,
    vehicleSlug: 'next-level-ranger',
    modelSlug: '2.3l-double-cab-wildtrak-4x2-10at',
  },
  {
    slug: '17899-ranger-dc-4x4-2.0l-sit-xl-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER DC 4X4 2.0L SIT XL 10AT',
    offerType: 'payment',
    sortOrder: 22,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17899-ranger-dc-4x4-2.0l-sit-xl-10at/images/17899-ebbe4107-48fd-4cc2-a085-3e3b8c166c38b8a1238c-93a9-47dc-8a4d-859066045f7e_Ranger-Double-Cab-XL.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17899-ranger-dc-4x4-2.0l-sit-xl-10at/images/17899-ebbe4107-48fd-4cc2-a085-3e3b8c166c38b8a1238c-93a9-47dc-8a4d-859066045f7e_Ranger-Double-Cab-XL.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R9 899 pm</p><p><br></p><p>• Retail Price: R739 600</p><p>• Deposit: 0%</p><p>• Total Repayment: R998 669</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R295 840</p><p>• Term: 72 months</p><p>• Contract Rate: 7.55%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R11 299 pm</p><p><br></p><p>• Retail Price: R739 600</p><p>• Deposit: 0%</p><p>• Total Repayment: R952 568</p><p>• GFV Percentage: 57.0%</p><p>• GFV Amount: R421 515</p><p>• Term: 48 months</p><p>• Contract Rate: 8.55%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 9899,
    vehicleSlug: 'next-level-ranger',
  },
  {
    slug: '17898-ranger-dc-4x4-2.0l-sit-xl-6mt',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER DC 4X4 2.0L SIT XL 6MT',
    offerType: 'payment',
    sortOrder: 23,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17898-ranger-dc-4x4-2.0l-sit-xl-6mt/images/17898-c1f91866-7f0b-4fae-9fc3-51f82a8ba0240722f871-245f-4af6-ba26-9674678c3047_Ranger-Double-Cab-XL.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17898-ranger-dc-4x4-2.0l-sit-xl-6mt/images/17898-c1f91866-7f0b-4fae-9fc3-51f82a8ba0240722f871-245f-4af6-ba26-9674678c3047_Ranger-Double-Cab-XL.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R9 399 pm</p><p><br></p><p>• Retail Price: R708 400</p><p>• Deposit: 0%</p><p>• Total Repayment: R950 689</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R283 360</p><p>• Term: 72 months</p><p>• Contract Rate: 7.55%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R10 799 pm</p><p><br></p><p>• Retail Price: R708 400</p><p>• Deposit: 0%</p><p>• Total Repayment: R910 660</p><p>• GFV Percentage: 56.9%</p><p>• GFV Amount: R403 107</p><p>• Term: 48 months</p><p>• Contract Rate: 8.55%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 9399,
    vehicleSlug: 'next-level-ranger',
    modelSlug: '2.0-sit-double-cab-xl-4x2-6mt',
  },
  {
    slug: '17901-ranger-dc-4x4-2.0l-sit-xlt-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER DC 4X4 2.0L SIT XLT 10AT',
    offerType: 'payment',
    sortOrder: 24,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17901-ranger-dc-4x4-2.0l-sit-xlt-10at/images/17901-837142d5-ae97-468e-80d8-5e1c3e28e26ff4fa9719-2083-4a2d-a26d-487f271aa6ab_XLT-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17901-ranger-dc-4x4-2.0l-sit-xlt-10at/images/17901-837142d5-ae97-468e-80d8-5e1c3e28e26ff4fa9719-2083-4a2d-a26d-487f271aa6ab_XLT-DC.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R10 199 pm</p><p><br></p><p>• Retail Price: R793 500</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 041 529</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R317 400</p><p>• Term: 72 months</p><p>• Contract Rate: 6.90%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R11 199 pm</p><p><br></p><p>• Retail Price: R793 500</p><p>• Deposit: 0%</p><p>• Total Repayment: R979 669</p><p>• GFV Percentage: 57.1%</p><p>• GFV Amount: R453 316</p><p>• Term: 48 months</p><p>• Contract Rate: 7.05%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'From',
    specialOffer: 10199,
    vehicleSlug: 'next-level-ranger',
    modelSlug: '2.0-sit-double-cab-xlt-4x2-10at',
  },
  {
    slug: '17888-ranger-sc-4x4-2.0l-sit-xl-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER SC 4X4 2.0L SIT XL 10AT',
    offerType: 'payment',
    sortOrder: 25,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17888-ranger-sc-4x4-2.0l-sit-xl-10at/images/17888-1993e9ed-e9ec-4623-8590-cf5dd13e93f23be9dece-fd5c-443b-98df-67f4796fb9ee_Ranger-Single-Cab.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17888-ranger-sc-4x4-2.0l-sit-xl-10at/images/17888-1993e9ed-e9ec-4623-8590-cf5dd13e93f23be9dece-fd5c-443b-98df-67f4796fb9ee_Ranger-Single-Cab.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R8 899 pm</p><p><br></p><p>• Retail Price: R670 200</p><p>• Deposit: 0%</p><p>• Total Repayment: R899 909</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R268 080</p><p>• Term: 72 months</p><p>• Contract Rate: 7.50%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R10 299 pm</p><p><br></p><p>• Retail Price: R670 200</p><p>• Deposit: 0%</p><p>• Total Repayment: R861 397</p><p>• GFV Percentage: 56.3%</p><p>• GFV Amount: R377 344</p><p>• Term: 48 months</p><p>• Contract Rate: 8.50%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'From',
    specialOffer: 8899,
    vehicleSlug: 'ranger-single-cab',
    modelSlug: 'ranger-2.0-sit-supercab-xl-4x4',
  },
  {
    slug: '17894-ranger-sup-4wd-3.0l-v6-sport-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER SUP 4WD 3.0L V6 SPORT 10AT',
    offerType: 'payment',
    sortOrder: 26,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17894-ranger-sup-4wd-3.0l-v6-sport-10at/images/17894-66e4bd61-b520-4ebc-8deb-b9792eb87cf06ff690ab-58fa-4679-8dcc-26d406ccd234_Wildtrak-Sup-Cab.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17894-ranger-sup-4wd-3.0l-v6-sport-10at/images/17894-66e4bd61-b520-4ebc-8deb-b9792eb87cf06ff690ab-58fa-4679-8dcc-26d406ccd234_Wildtrak-Sup-Cab.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R11 199 pm</p><p><br></p><p>• Retail Price: R830 200</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 127 209</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R332 080</p><p>• Term: 72 months</p><p>• Contract Rate: 7.80%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R12 399 pm</p><p><br></p><p>• Retail Price: R830 200</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 053 697</p><p>• GFV Percentage: 56.7%</p><p>• GFV Amount: R470 944</p><p>• Term: 48 months</p><p>• Contract Rate: 8.05%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'From',
    specialOffer: 11199,
    vehicleSlug: 'ranger-super-cab',
  },
  {
    slug: '17895-ranger-sup-4wd-3.0l-v6-wildtrak-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER SUP 4WD 3.0L V6 WILDTRAK 10AT',
    offerType: 'payment',
    sortOrder: 27,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17895-ranger-sup-4wd-3.0l-v6-wildtrak-10at/images/17895-15f4d3a6-3afe-4731-9594-ffca7253ac5a0fb70223-5b3e-4f9d-a3c3-96b9267853d8_Wildtrak-Sup-Cab.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17895-ranger-sup-4wd-3.0l-v6-wildtrak-10at/images/17895-15f4d3a6-3afe-4731-9594-ffca7253ac5a0fb70223-5b3e-4f9d-a3c3-96b9267853d8_Wildtrak-Sup-Cab.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R11 299 pm</p><p><br></p><p>• Retail Price: R870 500</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 150 429</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R348 200</p><p>• Term: 72 months</p><p>• Contract Rate: 7.05%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R12 199 pm</p><p><br></p><p>• Retail Price: R870 500</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 067 872</p><p>• GFV Percentage: 56.8%</p><p>• GFV Amount: R494 519</p><p>• Term: 48 months</p><p>• Contract Rate: 6.80%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 11299,
    vehicleSlug: 'ranger-super-cab',
  },
  {
    slug: '17889-ranger-sup-4x2-2.0l-sit-xl-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER SUP 4X2 2.0L SIT XL 10AT',
    offerType: 'payment',
    sortOrder: 28,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17889-ranger-sup-4x2-2.0l-sit-xl-10at/images/17889-7b828e52-0ea9-48df-83de-b70f9fedd11cd78fc82b-d203-45bd-a868-17ab25727a51_Ranger-Super-Cab-XL.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17889-ranger-sup-4x2-2.0l-sit-xl-10at/images/17889-7b828e52-0ea9-48df-83de-b70f9fedd11cd78fc82b-d203-45bd-a868-17ab25727a51_Ranger-Super-Cab-XL.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R7 699 pm</p><p><br></p><p>• Retail Price: R603 200</p><p>• Deposit: 0%</p><p>• Total Repayment: R787 909</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R241 280</p><p>• Term: 72 months</p><p>• Contract Rate: 6.70%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R9 299 pm</p><p><br></p><p>• Retail Price: R603 200</p><p>• Deposit: 0%</p><p>• Total Repayment: R775 202</p><p>• GFV Percentage: 56.1%</p><p>• GFV Amount: R338 149</p><p>• Term: 48 months</p><p>• Contract Rate: 8.50%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'From',
    specialOffer: 7699,
    vehicleSlug: 'ranger-super-cab',
    modelSlug: 'ranger-2.0-sit-supercab-xl-auto',
  },
  {
    slug: '17891-ranger-sup-4x2-2.0l-sit-xlt-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER SUP 4X2 2.0L SIT XLT 10AT',
    offerType: 'payment',
    sortOrder: 29,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17891-ranger-sup-4x2-2.0l-sit-xlt-10at/images/17891-99379bad-7139-4528-92cf-c9bd0ffd526a7e16dbff-1113-403a-8ea2-830d21ea253b_XLT-SUP-CAB.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17891-ranger-sup-4x2-2.0l-sit-xlt-10at/images/17891-99379bad-7139-4528-92cf-c9bd0ffd526a7e16dbff-1113-403a-8ea2-830d21ea253b_XLT-SUP-CAB.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R8 099 pm</p><p><br></p><p>• Retail Price: R659 100</p><p>• Deposit: 0%</p><p>• Total Repayment: R838 669</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R263 640</p><p>• Term: 72 months</p><p>• Contract Rate: 5.90%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R9 999 pm</p><p><br></p><p>• Retail Price: R659 100</p><p>• Deposit: 0%</p><p>• Total Repayment: R840 803</p><p>• GFV Percentage: 56.3%</p><p>• GFV Amount: R370 850</p><p>• Term: 48 months</p><p>• Contract Rate: 8.15%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 8099,
    vehicleSlug: 'ranger-super-cab',
  },
  {
    slug: '17893-ranger-sup-4x2-2.3l-tc-sport-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER SUP 4X2 2.3L TC SPORT 10AT',
    offerType: 'payment',
    sortOrder: 30,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17893-ranger-sup-4x2-2.3l-tc-sport-10at/images/17893-149378ba-27aa-453f-a8f9-403ffc384f766169870d-a9a9-4fc5-a3c5-2f718cbc333c_Sport-Sup-Cab.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17893-ranger-sup-4x2-2.3l-tc-sport-10at/images/17893-149378ba-27aa-453f-a8f9-403ffc384f766169870d-a9a9-4fc5-a3c5-2f718cbc333c_Sport-Sup-Cab.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R9 899 pm</p><p><br></p><p>• Retail Price: R739 600</p><p>• Deposit: 0%</p><p>• Total Repayment: R998 669</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R295 840</p><p>• Term: 72 months</p><p>• Contract Rate: 7.75%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R11 099 pm</p><p><br></p><p>• Retail Price: R739 600</p><p>• Deposit: 0%</p><p>• Total Repayment: R939 596</p><p>• GFV Percentage: 56.5%</p><p>• GFV Amount: R417 943</p><p>• Term: 48 months</p><p>• Contract Rate: 8.00%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 9899,
    vehicleSlug: 'ranger-super-cab',
  },
  {
    slug: '17890-ranger-sup-4x4-2.0l-sit-xl-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER SUP 4X4 2.0L SIT XL 10AT',
    offerType: 'payment',
    sortOrder: 31,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17890-ranger-sup-4x4-2.0l-sit-xl-10at/images/17890-c4959e33-62a0-4bb1-a56c-61a06f4cd356e98c7a0e-af6c-4589-a7cb-718d677aade0_Ranger-Super-Cab-XL.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17890-ranger-sup-4x4-2.0l-sit-xl-10at/images/17890-c4959e33-62a0-4bb1-a56c-61a06f4cd356e98c7a0e-af6c-4589-a7cb-718d677aade0_Ranger-Super-Cab-XL.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R8 799 pm</p><p><br></p><p>• Retail Price: R679 700</p><p>• Deposit: 0%</p><p>• Total Repayment: R896 609</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R271 880</p><p>• Term: 72 months</p><p>• Contract Rate: 6.85%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R10 399 pm</p><p><br></p><p>• Retail Price: R679 700</p><p>• Deposit: 0%</p><p>• Total Repayment: R871 654</p><p>• GFV Percentage: 56.3%</p><p>• GFV Amount: R382 901</p><p>• Term: 48 months</p><p>• Contract Rate: 8.50%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 8799,
    vehicleSlug: 'ranger-super-cab',
    modelSlug: 'ranger-2.0-sit-supercab-xl-auto',
  },
  {
    slug: '17892-ranger-sup-4x4-2.0l-sit-xlt-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER SUP 4X4 2.0L SIT XLT 10AT',
    offerType: 'payment',
    sortOrder: 32,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17892-ranger-sup-4x4-2.0l-sit-xlt-10at/images/17892-d72b2fbe-1ceb-47e9-b2a0-026798697cc3e4667126-4748-4555-b007-d5e1f0b7a601_XLT-SUP-CAB.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17892-ranger-sup-4x4-2.0l-sit-xlt-10at/images/17892-d72b2fbe-1ceb-47e9-b2a0-026798697cc3e4667126-4748-4555-b007-d5e1f0b7a601_XLT-SUP-CAB.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R9 899 pm</p><p><br></p><p>• Retail Price: R735 600</p><p>• Deposit: 0%</p><p>• Total Repayment: R997 069</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R294 240</p><p>• Term: 72 months</p><p>• Contract Rate: 7.75%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R11 299 pm</p><p><br></p><p>• Retail Price: R735 600</p><p>• Deposit: 0%</p><p>• Total Repayment: R946 656</p><p>• GFV Percentage: 56.5%</p><p>• GFV Amount: R415 603</p><p>• Term: 48 months</p><p>• Contract Rate: 8.50%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 9899,
    vehicleSlug: 'ranger-super-cab',
  },
  {
    slug: '17882-everest-2.0-sit-active-4x2-auto',
    title: 'Ford Next Level Everest',
    subTitle: 'Everest 2.0 SiT Active 4x2 Auto',
    offerType: 'price-point',
    sortOrder: 33,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17882-everest-2.0-sit-active-4x2-auto/images/17882-8c8a1317-7952-4e0d-b9dd-b21890559a970f0da576-eac2-4592-af21-689a87c901a3_active-snow-flake-white-01.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17882-everest-2.0-sit-active-4x2-auto/images/17882-8c8a1317-7952-4e0d-b9dd-b21890559a970f0da576-eac2-4592-af21-689a87c901a3_active-snow-flake-white-01.webp',
    contentSubheading: 'Special Offer: R779 900*',
    bodyHtml:
      '<p><strong>Special Offer: R779 900*</strong></p><p><strong>Best Saving: R45 100*</strong></p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p><p><br></p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'next-level-everest',
    modelSlug: '2.0-sit-active-4x2-10at',
  },
  {
    slug: '17883-everest-2.0-sit-active-4x4-auto',
    title: 'Ford Next Level Everest',
    subTitle: 'Everest 2.0 SiT Active 4x4 Auto',
    offerType: 'price-point',
    sortOrder: 34,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17883-everest-2.0-sit-active-4x4-auto/images/17883-06b6735c-b570-4ebf-9314-8787c9f9dc8475ddc090-d794-4f47-9521-7f8a06d7c755_active-arctic-white-01.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17883-everest-2.0-sit-active-4x4-auto/images/17883-06b6735c-b570-4ebf-9314-8787c9f9dc8475ddc090-d794-4f47-9521-7f8a06d7c755_active-arctic-white-01.webp',
    contentSubheading: 'Special Offer: R834 900*',
    bodyHtml:
      '<p><strong>Special Offer: R834 900*</strong></p><p><strong>Best Saving: R40 100*</strong></p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'next-level-everest',
    modelSlug: '2.0-sit-active-4x4-10at',
  },
  {
    slug: '17884-everest-3.0-v6-4x4-sport-auto',
    title: 'Ford Next Level Everest',
    subTitle: 'Everest 3.0 V6 4x4 Sport Auto',
    offerType: 'price-point',
    sortOrder: 35,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17884-everest-3.0-v6-4x4-sport-auto/images/17884-06a59112-428f-49a4-b63d-52bc89e1a59bf58ea2dc-e841-4d7a-a397-eb7b7531803b_active-aluminium-01.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17884-everest-3.0-v6-4x4-sport-auto/images/17884-06a59112-428f-49a4-b63d-52bc89e1a59bf58ea2dc-e841-4d7a-a397-eb7b7531803b_active-aluminium-01.webp',
    contentSubheading: 'Special Offer: R1 059 900*',
    bodyHtml:
      '<p><strong>Special Offer: R1 059 900*</strong></p><p><strong>Best Saving: R89 100*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Aluminium Metallic</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'next-level-everest',
    modelSlug: '3.0-v6-sport-4x4-10at',
  },
  {
    slug: '17885-everest-3.0-v6-wildtrak-4x4-dc-auto',
    title: 'Ford Next Level Everest',
    subTitle: 'Everest 3.0 V6 Wildtrak 4x4 DC Auto',
    offerType: 'price-point',
    sortOrder: 36,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17885-everest-3.0-v6-wildtrak-4x4-dc-auto/images/17885-7364ec31-0167-472f-be70-ca639f93b08aa608ddcd-4305-40c7-b838-a6a3dac395af_active-aluminium-01--1-.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17885-everest-3.0-v6-wildtrak-4x4-dc-auto/images/17885-7364ec31-0167-472f-be70-ca639f93b08aa608ddcd-4305-40c7-b838-a6a3dac395af_active-aluminium-01--1-.webp',
    contentSubheading: 'Special Offer: R1 129 900*',
    bodyHtml:
      '<p><strong>Special Offer: R1 129 900*</strong></p><p><strong>Best Saving: R114 100*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Meteor Grey / Aluminium Metallic</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'next-level-everest',
    modelSlug: '3.0-v6-wildtrak-4x4-10at',
  },
  {
    slug: '17875-new-level-territory-1.8-titanium-auto',
    title: 'Ford TERRITORY NEXT LEVEL',
    subTitle: 'New Level Territory 1.8 Titanium Auto',
    offerType: 'payment',
    sortOrder: 37,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17875-new-level-territory-1.8-titanium-auto/images/17875-5d3926ef-f8fa-4286-978c-fbcd0cf79061f295218b-3115-43ab-bf4a-0e768cff958e_download.png',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17875-new-level-territory-1.8-titanium-auto/images/17875-5d3926ef-f8fa-4286-978c-fbcd0cf79061f295218b-3115-43ab-bf4a-0e768cff958e_download.png',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R8 699 pm</p><p><br></p><p>• Retail Price: R643 900</p><p>• Deposit: 0%</p><p>• Total Repayment: R875 189</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R257 560</p><p>• Term: 72 months</p><p>• Contract Rate: 7.85%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R9 399 pm</p><p><br></p><p>• Retail Price: R643 900</p><p>• Deposit: 0%</p><p>• Total Repayment: R790 651</p><p>• GFV Percentage: 54.2%</p><p>• GFV Amount: R348 898</p><p>• Term: 48 months</p><p>• Contract Rate: 6.75%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'From',
    specialOffer: 8699,
    vehicleSlug: 'new-level-territory',
  },
  {
    slug: '17886-ranger-sc-4x2-2.0l-sit-xl-10at',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER SC 4X2 2.0L SIT XL 10AT',
    offerType: 'payment',
    sortOrder: 38,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17886-ranger-sc-4x2-2.0l-sit-xl-10at/images/17886-beaef745-9cbf-49f9-90b9-ba4df68c528bb0a5835c-1be7-4cde-a906-ae76e1a3fed8_Ranger-Single-Cab.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17886-ranger-sc-4x2-2.0l-sit-xl-10at/images/17886-beaef745-9cbf-49f9-90b9-ba4df68c528bb0a5835c-1be7-4cde-a906-ae76e1a3fed8_Ranger-Single-Cab.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R7 799 pm</p><p><br></p><p>• Retail Price: R593 700</p><p>• Deposit: 0%</p><p>• Total Repayment: R791 209</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R237 480</p><p>• Term: 72 months</p><p>• Contract Rate: 7.15%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R9 199 pm</p><p><br></p><p>• Retail Price: R593 700</p><p>• Deposit: 0%</p><p>• Total Repayment: R764 944</p><p>• GFV Percentage: 56.0%</p><p>• GFV Amount: R332 591</p><p>• Term: 48 months</p><p>• Contract Rate: 8.50%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 7799,
    vehicleSlug: 'ranger-single-cab',
    modelSlug: 'ranger-2.0-sit-single-cab-xl-4x2-auto',
  },
  {
    slug: '17887-ranger-sc-4x4-2.0l-sit-xl-6mt',
    title: 'Ford Next Level Ranger',
    subTitle: 'RANGER SC 4X4 2.0L SIT XL 6MT',
    offerType: 'payment',
    sortOrder: 39,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17887-ranger-sc-4x4-2.0l-sit-xl-6mt/images/17887-fab0a3f9-c4e5-4e86-b86c-047a5bba64e1d6f7a374-8882-4a98-b18d-283b82518cf3_Ranger-Single-Cab.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17887-ranger-sc-4x4-2.0l-sit-xl-6mt/images/17887-fab0a3f9-c4e5-4e86-b86c-047a5bba64e1d6f7a374-8882-4a98-b18d-283b82518cf3_Ranger-Single-Cab.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R8 599 pm</p><p><br></p><p>• Retail Price: R639 200</p><p>• Deposit: 0%</p><p>• Total Repayment: R866 209</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R255 680</p><p>• Term: 72 months</p><p>• Contract Rate: 7.70%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R9 799 pm</p><p>• Retail Price: R639 200</p><p>• Deposit: 0%</p><p>• Total Repayment: R819 762</p><p>• GFV Percentage: 56.2%</p><p>• GFV Amount: R359 209</p><p>• Term: 48 months</p><p>• Contract Rate: 8.50%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'From',
    specialOffer: 8599,
    vehicleSlug: 'ranger-single-cab',
    modelSlug: '2.0-sit-single-cab-xl-4x4-manual',
  },
  {
    slug: '16428--territory-1.8-ambiente-auto',
    title: 'Ford TERRITORY',
    subTitle: 'Territory 1.8 Ambiente Auto',
    offerType: 'service',
    sortOrder: 40,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/16428--territory-1.8-ambiente-auto/images/16428-8b1ce597-2b24-4d9c-a28b-ded5648f9b545f450ae6-722f-47f6-8be4-4239b757d22a_2604181_Ford_Sales_NewTerritory_Ambiente.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/16428--territory-1.8-ambiente-auto/images/16428-8b1ce597-2b24-4d9c-a28b-ded5648f9b545f450ae6-722f-47f6-8be4-4239b757d22a_2604181_Ford_Sales_NewTerritory_Ambiente.webp',
    contentSubheading: 'Territory 1.8 Ambiente Auto',
    bodyHtml:
      "<p>Drive the Ford Territory 1.8 Ambiente Auto from R7,199 PM* and save R45,000.</p><p><br></p><p>Your ideal family SUV just became even more affordable.</p><p><br></p><p>Now from R489,900, the Ford Territory 1.8 Ambiente Auto delivers comfort, style, and reliability, complete with a Service Plan included.</p><p><br></p><p>Don't miss this limited offer, subject to finance through Ford Credit.</p><p><br></p><p>Visit Eagle Ford today.</p><p><br></p><p>Terms and Conditions apply.</p>",
    pricingLabel: 'Save',
    specialOffer: 45000,
  },
  {
    slug: '17238-ford-cambelt-service',
    title: 'Ford Cambelt Service',
    subTitle: 'Ford Cambelt Service',
    offerType: 'service',
    sortOrder: 41,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17238-ford-cambelt-service/images/17238-5cd480bc-606e-496e-bd2f-f4c09f435a0e8b7791c7-08c0-4715-abd9-cdd525da1be5_Mobi.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17238-ford-cambelt-service/images/17238-5cd480bc-606e-496e-bd2f-f4c09f435a0e8b7791c7-08c0-4715-abd9-cdd525da1be5_Mobi.webp',
    contentSubheading: 'Book Your Ford Cambelt Service and Save R10 000',
    bodyHtml:
      '<p><strong>Book Your Ford Cambelt Service and Save R10 000</strong></p><p><br></p><p>Avoid costly engine damage and keep your Ford running at its best with our EcoSport and Fiesta Cambelt Service Special for 2015, 2016 and 2017 models.</p><p><br></p><p><strong>Service special includes:</strong></p><p><br></p><p>• Professional cambelt replacement</p><p>• Quality Ford-approved parts</p><p>• Expert technician fitment</p><p>• Peace of mind on the road</p><p><br></p><p><strong>Save R10 000 for a limited time only.</strong></p><p><br></p><p>Book your service today.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'Save',
    specialOffer: 10000,
  },
  {
    slug: '17862-mustang-dark-horse',
    title: 'Ford MUSTANG DARK HORSE',
    subTitle: 'Mustang Dark Horse',
    offerType: 'price-point',
    sortOrder: 42,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17862-mustang-dark-horse/images/17862-5bbe1ab8-cae6-4067-8954-85e9ffcab6daa5dac075-4205-4e99-8df0-76e620b6ffcb_download.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17862-mustang-dark-horse/images/17862-5bbe1ab8-cae6-4067-8954-85e9ffcab6daa5dac075-4205-4e99-8df0-76e620b6ffcb_download.webp',
    contentSubheading: 'Special Offer: R1 399 900*',
    bodyHtml:
      '<p><strong>Special Offer: R1 399 900*</strong></p><p><strong>Best Saving: R145 100*</strong></p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p><p><br></p><p><br></p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'mustang-dark-horse',
    modelSlug: 'mustang-5.0l-v8-dark-horse-10at',
  },
  {
    slug: '17872-new-level-territory-1.8-ambiente-auto',
    title: 'Ford TERRITORY NEXT LEVEL',
    subTitle: 'New Level Territory 1.8 Ambiente Auto',
    offerType: 'payment',
    sortOrder: 43,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17872-new-level-territory-1.8-ambiente-auto/images/17872-eb00131e-7e03-43f1-8045-e5f718e6789b6a857165-18bc-4748-818a-12bac8c20a27_b6da7bbd-22d7-4166-a8c9-1a7213fcaa9b.png',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17872-new-level-territory-1.8-ambiente-auto/images/17872-eb00131e-7e03-43f1-8045-e5f718e6789b6a857165-18bc-4748-818a-12bac8c20a27_b6da7bbd-22d7-4166-a8c9-1a7213fcaa9b.png',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R7 299 pm</p><p><br></p><p>• Retail Price: R534 900</p><p>• Deposit: 0%</p><p>• Total Repayment: R732 189</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R213 960</p><p>• Term: 72 months</p><p>• Contract Rate: 7.85%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R7 799 pm</p><p><br></p><p>• Retail Price: R534 900</p><p>• Deposit: 0%</p><p>• Total Repayment: R654 956</p><p>• GFV Percentage: 53.9%</p><p>• GFV Amount: R288 403</p><p>• Term: 48 months</p><p>• Contract Rate: 6.75%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 7299,
    vehicleSlug: 'new-level-territory',
  },
  {
    slug: '17873-new-level-territory-1.8-trend-auto',
    title: 'Ford TERRITORY NEXT LEVEL',
    subTitle: 'New Level Territory 1.8 Trend Auto',
    offerType: 'payment',
    sortOrder: 44,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/17873-new-level-territory-1.8-trend-auto/images/17873-0b501672-e843-4e7c-9192-a460867b7f91e36db99c-938c-48ac-9ce9-8182d5cdfe07_f0265575-9ca7-4191-ac57-17599485b10c.png',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/17873-new-level-territory-1.8-trend-auto/images/17873-0b501672-e843-4e7c-9192-a460867b7f91e36db99c-938c-48ac-9ce9-8182d5cdfe07_f0265575-9ca7-4191-ac57-17599485b10c.png',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R7 899 pm</p><p><br></p><p>• Retail Price: R584 900</p><p>• Deposit: 0%</p><p>• Total Repayment: R794 789</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R233 960</p><p>• Term: 72 months</p><p>• Contract Rate: 7.80%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R8 499 pm</p><p><br></p><p>• Retail Price: R584 900</p><p>• Deposit: 0%</p><p>• Total Repayment: R715 606</p><p>• GFV Percentage: 54.1%</p><p>• GFV Amount: R316 153</p><p>• Term: 48 months</p><p>• Contract Rate: 6.70%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 7899,
    vehicleSlug: 'new-level-territory',
  },
  {
    slug: '16429-territory-1.8-titanium-auto',
    title: 'Ford TERRITORY',
    subTitle: 'Territory 1.8 Titanium Auto',
    offerType: 'service',
    sortOrder: 45,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/16429-territory-1.8-titanium-auto/images/16429-05975175-a6a6-441b-ac06-9c05aa2d23f113d0d25b-2604-44c5-8bc9-b4baad2aa97b_2604181_Ford_Sales_NewTerritory_Titanium.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/16429-territory-1.8-titanium-auto/images/16429-05975175-a6a6-441b-ac06-9c05aa2d23f113d0d25b-2604-44c5-8bc9-b4baad2aa97b_2604181_Ford_Sales_NewTerritory_Titanium.webp',
    contentSubheading: 'Territory 1.8 Titanium Auto',
    bodyHtml:
      "<p>Drive the Ford Territory 1.8 Titanium Auto from R8,599 PM* and save R44,000.</p><p><br></p><p>The pinnacle of the Territory range now within reach.</p><p><br></p><p>Now from R599,900, the Ford Territory 1.8 Titanium Auto delivers the finest the Territory range has to offer, complete with a Service Plan included.</p><p><br></p><p>Don't miss this limited offer, subject to finance through Ford Credit.</p><p><br></p><p>Visit Eagle Ford today.</p><p><br></p><p>Terms and Conditions apply.</p>",
    pricingLabel: 'Save',
    specialOffer: 44000,
  },
  {
    slug: '16430-territory-1.8-trend-auto',
    title: 'Ford TERRITORY',
    subTitle: 'Territory 1.8 Trend Auto',
    offerType: 'service',
    sortOrder: 46,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/16430-territory-1.8-trend-auto/images/16430-5299537f-c607-44c8-973e-dec55e24f42e57ca845e-4f6e-4fa4-9981-a3a48fd8f0e7_2604181_Ford_Sales_NewTerritory_Trend.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/16430-territory-1.8-trend-auto/images/16430-5299537f-c607-44c8-973e-dec55e24f42e57ca845e-4f6e-4fa4-9981-a3a48fd8f0e7_2604181_Ford_Sales_NewTerritory_Trend.webp',
    contentSubheading: 'Territory 1.8 Trend Auto',
    bodyHtml:
      "<p>Drive the Ford Territory 1.8 Trend Auto from R7,799 PM* and save R45,000.</p><p><br></p><p>More features. More style. More savings.</p><p><br></p><p>Now from R539,900, the Ford Territory 1.8 Trend Auto gives you bold design and premium features, complete with a Service Plan included.</p><p><br></p><p>Don't miss this limited offer, subject to finance through Ford Credit.</p><p><br></p><p>Visit Eagle Ford today.</p><p><br></p><p>Terms and Conditions apply.</p>",
    pricingLabel: 'Save',
    specialOffer: 45000,
  },
  {
    slug: '16397-tourneo-2.0-sport-auto',
    title: 'Ford Tourneo Custom',
    subTitle: 'Tourneo 2.0 Sport Auto',
    offerType: 'price-point',
    sortOrder: 47,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/16397-tourneo-2.0-sport-auto/images/16397-6daca8a8-7f64-4218-8fc8-2b8aeaed8e69ab3d6dcd-1d7c-4c9a-a7b1-ea9b88fbee56_Transit-Custom-700x340---1-.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/16397-tourneo-2.0-sport-auto/images/16397-6daca8a8-7f64-4218-8fc8-2b8aeaed8e69ab3d6dcd-1d7c-4c9a-a7b1-ea9b88fbee56_Transit-Custom-700x340---1-.webp',
    contentSubheading: 'Tourneo 2.0 Sport Auto',
    bodyHtml:
      '<p>Special Offer: R1 125 000*</p><p>Best Saving: R107 000*</p><p><br></p><p>Additional specification:</p><ul><li>Excludes Options: Roof Racks / 19" Alloy / Mobile Office</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    specialOffer: 1125000,
    vehicleSlug: 'new-tourneo-custom',
  },
  {
    slug: '16299-new-level-territory-1.8-ambiente-auto',
    title: 'Ford TERRITORY',
    subTitle: 'New Level Territory 1.8 Ambiente Auto',
    offerType: 'price-point',
    sortOrder: 48,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/16299-new-level-territory-1.8-ambiente-auto/images/16299-7b3ccf26-1e18-403b-8de8-597e55a91a79e3bab0fd-121a-4c18-bd4b-c5c86ab2a363_New-Territory-PNG_Ambiente.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/16299-new-level-territory-1.8-ambiente-auto/images/16299-7b3ccf26-1e18-403b-8de8-597e55a91a79e3bab0fd-121a-4c18-bd4b-c5c86ab2a363_New-Territory-PNG_Ambiente.webp',
    contentSubheading: 'Special Offer: R489 900*',
    bodyHtml:
      '<p><strong>Special Offer: R489 900*</strong></p><p><strong>Best Saving: R45 000*</strong></p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'new-level-territory',
  },
  {
    slug: '16301-new-level-territory-1.8-titanium-auto',
    title: 'Ford TERRITORY',
    subTitle: 'New Level Territory 1.8 Titanium Auto',
    offerType: 'price-point',
    sortOrder: 49,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/16301-new-level-territory-1.8-titanium-auto/images/16301-a3d62bf3-d3b0-4d3b-89d5-86cbf49b7273e85c250f-5466-4a4a-828b-cc421a93eead_New-Territory-PNG_Titanium.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/16301-new-level-territory-1.8-titanium-auto/images/16301-a3d62bf3-d3b0-4d3b-89d5-86cbf49b7273e85c250f-5466-4a4a-828b-cc421a93eead_New-Territory-PNG_Titanium.webp',
    contentSubheading: 'Special Offer: R599 900*',
    bodyHtml:
      '<p><strong>Special Offer: R599 900*</strong></p><p><strong>Best Saving: R44 000*</strong></p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p><p><br></p><p><br></p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'new-level-territory',
  },
  {
    slug: '16300-new-level-territory-1.8-trend-auto',
    title: 'Ford TERRITORY',
    subTitle: 'New Level Territory 1.8 Trend Auto',
    offerType: 'price-point',
    sortOrder: 50,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/16300-new-level-territory-1.8-trend-auto/images/16300-496b040b-c87d-4faa-b31c-b878fca9060b3adf266a-2d07-440e-abff-65fa87b0e619_New-Territory-PNG_Trend.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/16300-new-level-territory-1.8-trend-auto/images/16300-496b040b-c87d-4faa-b31c-b878fca9060b3adf266a-2d07-440e-abff-65fa87b0e619_New-Territory-PNG_Trend.webp',
    contentSubheading: 'Special Offer: R539 900*',
    bodyHtml:
      '<p><strong>Special Offer: R539 900*</strong></p><p><strong>Best Saving: R45 000*</strong></p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p><p><br></p><p><br></p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'new-level-territory',
  },
  {
    slug: '16298-next-level-ranger-3.0-v6-tremor-4x4-dc-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 3.0 V6 Tremor 4x4 DC Auto',
    offerType: 'price-point',
    sortOrder: 51,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/16298-next-level-ranger-3.0-v6-tremor-4x4-dc-auto/images/16298-349500b2-c72f-4c03-af9f-864970fe81194da4edb0-d828-447b-9db1-0d18267bfe8a_Next-Level-Ranger-3-0-Tremor-4x4-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/16298-next-level-ranger-3.0-v6-tremor-4x4-dc-auto/images/16298-349500b2-c72f-4c03-af9f-864970fe81194da4edb0-d828-447b-9db1-0d18267bfe8a_Next-Level-Ranger-3-0-Tremor-4x4-DC.webp',
    contentSubheading: 'Special Offer: R964 900*',
    bodyHtml:
      '<p><strong>Special Offer: R964 900*</strong></p><p><strong>Best Saving: R74 100*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Flexi Rack</li><li>Cargo Management</li><li>Roller Shutter</li><li>Pro Trailer Back Up Assist</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'next-level-ranger',
    modelSlug: '3.0l-v6-double-cab-tremor-4x4-10at',
  },
  {
    slug: '16395-tourneo-2.0-trend-auto',
    title: 'Ford Tourneo Custom',
    subTitle: 'Tourneo 2.0 Trend Auto',
    offerType: 'price-point',
    sortOrder: 52,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/16395-tourneo-2.0-trend-auto/images/16395-13b92216-3753-48cb-8b97-c47e64af5c42649883be-9049-42cc-8cbd-3d9ef4a2f1e6_Tourneo-Custom-700x340-.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/16395-tourneo-2.0-trend-auto/images/16395-13b92216-3753-48cb-8b97-c47e64af5c42649883be-9049-42cc-8cbd-3d9ef4a2f1e6_Tourneo-Custom-700x340-.webp',
    contentSubheading: 'Special Offer: R969 900*',
    bodyHtml:
      '<p><strong>Special Offer: R969 900*</strong></p><p><strong>Best Saving: R152 050*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Console Floor Carpet</li><li>Floor Mats</li><li>Roof Racks</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    specialOffer: 969900,
    vehicleSlug: 'new-tourneo-custom',
  },
  {
    slug: '16394-tourneo-active-lwb-bus-auto',
    title: 'Ford TOURNEO',
    subTitle: 'Tourneo Active LWB Bus Auto',
    offerType: 'price-point',
    sortOrder: 53,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/16394-tourneo-active-lwb-bus-auto/images/16394-b736f56e-6dd8-478a-862d-0febcd45c299898bb4c6-e2cd-42b1-ba86-5b4348f1ea7e_Tourneo-700x340-.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/16394-tourneo-active-lwb-bus-auto/images/16394-b736f56e-6dd8-478a-862d-0febcd45c299898bb4c6-e2cd-42b1-ba86-5b4348f1ea7e_Tourneo-700x340-.webp',
    contentSubheading: 'Special Offer: R1 015 900*',
    bodyHtml:
      '<p><strong>Special Offer: R1 015 900*</strong></p><p><strong>Best Saving: R64 050*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Console Floor Carpet</li><li>Floor Mats</li><li>Roof Racks</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'new-tourneo-custom',
  },
  {
    slug: '16396-tourneo-titanium-x-auto',
    title: 'Ford Tourneo Custom',
    subTitle: 'Tourneo Titanium X Auto',
    offerType: 'price-point',
    sortOrder: 54,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/16396-tourneo-titanium-x-auto/images/16396-77b0802c-2314-4fc7-9289-8eae4246f04e8c94cea6-5dc6-4d7f-864d-712aa30be344_Tourneo-700x340---1-.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/16396-tourneo-titanium-x-auto/images/16396-77b0802c-2314-4fc7-9289-8eae4246f04e8c94cea6-5dc6-4d7f-864d-712aa30be344_Tourneo-700x340---1-.webp',
    contentSubheading: 'Special Offer: R1 210 900*',
    bodyHtml:
      '<p><strong>Special Offer: R1 210 900*</strong></p><p><strong>Best Saving: R67 600*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Add Options: Roof Rail / Mobile Office / Lux Pack</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    specialOffer: 1210900,
    vehicleSlug: 'new-tourneo-custom',
    modelSlug: 'tourneo-titanium-x',
  },
  {
    slug: '15894-next-level-ranger-2.0-sit-xlt-4x4-dc-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.0 SIT XLT 4x4 DC Auto',
    offerType: 'price-point',
    sortOrder: 55,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/15894-next-level-ranger-2.0-sit-xlt-4x4-dc-auto/images/15894-9a84b273-5796-4caa-8161-daf754199e2fdf4e1a8c-7528-4d87-b876-5d07f9c7e7fd_Next-Level-Ranger-2-0-XLT-4x4-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/15894-next-level-ranger-2.0-sit-xlt-4x4-dc-auto/images/15894-9a84b273-5796-4caa-8161-daf754199e2fdf4e1a8c-7528-4d87-b876-5d07f9c7e7fd_Next-Level-Ranger-2-0-XLT-4x4-DC.webp',
    contentSubheading: 'Special Offer: R712 900*',
    bodyHtml:
      '<p><strong>Special Offer: R712 900*</strong></p><p><strong>Best Saving: R75 600*</strong></p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'next-level-ranger',
    modelSlug: '2.0-sit-double-cab-xlt-4x2-10at',
  },
  {
    slug: '15893-next-level-ranger-2.0-xl-4x4-dc-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.0 XL 4x4 DC Auto',
    offerType: 'price-point',
    sortOrder: 56,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/15893-next-level-ranger-2.0-xl-4x4-dc-auto/images/15893-f0df347c-4f8b-4ff6-90c7-d1077f13051d5d9bb289-9b71-44fa-8040-395cec74c2d8_Next-Level-Ranger-2-0-XL-4x4-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/15893-next-level-ranger-2.0-xl-4x4-dc-auto/images/15893-f0df347c-4f8b-4ff6-90c7-d1077f13051d5d9bb289-9b71-44fa-8040-395cec74c2d8_Next-Level-Ranger-2-0-XL-4x4-DC.webp',
    contentSubheading: 'Special Offer: R659 900*',
    bodyHtml:
      '<p><strong>Special Offer: R659 900*</strong></p><p><strong>Best Saving: R75 100*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Tow Hitch</li><li>17" Alloy</li><li>Vinyl Floors plus Underbody &amp; Bin Liner</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p><p><br></p><p><br></p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'next-level-ranger',
    modelSlug: '2.0-sit-double-cab-xl-4x2-6mt',
  },
  {
    slug: '16295-next-level-ranger-2.3-sport-4x2-dc-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.3 Sport 4x2 DC Auto',
    offerType: 'price-point',
    sortOrder: 57,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/16295-next-level-ranger-2.3-sport-4x2-dc-auto/images/16295-39e816aa-2b80-4775-9cd2-ab6b9f6e9077b2d55b44-6e6c-447d-ad60-5400b59bcda0_Next-Level-Ranger-2-3-Sport-4x2-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/16295-next-level-ranger-2.3-sport-4x2-dc-auto/images/16295-39e816aa-2b80-4775-9cd2-ab6b9f6e9077b2d55b44-6e6c-447d-ad60-5400b59bcda0_Next-Level-Ranger-2-3-Sport-4x2-DC.webp',
    contentSubheading: 'Special Offer: R744 900*',
    bodyHtml:
      '<p><strong>Special Offer: R744 900*</strong></p><p><strong>Best Saving: R94 700*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Sport Bar</li><li>Flexi Rack (not std) Cargo Management</li><li>Accessory Switch and Under Body Protection</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p><p><br></p><p><br></p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'next-level-ranger',
    modelSlug: '2.3l-double-cab-sport-4x2-10at',
  },
  {
    slug: '15898-next-level-ranger-2.3-sport-4x2-super-cab',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.3 Sport 4x2 Super Cab',
    offerType: 'price-point',
    sortOrder: 58,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/15898-next-level-ranger-2.3-sport-4x2-super-cab/images/15898-db6de789-c030-406c-8366-9008a0fad3dd045d4ccd-741e-41b2-9c04-442fb21c31b5_Next-Level-Ranger-2-3-Sport-4x2-Super-Cab-A.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/15898-next-level-ranger-2.3-sport-4x2-super-cab/images/15898-db6de789-c030-406c-8366-9008a0fad3dd045d4ccd-741e-41b2-9c04-442fb21c31b5_Next-Level-Ranger-2-3-Sport-4x2-Super-Cab-A.webp',
    contentSubheading: 'Next Level Ranger 2.3 Sport 4x2 Super Cab',
    bodyHtml:
      '<p><strong style="color: rgb(0, 0, 0); background-color: transparent;">Special Offer: R</strong><strong style="color: rgb(0, 0, 0);">655 900</strong><span style="color: rgb(0, 0, 0); background-color: transparent;">*</span></p><p><strong style="color: rgb(0, 0, 0); background-color: transparent;">Best Saving: R</strong><strong style="color: rgb(0, 0, 0);">79 100</strong><span style="color: rgb(0, 0, 0); background-color: transparent;">*</span></p><p><span style="color: rgb(0, 0, 0); background-color: transparent;">&nbsp;</span></p><p><span style="color: rgb(0, 0, 0); background-color: transparent;">Options:</span></p><p><span style="color: rgb(0, 0, 0); background-color: transparent;">&nbsp;</span></p><p>Under Body</p><p>Cargo Man</p><p>Access Switch</p><p><span style="color: rgb(0, 0, 0); background-color: transparent;">&nbsp;</span></p><p><em style="color: rgb(0, 0, 0); background-color: transparent;">Terms and conditions apply.</em></p><p><span style="color: rgb(0, 0, 0); background-color: transparent;">&nbsp;</span></p><p><span style="color: rgb(0, 0, 0); background-color: transparent;">All subject to finance approval Ford Credit.</span></p><p><span style="color: rgb(0, 0, 0); background-color: transparent;">All including 6 year / 90 000 km Service Plan.</span></p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'ranger-super-cab',
  },
  {
    slug: '16296-next-level-ranger-2.3-wildtrak-4x2-dc-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.3 Wildtrak 4x2 DC Auto',
    offerType: 'price-point',
    sortOrder: 59,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/16296-next-level-ranger-2.3-wildtrak-4x2-dc-auto/images/16296-f01dda91-b1d0-482f-876c-0fcc66a4250b0e8de94e-982f-47c0-b301-98547bcf7c38_Next-Level-Ranger-2-3-Wildtrak-4x2-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/16296-next-level-ranger-2.3-wildtrak-4x2-dc-auto/images/16296-f01dda91-b1d0-482f-876c-0fcc66a4250b0e8de94e-982f-47c0-b301-98547bcf7c38_Next-Level-Ranger-2-3-Wildtrak-4x2-DC.webp',
    contentSubheading: 'Special Offer: R799 900*',
    bodyHtml:
      '<p><strong>Special Offer: R799 900*</strong></p><p><strong>Best Saving: R99 100*</strong></p><p><strong>Includes Maintenance Plan</strong></p><p><br></p><p>Subject to finance approval through Ford Credit.</p><p><br></p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'next-level-ranger',
    modelSlug: '2.3l-double-cab-wildtrak-4x2-10at',
  },
  {
    slug: '16297-next-level-ranger-3.0-v6-sport-4x4-dc-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 3.0 V6 Sport 4x4 DC Auto',
    offerType: 'price-point',
    sortOrder: 60,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/16297-next-level-ranger-3.0-v6-sport-4x4-dc-auto/images/16297-a0004c94-fd42-46a5-8761-aad3b2183333b81a10e5-1f0d-488f-9fd0-9a38ea816a4b_Next-Level-Ranger-3-0-Sport-4x4-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/16297-next-level-ranger-3.0-v6-sport-4x4-dc-auto/images/16297-a0004c94-fd42-46a5-8761-aad3b2183333b81a10e5-1f0d-488f-9fd0-9a38ea816a4b_Next-Level-Ranger-3-0-Sport-4x4-DC.webp',
    contentSubheading: 'Special Offer: R874 900*',
    bodyHtml:
      '<p><strong>Special Offer: R874 900*</strong></p><p><strong>Best Saving: R120 100*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Sports Bar</li><li>Flexi Rack</li><li>Cargo Management</li><li>Pro Trailer</li><li>Fuel Tank Guard</li><li>Accessory Switch</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'next-level-ranger',
    modelSlug: '3.0l-v6-double-cab-tremor-4x4-10at',
  },
  {
    slug: '15896-next-level-ranger-3.0-v6-wildtrak-4x4-dc-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 3.0 V6 Wildtrak 4x4 DC Auto',
    offerType: 'price-point',
    sortOrder: 61,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/15896-next-level-ranger-3.0-v6-wildtrak-4x4-dc-auto/images/15896-ac7884f2-1acd-4a9f-a0a3-03fc134282f56e03e98b-c452-4bc8-83ee-c3fba3c65039_Next-Level-Ranger-3-0-Wildtrak-4x4-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/15896-next-level-ranger-3.0-v6-wildtrak-4x4-dc-auto/images/15896-ac7884f2-1acd-4a9f-a0a3-03fc134282f56e03e98b-c452-4bc8-83ee-c3fba3c65039_Next-Level-Ranger-3-0-Wildtrak-4x4-DC.webp',
    contentSubheading: 'Special Offer: R965 900*',
    bodyHtml:
      '<p><strong>Special Offer: R965 900*</strong></p><p><strong>Best Saving: R104 100*</strong></p><p><strong style="background-color: transparent;">Includes Maintenance Plan</strong></p><p><span style="background-color: transparent;">﻿</span></p><p>Subject to finance approval through Ford Credit.</p><p><br></p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'next-level-ranger',
    modelSlug: '3.0l-v6-double-cab-wildtrak-4x4-10at',
  },
  {
    slug: '15887-next-level-ranger-2.0-sit--xlt-4x4-super-cab--auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.0 SiT XLT 4x4 Super Cab Auto',
    offerType: 'price-point',
    sortOrder: 62,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/15887-next-level-ranger-2.0-sit--xlt-4x4-super-cab--auto/images/15887-47c583cf-f9eb-4cde-bf40-39a2588d99105b45d795-4cfa-4b7f-b028-0db092aac718_Next-Level-Ranger-2-0-XLT-4x4-Super-Cab-A.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/15887-next-level-ranger-2.0-sit--xlt-4x4-super-cab--auto/images/15887-47c583cf-f9eb-4cde-bf40-39a2588d99105b45d795-4cfa-4b7f-b028-0db092aac718_Next-Level-Ranger-2-0-XLT-4x4-Super-Cab-A.webp',
    contentSubheading: 'Special Offer: R669 900*',
    bodyHtml:
      '<p><strong>Special Offer: R669 900*</strong></p><p><strong>Best Saving: R61 100*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Fuel Tank Guard</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p><p><br></p><p><br></p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'ranger-super-cab',
    modelSlug: 'ranger-2.0-sit-supercab-xl-auto',
  },
  {
    slug: '15889-next-level-ranger-2.0-sit-xlt-4x2-dc-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.0 SIT XLT 4x2 DC Auto',
    offerType: 'price-point',
    sortOrder: 63,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/15889-next-level-ranger-2.0-sit-xlt-4x2-dc-auto/images/15889-2cc99ae7-6e07-4861-8c87-6c304980bbebe8d92ca0-952b-45f9-86e3-33976ed4b575_Next-Level-Ranger-2-0-XLT-4x2-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/15889-next-level-ranger-2.0-sit-xlt-4x2-dc-auto/images/15889-2cc99ae7-6e07-4861-8c87-6c304980bbebe8d92ca0-952b-45f9-86e3-33976ed4b575_Next-Level-Ranger-2-0-XLT-4x2-DC.webp',
    contentSubheading: 'Special Offer: R599 900*',
    bodyHtml:
      '<p><strong>Special Offer: R599 900*</strong></p><p><strong>Best Saving: R99 600*</strong></p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'next-level-ranger',
    modelSlug: '2.0-sit-double-cab-xlt-4x2-10at',
  },
  {
    slug: '15888-next-level-ranger-2.0-sit-xlt-4x2-super-cab-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.0 SiT XLT 4x2 Super Cab Auto',
    offerType: 'price-point',
    sortOrder: 64,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/15888-next-level-ranger-2.0-sit-xlt-4x2-super-cab-auto/images/15888-ce4213a4-2be6-45de-bf63-3647cd4b5b8b3a194ad4-13e3-44fd-ae24-ce2b13daaa9f_Next-Level-Ranger-2-0-XLT-4x2-Super-Cab-A.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/15888-next-level-ranger-2.0-sit-xlt-4x2-super-cab-auto/images/15888-ce4213a4-2be6-45de-bf63-3647cd4b5b8b3a194ad4-13e3-44fd-ae24-ce2b13daaa9f_Next-Level-Ranger-2-0-XLT-4x2-Super-Cab-A.webp',
    contentSubheading: 'Special Offer: R555 900*',
    bodyHtml:
      '<p><strong>Special Offer: R555 900*</strong></p><p><strong>Best Saving: R99 100*</strong></p><p><strong>Includes Maintenance Plan</strong></p><p><br></p><p>Subject to finance approval through Ford Credit.</p><p><br></p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'ranger-super-cab',
    modelSlug: 'ranger-2.0-sit-supercab-xl-auto',
  },
  {
    slug: '15850-next-level-ranger-2.0-xl-4x2-dc-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.0 XL 4x2 DC Auto',
    offerType: 'price-point',
    sortOrder: 65,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/15850-next-level-ranger-2.0-xl-4x2-dc-auto/images/15850-96eb591d-34f9-4d3c-badb-17c5ab386b9bd823e380-3dc7-4f99-aa7c-2a272cc28452_Next-Level-Ranger-2-0-XL-4x2-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/15850-next-level-ranger-2.0-xl-4x2-dc-auto/images/15850-96eb591d-34f9-4d3c-badb-17c5ab386b9bd823e380-3dc7-4f99-aa7c-2a272cc28452_Next-Level-Ranger-2-0-XL-4x2-DC.webp',
    contentSubheading: 'Special Offer: R559 900*',
    bodyHtml:
      '<p><strong>Special Offer: R559 900*</strong></p><p><strong>Best Saving: R91 600*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Tow Hitch</li><li>17" Alloy</li><li>Vinyl Floors &amp; Bin Liner</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'next-level-ranger',
    modelSlug: '2.0-sit-double-cab-xl-4x2-6mt',
  },
  {
    slug: '15873-next-level-ranger-2.0-xl-4x2-single-cab-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.0 XL 4x2 Single Cab Auto',
    offerType: 'price-point',
    sortOrder: 66,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/15873-next-level-ranger-2.0-xl-4x2-single-cab-auto/images/15873-fe6fdf6a-8890-45bf-9b68-cbbd92823f7fbc47faa3-cce5-4c81-8ee2-606204d5ef04_Next-Level-Ranger-2-0-XL-4x2-Single-Cab-A.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/15873-next-level-ranger-2.0-xl-4x2-single-cab-auto/images/15873-fe6fdf6a-8890-45bf-9b68-cbbd92823f7fbc47faa3-cce5-4c81-8ee2-606204d5ef04_Next-Level-Ranger-2-0-XL-4x2-Single-Cab-A.webp',
    contentSubheading: 'Special Offer: R515 900*',
    bodyHtml:
      '<p><strong>Special Offer: R515 900*</strong></p><p><strong>Best Saving: R74 100*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Tow Hitch</li><li>17" Alloy</li><li>Vinyl Floors</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'ranger-single-cab',
    modelSlug: 'ranger-2.0-sit-single-cab-xl-4x2-auto',
  },
  {
    slug: '15886-next-level-ranger-2.0-xl-4x2-super-cab-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.0 XL 4x2 Super Cab Auto',
    offerType: 'price-point',
    sortOrder: 67,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/15886-next-level-ranger-2.0-xl-4x2-super-cab-auto/images/15886-ab08765d-cfee-49b4-8a78-255339f7bfeb8dddc466-b3fc-4f27-bd69-4ce915337a36_Next-Level-Ranger-2-0-XL-4x2-Super-Cab-A.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/15886-next-level-ranger-2.0-xl-4x2-super-cab-auto/images/15886-ab08765d-cfee-49b4-8a78-255339f7bfeb8dddc466-b3fc-4f27-bd69-4ce915337a36_Next-Level-Ranger-2-0-XL-4x2-Super-Cab-A.webp',
    contentSubheading: 'Special Offer: R519 900*',
    bodyHtml:
      '<p><strong>Special Offer: R519 900*</strong></p><p><strong>Best Saving: R79 600*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Tow Hitch</li><li>17" Alloy</li><li>Vinyl Floors</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p><p><br></p><p><br></p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'ranger-super-cab',
    modelSlug: 'ranger-2.0-sit-supercab-xl-auto',
  },
  {
    slug: '15877-next-level-ranger-2.0-xl-4x4-single-cab-auto',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.0 XL 4x4 Single Cab Auto',
    offerType: 'price-point',
    sortOrder: 68,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/15877-next-level-ranger-2.0-xl-4x4-single-cab-auto/images/15877-298df42a-1ad9-46b4-9f0b-dab8289dbb5968f11431-c206-4563-86b3-bc6468313f1c_Next-Level-Ranger-2-0-XL-4x4-Single-Cab-A.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/15877-next-level-ranger-2.0-xl-4x4-single-cab-auto/images/15877-298df42a-1ad9-46b4-9f0b-dab8289dbb5968f11431-c206-4563-86b3-bc6468313f1c_Next-Level-Ranger-2-0-XL-4x4-Single-Cab-A.webp',
    contentSubheading: 'Special Offer: R579 900*',
    bodyHtml:
      '<p><strong>Special Offer: R579 900*</strong></p><p><strong>Best Saving: R86 100*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Tow Hitch</li><li>17" Alloy</li><li>Vinyl Floors</li><li>Underbody Protection</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p><p><br></p><p><br></p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'ranger-single-cab',
    modelSlug: 'ranger-2.0-sit-single-cab-xl-4x2-auto',
  },
  {
    slug: '12804-ford-transit-van-lwb-manual',
    title: 'Ford Transit Custom',
    subTitle: 'Ford Transit Van LWB Manual',
    offerType: 'price-point',
    sortOrder: 69,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/12804-ford-transit-van-lwb-manual/images/12804-d6065bea-4f35-40ad-a7f7-c0848779c42ffd9d8b83-8d6b-442c-af57-d878f01bd4e0_Transit-Custom-700x340-.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/12804-ford-transit-van-lwb-manual/images/12804-d6065bea-4f35-40ad-a7f7-c0848779c42ffd9d8b83-8d6b-442c-af57-d878f01bd4e0_Transit-Custom-700x340-.webp',
    contentSubheading: 'Special Offer: R659 900*',
    bodyHtml:
      '<p><strong>Special Offer: R659 900*</strong></p><p><strong>Best Saving: R120 850*</strong></p><p><br></p><p>Additional specification:</p><ul><li>ATC Air Conditioning</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'new-transit-custom',
    modelSlug: 'transit-custom-2.0l-lwb-van-base-6mt',
  },
  {
    slug: '15849-next-level-ranger-2.0-xl-4x2-dc-manual',
    title: 'Ford Next Level Ranger',
    subTitle: 'Next Level Ranger 2.0 XL 4x2 DC Manual',
    offerType: 'price-point',
    sortOrder: 70,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/15849-next-level-ranger-2.0-xl-4x2-dc-manual/images/15849-1195fd5a-702f-4a6e-8d81-e87b0c87f342c7986659-91a4-4056-8626-8baa73cd57f8_Next-Level-Ranger-2-0-XL-4x2-DC.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/15849-next-level-ranger-2.0-xl-4x2-dc-manual/images/15849-1195fd5a-702f-4a6e-8d81-e87b0c87f342c7986659-91a4-4056-8626-8baa73cd57f8_Next-Level-Ranger-2-0-XL-4x2-DC.webp',
    contentSubheading: 'Special Offer: R569 900*',
    bodyHtml:
      '<p><strong>Special Offer: R569 900*</strong></p><p><strong>Best Saving: R51 100*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Tow Hitch</li><li>17" Alloy</li><li>Vinyl Floors</li><li>Bin Liner</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p><p><br></p><p><br></p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'next-level-ranger',
    modelSlug: '2.0-sit-double-cab-xl-4x2-6mt',
  },
  {
    slug: '12817-service-and-pick-up-delivery',
    title: 'Service and Pick-Up/Delivery',
    subTitle: 'Service and Pick-Up/Delivery',
    offerType: 'service',
    sortOrder: 71,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/12817-service-and-pick-up-delivery/images/12817-aa2df47c-113d-4653-851d-309f3c68e5237074b176-be19-40fa-9150-1370f1428bbf_238f2635-664f-4251-b878-1c250029acf2_Service_Campaign_Offer_Mobile_Banner_Convenient_Service.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/12817-service-and-pick-up-delivery/images/12817-aa2df47c-113d-4653-851d-309f3c68e5237074b176-be19-40fa-9150-1370f1428bbf_238f2635-664f-4251-b878-1c250029acf2_Service_Campaign_Offer_Mobile_Banner_Convenient_Service.webp',
    contentSubheading: 'Keep your Ford running like new at Eagle Ford',
    bodyHtml:
      '<p><strong>Keep your Ford running like new at Eagle Ford</strong></p><p><br></p><p>Our 5 certified Master Technicians use genuine parts and offer convenient booking options.</p><p><br></p><p>Enjoy <strong>complimentary pick-up &amp; delivery</strong> or easy drop-off and collection within 30 km of the dealership.</p><p><br></p><p><strong>Book your service today.</strong></p><p><br></p><p>Terms and conditions apply.</p>',
  },
  {
    slug: '14774-tourneo-custom-2.0l-lwb-bus-trend-8at',
    title: 'Ford Tourneo Custom',
    subTitle: 'Tourneo Custom 2.0L LWB BUS TREND 8AT',
    offerType: 'payment',
    sortOrder: 72,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/14774-tourneo-custom-2.0l-lwb-bus-trend-8at/images/14774-853c01b9-14aa-450b-8fd2-4cafee8b19eaf128bd06-1454-4dc3-a470-9198296ed96a_Tourneo-Custom-700x340-.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/14774-tourneo-custom-2.0l-lwb-bus-trend-8at/images/14774-853c01b9-14aa-450b-8fd2-4cafee8b19eaf128bd06-1454-4dc3-a470-9198296ed96a_Tourneo-Custom-700x340-.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R14 599 pm</p><p><br></p><p>• Retail Price: R1 117 500</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 483 529</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R447 000</p><p>• Term: 72 months</p><p>• Contract Rate: 7.30%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R16 299 pm</p><p><br></p><p>• Retail Price: R1 117 500</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 394 144</p><p>• GFV Percentage: 56.2%</p><p>• GFV Amount: R628 091</p><p>• Term: 48 months</p><p>• Contract Rate: 7.55%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 14599,
    vehicleSlug: 'new-tourneo-custom',
  },
  {
    slug: '12806-tourneo-custom-2.0l-swb-bus-sport-8at',
    title: 'Ford Tourneo Custom',
    subTitle: 'TOURNEO CUSTOM 2.0L SWB BUS SPORT 8AT',
    offerType: 'payment',
    sortOrder: 73,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/12806-tourneo-custom-2.0l-swb-bus-sport-8at/images/12806-0cb0aa79-e538-4443-a26b-22d5d01728fd48fe7831-576e-4d47-8313-92297b840dd0_download.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/12806-tourneo-custom-2.0l-swb-bus-sport-8at/images/12806-0cb0aa79-e538-4443-a26b-22d5d01728fd48fe7831-576e-4d47-8313-92297b840dd0_download.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R18 299 pm</p><p><br></p><p>• Retail Price: R1 232 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 792 029</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R492 800</p><p>• Term: 72 months</p><p>• Contract Rate: 10.00%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R20 999 pm</p><p><br></p><p>• Retail Price: R1 232 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 680 881</p><p>• GFV Percentage: 56.3%</p><p>• GFV Amount: R693 928</p><p>• Term: 48 months</p><p>• Contract Rate: 11.05%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 18299,
    vehicleSlug: 'new-tourneo-custom',
  },
  {
    slug: '14775-tourneo-custom-2.0l-swb-titanium-x-8at',
    title: 'Ford Tourneo Custom',
    subTitle: 'Tourneo Custom 2.0L SWB TITANIUM X 8AT',
    offerType: 'payment',
    sortOrder: 74,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/14775-tourneo-custom-2.0l-swb-titanium-x-8at/images/14775-68384505-2f7b-4e99-9f11-a79407bf1aeaf66405f1-7757-431c-a4dc-12102d40302b_Tourneo-700x340---1-.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/14775-tourneo-custom-2.0l-swb-titanium-x-8at/images/14775-68384505-2f7b-4e99-9f11-a79407bf1aeaf66405f1-7757-431c-a4dc-12102d40302b_Tourneo-700x340---1-.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R18 999 pm</p><p><br></p><p>• Retail Price: R1 278 500</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 860 329</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R511 400</p><p>• Term: 72 months</p><p>• Contract Rate: 10.00%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R21 799 pm</p><p><br></p><p>• Retail Price: R1 278 500</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 745 219</p><p>• GFV Percentage: 56.4%</p><p>• GFV Amount: R720 666</p><p>• Term: 48 months</p><p>• Contract Rate: 11.05%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 18999,
    vehicleSlug: 'new-tourneo-custom',
  },
  {
    slug: '12726-everest-3.0-v6-platinum-at',
    title: 'Ford Everest',
    subTitle: 'Everest 3.0 V6 Platinum AT',
    offerType: 'price-point',
    sortOrder: 75,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/12726-everest-3.0-v6-platinum-at/images/12726-304be4af-6dc4-4bc6-a559-023ca44357b8ce7a7a1a-6d29-4289-b04e-c58752542f59_Everest-700x340---1-.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/12726-everest-3.0-v6-platinum-at/images/12726-304be4af-6dc4-4bc6-a559-023ca44357b8ce7a7a1a-6d29-4289-b04e-c58752542f59_Everest-700x340---1-.webp',
    contentSubheading: 'Special Offer:',
    bodyHtml:
      '<p><strong>Special Offer:</strong> <strong>R1 067 900*</strong></p><p><strong>Best Saving:</strong> <strong>R</strong><strong style="color: rgb(0, 0, 0);">256 000﻿</strong><strong>*</strong> <em>(Including 6 Year / 90 000 km Service Plan)</em></p><p><br></p><p>Available in Equanox Bronze and White.</p><p><br></p><p>Limited Stock.</p><p><br></p><p>Subject to In-House Finance.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'next-level-everest',
    modelSlug: '3.0-v6-platinum-4x4-10at',
  },
  {
    slug: '12769-everest-3.0l-v6-platinum-4wd-10at',
    title: 'Ford Everest',
    subTitle: 'EVEREST 3.0L V6 PLATINUM 4WD 10AT',
    offerType: 'payment',
    sortOrder: 76,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/12769-everest-3.0l-v6-platinum-4wd-10at/images/12769-be4f1c20-9738-4f72-ae64-e3ca8c7ca645f589caf2-80d6-478c-97e0-5d7f22fd139a_Everest-700x340---4-.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/12769-everest-3.0l-v6-platinum-4wd-10at/images/12769-be4f1c20-9738-4f72-ae64-e3ca8c7ca645f589caf2-80d6-478c-97e0-5d7f22fd139a_Everest-700x340---4-.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R16 099 pm</p><p><br></p><p>• Retail Price: R1 324 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 672 229</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R529 600</p><p>• Term: 72 months</p><p>• Contract Rate: 5.85%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R18 199 pm</p><p><br></p><p>• Retail Price: R1 324 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 563 216</p><p>• GFV Percentage: 53.5%</p><p>• GFV Amount: R707 863</p><p>• Term: 48 months</p><p>• Contract Rate: 5.55%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 16099,
    vehicleSlug: 'next-level-everest',
    modelSlug: '3.0-v6-platinum-4x4-10at',
  },
  {
    slug: '12778-mustang-5.0-gt-fastback-10at',
    title: 'Ford MUSTANG',
    subTitle: 'MUSTANG 5.0 GT FASTBACK 10AT',
    offerType: 'payment',
    sortOrder: 77,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/12778-mustang-5.0-gt-fastback-10at/images/12778-14b06fee-bded-48d7-a6c3-ac92cb32483345641573-5a5a-400e-bb36-c1783fb8709d_Mustang-GT-700x340-.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/12778-mustang-5.0-gt-fastback-10at/images/12778-14b06fee-bded-48d7-a6c3-ac92cb32483345641573-5a5a-400e-bb36-c1783fb8709d_Mustang-GT-700x340-.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R19 999 pm</p><p><br></p><p>• Retail Price: R1 340 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 955 929</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R536 000</p><p>• Term: 72 months</p><p>• Contract Rate: 10.15%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R23 999 pm</p><p><br></p><p>• Retail Price: R1 340 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R1 816 866</p><p>• GFV Percentage: 51.4%</p><p>• GFV Amount: R688 913</p><p>• Term: 48 months</p><p>• Contract Rate: 11.10%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p>',
    pricingLabel: 'From',
    specialOffer: 19999,
    vehicleSlug: 'mustang-gt',
    modelSlug: 'mustang-5.0l-v8-gt-fastback-10at',
  },
  {
    slug: '12779-mustang-dark-horse-10at',
    title: 'Ford MUSTANG',
    subTitle: 'MUSTANG DARK HORSE 10AT',
    offerType: 'payment',
    sortOrder: 78,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/12779-mustang-dark-horse-10at/images/12779-bf2cc23a-a3a3-49a0-b466-6a04e95577188e6e0094-53c0-4ece-b04b-0f750a8da416_Mustang-Dark-Horse-700x340-.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/12779-mustang-dark-horse-10at/images/12779-bf2cc23a-a3a3-49a0-b466-6a04e95577188e6e0094-53c0-4ece-b04b-0f750a8da416_Mustang-Dark-Horse-700x340-.webp',
    contentSubheading: 'ISA Low Payment Linked Rate',
    bodyHtml:
      '<p><strong>ISA Low Payment Linked Rate</strong></p><p><br></p><p>From R22 999 pm</p><p><br></p><p>• Retail Price: R1 545 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R2 250 929</p><p>• Balloon Percentage: 40.0%</p><p>• Balloon Amount: R618 000</p><p>• Term: 72 months</p><p>• Contract Rate: 10.15%</p><p><br></p><p><strong>Ford Options</strong></p><p><br></p><p>From R27 199 pm</p><p><br></p><p>• Retail Price: R1 545 000</p><p>• Deposit: 0%</p><p>• Total Repayment: R2 097 562</p><p>• GFV Percentage: 53.0%</p><p>• GFV Amount: R819 209</p><p>• Term: 48 months</p><p>• Contract Rate: 11.10%</p><p><br></p><p>Subject to finance through Ford Credit.</p><p>Price includes a standard 6 year / 90 000km service plan.</p><p>Ask us about peace of mind 3 in 1 maintenance plan upgrades.</p><p><br></p><p>Terms and conditions apply.</p><p><br></p>',
    pricingLabel: 'From',
    specialOffer: 22999,
    vehicleSlug: 'mustang-dark-horse',
    modelSlug: 'mustang-5.0l-v8-dark-horse-10at',
  },
  {
    slug: '12651-ranger-3.0-v6-petrol-raptor',
    title: 'Ford RANGER RAPTOR',
    subTitle: 'Ranger 3.0 V6 Petrol Raptor',
    offerType: 'price-point',
    sortOrder: 79,
    cardImageUrl:
      'https://www.eagleford.co.za/specials/12651-ranger-3.0-v6-petrol-raptor/images/12651-7ccbf218-831b-4029-9cdc-75ae3737337cbd893d7b-5756-4c74-9436-f68beb58cd7a_Ranger-Raptor-700x340-.webp',
    detailImageUrl:
      'https://www.eagleford.co.za/specials/12651-ranger-3.0-v6-petrol-raptor/images/12651-7ccbf218-831b-4029-9cdc-75ae3737337cbd893d7b-5756-4c74-9436-f68beb58cd7a_Ranger-Raptor-700x340-.webp',
    contentSubheading: 'Special Offer: R1 239 900*',
    bodyHtml:
      '<p><strong>Special Offer: R1 239 900*</strong></p><p><strong>Best Saving: R67 400*</strong></p><p><br></p><p>Additional specification:</p><ul><li>Roller Shutter &amp; Decals</li></ul><p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>',
    pricingLabel: 'Special Offer',
    vehicleSlug: 'next-level-ranger',
  },
]
