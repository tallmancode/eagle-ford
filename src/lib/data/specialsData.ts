import {
  FILTER_TABS,
  getOfferTypeLabel,
  getSectionLabel,
  SPECIAL_SECTIONS as SECTION_OPTIONS,
  type FilterValue,
  type OfferType,
  type SpecialCategory,
  type SpecialSectionId,
} from '@/lib/specials/constants'

export type { FilterValue, OfferType, SpecialCategory }

export { FILTER_TABS, getOfferTypeLabel }

export type SpecialOffer = {
  id: string
  vehicleLine: string
  variantName: string
  category: SpecialCategory
  sectionId: SpecialSectionId
  sectionTitle: string
  offerType: OfferType
  image: string
  specialOffer?: number
  bestSaving?: number
  paymentFrom?: number
  sectionLabel?: string
}

export type SpecialSection = {
  id: SpecialSectionId
  title: string
  image: string
}

export const SPECIAL_SECTIONS: SpecialSection[] = SECTION_OPTIONS.map(
  ({ value, label, image }) => ({
    id: value,
    title: label,
    image,
  }),
)

export const SPECIAL_OFFERS: SpecialOffer[] = [
  // Ranger Double Cab — price-point
  {
    id: 'ranger-dc-1',
    vehicleLine: 'Ford Next Level Ranger',
    variantName: 'Next Level Ranger 2.0 XL 4x2 DC Manual',
    category: 'bakkies',
    sectionId: 'ranger-dc',
    sectionTitle: getSectionLabel('ranger-dc'),
    offerType: 'price-point',
    image: '/vehicle-tabs/next-level-ranger.webp',
    specialOffer: 569900,
    bestSaving: 51100,
    sectionLabel: 'Price Point Specials',
  },
  {
    id: 'ranger-dc-2',
    vehicleLine: 'Ford Next Level Ranger',
    variantName: 'Next Level Ranger 2.0 XL 4x2 DC Auto',
    category: 'bakkies',
    sectionId: 'ranger-dc',
    sectionTitle: getSectionLabel('ranger-dc'),
    offerType: 'price-point',
    image: '/vehicle-tabs/next-level-ranger.webp',
    specialOffer: 559900,
    bestSaving: 91600,
    sectionLabel: 'Price Point Specials',
  },
  {
    id: 'ranger-dc-3',
    vehicleLine: 'Ford Next Level Ranger',
    variantName: 'RANGER DC 4X2 2.0L SIT XL 10AT',
    category: 'bakkies',
    sectionId: 'ranger-dc',
    sectionTitle: getSectionLabel('ranger-dc'),
    offerType: 'payment',
    image: '/vehicle-tabs/next-level-ranger.webp',
    paymentFrom: 8099,
    sectionLabel: 'Next Level Ranger Double Cab Offers',
  },
  {
    id: 'ranger-dc-4',
    vehicleLine: 'Ford Next Level Ranger',
    variantName: 'Next Level Ranger 3.0 V6 Platinum 4x4 DC Auto',
    category: 'bakkies',
    sectionId: 'ranger-dc',
    sectionTitle: getSectionLabel('ranger-dc'),
    offerType: 'price-point',
    image: '/vehicle-tabs/ranger-platinum.webp',
    specialOffer: 1064900,
    bestSaving: 114600,
    sectionLabel: 'Price Point Specials',
  },
  {
    id: 'ranger-single-1',
    vehicleLine: 'Ford Next Level Ranger',
    variantName: 'Next Level Ranger 2.0 XL 4x2 Single Cab Auto',
    category: 'bakkies',
    sectionId: 'ranger-single',
    sectionTitle: getSectionLabel('ranger-single'),
    offerType: 'price-point',
    image: '/vehicle-tabs/ranger-single-cab.webp',
    specialOffer: 489900,
    bestSaving: 100100,
    sectionLabel: 'Price Point Specials',
  },
  {
    id: 'ranger-single-2',
    vehicleLine: 'Ford Next Level Ranger',
    variantName: 'RANGER SC 4X2 2.0L SIT XL 10AT',
    category: 'bakkies',
    sectionId: 'ranger-single',
    sectionTitle: getSectionLabel('ranger-single'),
    offerType: 'payment',
    image: '/vehicle-tabs/ranger-single-cab.webp',
    paymentFrom: 7799,
    sectionLabel: 'Payment Options',
  },
  {
    id: 'ranger-sc-1',
    vehicleLine: 'Ford Next Level Ranger',
    variantName: 'Next Level Ranger 2.0 XL 4x2 Super Cab Auto',
    category: 'bakkies',
    sectionId: 'ranger-sc',
    sectionTitle: getSectionLabel('ranger-sc'),
    offerType: 'price-point',
    image: '/vehicle-tabs/ranger-super-cab.webp',
    specialOffer: 519900,
    bestSaving: 79600,
    sectionLabel: 'Price Point Specials',
  },
  {
    id: 'raptor-1',
    vehicleLine: 'Ford RANGER RAPTOR',
    variantName: 'Ranger 3.0 V6 Petrol Raptor',
    category: 'bakkies',
    sectionId: 'raptor',
    sectionTitle: getSectionLabel('raptor'),
    offerType: 'price-point',
    image: '/vehicle-tabs/ranger-raptor.webp',
    specialOffer: 1239900,
    bestSaving: 67400,
    sectionLabel: 'Price Point Specials',
  },
  {
    id: 'territory-1',
    vehicleLine: 'Ford TERRITORY',
    variantName: 'New Level Territory 1.8 Ambiente Auto',
    category: 'suv',
    sectionId: 'territory',
    sectionTitle: getSectionLabel('territory'),
    offerType: 'price-point',
    image: '/vehicle-tabs/new-level-territory.webp',
    specialOffer: 489900,
    bestSaving: 45000,
    sectionLabel: 'Price Point Specials',
  },
  {
    id: 'territory-2',
    vehicleLine: 'Ford TERRITORY NEXT LEVEL',
    variantName: 'New Level Territory 1.8 Titanium Auto',
    category: 'suv',
    sectionId: 'territory',
    sectionTitle: getSectionLabel('territory'),
    offerType: 'payment',
    image: '/vehicle-tabs/new-level-territory.webp',
    paymentFrom: 8699,
    sectionLabel: 'Payment Options',
  },
  {
    id: 'everest-1',
    vehicleLine: 'Ford Next Level Everest',
    variantName: 'Everest 2.0 SiT Active 4x2 Auto',
    category: 'suv',
    sectionId: 'everest-nl',
    sectionTitle: getSectionLabel('everest-nl'),
    offerType: 'price-point',
    image: '/vehicle-tabs/next-level-everest.webp',
    specialOffer: 779900,
    bestSaving: 45100,
    sectionLabel: 'Price Point Specials',
  },
  {
    id: 'everest-2',
    vehicleLine: 'Ford Next Level Everest',
    variantName: 'Everest 3.0 V6 Platinum Auto',
    category: 'suv',
    sectionId: 'everest-nl',
    sectionTitle: getSectionLabel('everest-nl'),
    offerType: 'price-point',
    image: '/vehicle-tabs/next-level-everest.webp',
    specialOffer: 1219900,
    bestSaving: 120100,
    sectionLabel: 'Price Point Specials',
  },
  {
    id: 'mustang-1',
    vehicleLine: 'Ford MUSTANG DARK HORSE',
    variantName: 'Mustang Dark Horse',
    category: 'cars',
    sectionId: 'mustang',
    sectionTitle: getSectionLabel('mustang'),
    offerType: 'price-point',
    image: '/vehicle-tabs/mustang-dark-horse.webp',
    specialOffer: 1399900,
    bestSaving: 145100,
    sectionLabel: 'Price Point Specials',
  },
  {
    id: 'mustang-2',
    vehicleLine: 'Ford MUSTANG',
    variantName: 'MUSTANG 5.0 GT FASTBACK 10AT',
    category: 'cars',
    sectionId: 'mustang',
    sectionTitle: getSectionLabel('mustang'),
    offerType: 'payment',
    image: '/vehicle-tabs/mustang-gt.webp',
    paymentFrom: 19999,
    sectionLabel: 'Payment Options',
  },
  {
    id: 'transit-1',
    vehicleLine: 'Ford Transit Custom',
    variantName: 'Ford Transit Van LWB Manual',
    category: 'commercial',
    sectionId: 'transit',
    sectionTitle: getSectionLabel('transit'),
    offerType: 'price-point',
    image: '/vehicle-tabs/new-transit-custom.webp',
    specialOffer: 659900,
    bestSaving: 120850,
    sectionLabel: 'Price Point Specials',
  },
  {
    id: 'tourneo-1',
    vehicleLine: 'Ford Tourneo Custom',
    variantName: 'Tourneo 2.0 Trend Auto',
    category: 'commercial',
    sectionId: 'tourneo',
    sectionTitle: getSectionLabel('tourneo'),
    offerType: 'price-point',
    image: '/vehicle-tabs/new-tourneo-custom.webp',
    specialOffer: 969900,
    bestSaving: 152050,
    sectionLabel: 'Price Point Specials',
  },
  {
    id: 'service-1',
    vehicleLine: 'Ford Cambelt Service',
    variantName: 'Ford Cambelt Service',
    category: 'service',
    sectionId: 'service',
    sectionTitle: getSectionLabel('service'),
    offerType: 'service',
    image: '/vehicle-tabs/ranger.webp',
    sectionLabel: 'Service Specials',
  },
  {
    id: 'service-2',
    vehicleLine: 'Service and Pick-Up/Delivery',
    variantName: 'Service and Pick-Up/Delivery',
    category: 'service',
    sectionId: 'service',
    sectionTitle: getSectionLabel('service'),
    offerType: 'service',
    image: '/vehicle-tabs/ranger.webp',
    sectionLabel: 'Service Specials',
  },
]

export function getOffersByFilter(filter: FilterValue): SpecialOffer[] {
  if (filter === 'all') return SPECIAL_OFFERS
  return SPECIAL_OFFERS.filter((offer) => offer.category === filter)
}

export function groupOffersBySection(offers: SpecialOffer[]): Map<string, SpecialOffer[]> {
  const grouped = new Map<string, SpecialOffer[]>()
  for (const offer of offers) {
    const existing = grouped.get(offer.sectionId) ?? []
    existing.push(offer)
    grouped.set(offer.sectionId, existing)
  }
  return grouped
}
