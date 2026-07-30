import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { SpecialCategory } from '@/payload-types'

function getCategoryId(category: string | { id: string }): string {
  return typeof category === 'object' ? category.id : category
}

export async function getVehicleSpecialCategories(vehicleId: string): Promise<SpecialCategory[]> {
  const payload = await getPayload({ config: configPromise })
  const specialsResult = await payload.find({
    collection: 'specials',
    where: { vehicle: { equals: vehicleId } },
    draft: false,
    overrideAccess: false,
    pagination: false,
    depth: 0,
    select: {
      category: true,
    },
  })

  const categoryIds = [
    ...new Set(
      specialsResult.docs
        .map((special) => (special.category ? getCategoryId(special.category) : null))
        .filter((id): id is string => Boolean(id)),
    ),
  ]

  if (categoryIds.length === 0) return []

  const categoriesResult = await payload.find({
    collection: 'special-categories',
    where: { id: { in: categoryIds } },
    sort: 'sortOrder',
    draft: false,
    overrideAccess: false,
    pagination: false,
    depth: 1,
  })

  return categoriesResult.docs
}
