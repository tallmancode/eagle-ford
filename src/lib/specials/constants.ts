export const SPECIAL_CATEGORIES = [
  { label: 'Bakkies', value: 'bakkies' },
  { label: 'Cars', value: 'cars' },
  { label: 'SUV', value: 'suv' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Parts', value: 'parts' },
  { label: 'Service', value: 'service' },
] as const

export type SpecialCategory = (typeof SPECIAL_CATEGORIES)[number]['value']

export const OFFER_TYPES = [
  { label: 'Price Point Specials', value: 'price-point' },
  { label: 'Payment Options', value: 'payment' },
  { label: 'Service Specials', value: 'service' },
  { label: 'Enquire Now', value: 'enquiry' },
] as const

export type OfferType = (typeof OFFER_TYPES)[number]['value']

export const SPECIAL_SECTIONS = [
  {
    label: 'Next Level Ranger Double Cab Offers',
    value: 'ranger-dc',
    image: '/vehicle-tabs/next-level-ranger.webp',
  },
  {
    label: 'New Level Territory Offers',
    value: 'territory',
    image: '/vehicle-tabs/new-level-territory.webp',
  },
  {
    label: 'Next Level Everest Offers',
    value: 'everest-nl',
    image: '/vehicle-tabs/next-level-everest.webp',
  },
  {
    label: 'Ranger Raptor Offers',
    value: 'raptor',
    image: '/vehicle-tabs/ranger-raptor.webp',
  },
  {
    label: 'Next Level Super Cab Ranger Offers',
    value: 'ranger-sc',
    image: '/vehicle-tabs/ranger-super-cab.webp',
  },
  {
    label: 'Next Level Ranger Single Cab Offers',
    value: 'ranger-single',
    image: '/vehicle-tabs/ranger-single-cab.webp',
  },
  {
    label: 'Mustang Offers',
    value: 'mustang',
    image: '/vehicle-tabs/mustang-gt.webp',
  },
  {
    label: 'Transit Custom Offers',
    value: 'transit',
    image: '/vehicle-tabs/new-transit-custom.webp',
  },
  {
    label: 'Tourneo Custom Offers',
    value: 'tourneo',
    image: '/vehicle-tabs/new-tourneo-custom.webp',
  },
  {
    label: 'Service Specials',
    value: 'service',
    image: '/vehicle-tabs/ranger.webp',
  },
] as const

export type SpecialSectionId = (typeof SPECIAL_SECTIONS)[number]['value']

export function getSectionLabel(sectionId: SpecialSectionId): string {
  return SPECIAL_SECTIONS.find((s) => s.value === sectionId)?.label ?? sectionId
}

export function getOfferTypeLabel(offerType: OfferType): string {
  return OFFER_TYPES.find((t) => t.value === offerType)?.label ?? offerType
}

export const FILTER_TABS = [
  { value: 'all', label: 'All' },
  ...SPECIAL_CATEGORIES.map(({ value, label }) => ({ value, label })),
] as const

export type FilterValue = (typeof FILTER_TABS)[number]['value']
