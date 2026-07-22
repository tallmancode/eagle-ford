import type { Media, NavLinks } from '@/payload-types'

export type VehicleMegaMenuItem = {
  id: string
  name: string
  slug: string
  modelSlug?: string
  featureImage: string | Media | null
  startingPrice: number | null
  priceDisclaimer?: string | null
  categorySlug: string
  categoryTitle: string
  sortOrder: number
}

export type VehicleMegaMenuData = {
  categories: { id: string; title: string; slug: string }[]
  items: VehicleMegaMenuItem[]
}

export function navNeedsVehicleMegaMenu(links?: NavLinks | null): boolean {
  if (!links?.length) return false
  return links.some((link) => link.type === 'vehicleMegaMenu')
}
