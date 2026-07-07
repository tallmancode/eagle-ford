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
}

export type VehicleMegaMenuData = {
  vehicles: {
    categories: { id: string; title: string; slug: string }[]
    items: VehicleMegaMenuItem[]
  }
  models: {
    categories: { id: string; title: string; slug: string }[]
    items: VehicleMegaMenuItem[]
  }
}

export function navNeedsVehicleMegaMenu(links?: NavLinks | null): boolean {
  if (!links?.length) return false
  return links.some((link) => link.type === 'vehicleMegaMenu')
}

export function getMegaMenuDataForMode(
  data: VehicleMegaMenuData,
  displayMode?: 'vehicles' | 'models' | null,
) {
  return displayMode === 'models' ? data.models : data.vehicles
}
