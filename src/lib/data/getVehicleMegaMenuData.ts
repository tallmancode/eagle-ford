import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Media, Vehicle, VehicleCategory, VehicleModel } from '@/payload-types'
import type { VehicleMegaMenuData, VehicleMegaMenuItem } from '@/lib/data/vehicleMegaMenuTypes'
import { getModelStartingPrice } from '@/lib/utils/vehicleModel'

type CategoryRef = Pick<VehicleCategory, 'id' | 'title' | 'slug'>

function getModelCardImage(model: VehicleModel, vehicle: Vehicle): string | Media | null {
  return model.featureImage ?? model.heroImage ?? vehicle.featureImage ?? vehicle.heroImage ?? null
}

function resolveCategory(
  category: Vehicle['category'] | null | undefined,
  categoryById: Map<string, CategoryRef>,
): CategoryRef | null {
  if (!category) return null
  if (typeof category === 'object') {
    return { id: category.id, title: category.title, slug: category.slug }
  }
  return categoryById.get(category) ?? null
}

function resolveVehicle(
  parent: string | Vehicle | null | undefined,
  vehicleById: Map<string, Vehicle>,
): Vehicle | null {
  if (!parent) return null
  if (typeof parent === 'object') {
    return vehicleById.get(parent.id) ?? parent
  }
  return vehicleById.get(parent) ?? null
}

async function fetchVehicleMegaMenuData(): Promise<VehicleMegaMenuData> {
  const payload = await getPayload({ config: configPromise })

  const [categoriesResult, vehiclesResult, modelsResult, variantsResult] = await Promise.all([
    payload.find({
      collection: 'vehicle-categories',
      sort: 'sortOrder',
      limit: 100,
      overrideAccess: false,
      pagination: false,
      select: {
        id: true,
        title: true,
        slug: true,
        sortOrder: true,
      },
    }),
    payload.find({
      collection: 'vehicles',
      sort: 'sortOrder',
      depth: 1,
      limit: 200,
      draft: false,
      overrideAccess: false,
      pagination: false,
      select: {
        id: true,
        name: true,
        slug: true,
        sortOrder: true,
        featureImage: true,
        heroImage: true,
        startingPrice: true,
        priceDisclaimer: true,
        category: true,
        showInMegaMenu: true,
      },
    }),
    payload.find({
      collection: 'vehicle-models',
      sort: 'sortOrder',
      depth: 2,
      limit: 500,
      draft: false,
      overrideAccess: false,
      pagination: false,
      where: {
        showInMegaMenu: {
          equals: true,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        sortOrder: true,
        featureImage: true,
        heroImage: true,
        vehicle: true,
        showInMegaMenu: true,
      },
    }),
    payload.find({
      collection: 'vehicle-variants',
      sort: 'sortOrder',
      depth: 0,
      limit: 2000,
      draft: false,
      overrideAccess: false,
      pagination: false,
      select: {
        id: true,
        price: true,
        model: true,
      },
    }),
  ])

  const categories = categoriesResult.docs.map((cat) => ({
    id: cat.id,
    title: cat.title,
    slug: cat.slug,
  }))

  const categoryById = new Map(categories.map((cat) => [cat.id, cat]))
  const vehicleById = new Map(
    vehiclesResult.docs.map((vehicle) => [vehicle.id, vehicle as Vehicle]),
  )

  const variantsByModelId = new Map<string, typeof variantsResult.docs>()
  for (const variant of variantsResult.docs) {
    const modelId =
      typeof variant.model === 'object' && variant.model !== null
        ? String(variant.model.id)
        : String(variant.model)
    const list = variantsByModelId.get(modelId) ?? []
    list.push(variant)
    variantsByModelId.set(modelId, list)
  }

  const items: VehicleMegaMenuItem[] = []

  for (const vehicle of vehiclesResult.docs) {
    if (vehicle.showInMegaMenu === false) continue

    const category = resolveCategory(vehicle.category, categoryById)
    if (!category) continue

    items.push({
      id: `vehicle-${vehicle.id}`,
      name: vehicle.name,
      slug: vehicle.slug,
      featureImage: vehicle.featureImage ?? vehicle.heroImage ?? null,
      startingPrice: vehicle.startingPrice ?? null,
      priceDisclaimer: vehicle.priceDisclaimer ?? null,
      categorySlug: category.slug,
      categoryTitle: category.title,
      sortOrder: vehicle.sortOrder ?? 0,
    })
  }

  for (const model of modelsResult.docs) {
    const vehicle = resolveVehicle(model.vehicle, vehicleById)
    if (!vehicle) continue

    const category = resolveCategory(vehicle.category, categoryById)
    if (!category) continue

    items.push({
      id: `model-${model.id}`,
      name: model.name,
      slug: vehicle.slug,
      modelSlug: model.slug,
      featureImage: getModelCardImage(model, vehicle),
      startingPrice: getModelStartingPrice(variantsByModelId.get(String(model.id)) ?? []),
      priceDisclaimer: vehicle.priceDisclaimer ?? null,
      categorySlug: category.slug,
      categoryTitle: category.title,
      sortOrder: model.sortOrder ?? 0,
    })
  }

  items.sort((a, b) => {
    if (a.categorySlug !== b.categorySlug) return 0
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
    // Families before trims when sort order ties (stable across categories)
    const aIsModel = Boolean(a.modelSlug)
    const bIsModel = Boolean(b.modelSlug)
    if (aIsModel !== bIsModel) return aIsModel ? 1 : -1
    return a.name.localeCompare(b.name)
  })

  const categoriesWithItems = categories.filter((cat) =>
    items.some((item) => item.categorySlug === cat.slug),
  )

  return {
    categories: categoriesWithItems,
    items,
  }
}

export const getVehicleMegaMenuData = unstable_cache(
  fetchVehicleMegaMenuData,
  ['vehicle-mega-menu'],
  {
    tags: ['vehicles', 'vehicle-models', 'vehicle-variants'],
  },
)
