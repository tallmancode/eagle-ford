import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Media, Vehicle, VehicleCategory, VehicleModel } from '@/payload-types'
import type { VehicleMegaMenuData, VehicleMegaMenuItem } from '@/lib/data/vehicleMegaMenuTypes'

function getModelCardImage(model: VehicleModel, vehicle: Vehicle): string | Media | null {
  return model.featureImage ?? model.heroImage ?? vehicle.featureImage ?? vehicle.heroImage ?? null
}

async function fetchVehicleMegaMenuData(): Promise<VehicleMegaMenuData> {
  const payload = await getPayload({ config: configPromise })

  const [categoriesResult, vehiclesResult, modelsResult] = await Promise.all([
    payload.find({
      collection: 'vehicle-categories',
      sort: 'sortOrder',
      limit: 100,
      overrideAccess: false,
      pagination: false,
    }),
    payload.find({
      collection: 'vehicles',
      sort: 'sortOrder',
      depth: 1,
      limit: 1000,
      draft: false,
      overrideAccess: false,
      pagination: false,
    }),
    payload.find({
      collection: 'vehicle-models',
      sort: 'sortOrder',
      depth: 2,
      limit: 1000,
      draft: false,
      overrideAccess: false,
      pagination: false,
    }),
  ])

  const categories = categoriesResult.docs.map((cat) => ({
    id: cat.id,
    title: cat.title,
    slug: cat.slug,
  }))

  const vehicleItems: VehicleMegaMenuItem[] = []

  for (const vehicle of vehiclesResult.docs) {
    const category = vehicle.category as VehicleCategory | null
    if (!category || typeof category === 'string') continue

    vehicleItems.push({
      id: vehicle.id,
      name: vehicle.name,
      slug: vehicle.slug,
      featureImage: vehicle.featureImage ?? vehicle.heroImage ?? null,
      startingPrice: vehicle.startingPrice ?? null,
      priceDisclaimer: vehicle.priceDisclaimer ?? null,
      categorySlug: category.slug,
      categoryTitle: category.title,
    })
  }

  const modelItems: VehicleMegaMenuItem[] = []

  for (const model of modelsResult.docs) {
    const vehicle = model.vehicle as Vehicle | null
    if (!vehicle || typeof vehicle === 'string') continue

    const category = vehicle.category as VehicleCategory | null
    if (!category || typeof category === 'string') continue

    modelItems.push({
      id: model.id,
      name: model.name,
      slug: vehicle.slug,
      modelSlug: model.slug,
      featureImage: getModelCardImage(model, vehicle),
      startingPrice: model.price ?? null,
      priceDisclaimer: vehicle.priceDisclaimer ?? null,
      categorySlug: category.slug,
      categoryTitle: category.title,
    })
  }

  const categoriesWithVehicles = categories.filter((cat) =>
    vehicleItems.some((item) => item.categorySlug === cat.slug),
  )

  const categoriesWithModels = categories.filter((cat) =>
    modelItems.some((item) => item.categorySlug === cat.slug),
  )

  return {
    vehicles: {
      categories: categoriesWithVehicles,
      items: vehicleItems,
    },
    models: {
      categories: categoriesWithModels,
      items: modelItems,
    },
  }
}

export const getVehicleMegaMenuData = unstable_cache(
  fetchVehicleMegaMenuData,
  ['vehicle-mega-menu'],
  {
    tags: ['vehicles', 'vehicle-models'],
  },
)
