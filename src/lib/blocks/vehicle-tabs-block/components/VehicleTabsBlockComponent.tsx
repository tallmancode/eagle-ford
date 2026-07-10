import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { VehicleCategory, VehicleTabsBlock } from '@/payload-types'
import { VehicleTabsClient, type VehicleTabItem } from './VehicleTabsClient'

export async function VehicleTabsBlockComponent(_props: VehicleTabsBlock) {
  const payload = await getPayload({ config: configPromise })

  const [categoriesResult, vehiclesResult] = await Promise.all([
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
  ])

  const categories = categoriesResult.docs.map((cat) => ({
    id: cat.id,
    title: cat.title,
    slug: cat.slug,
  }))

  const vehicles: VehicleTabItem[] = []

  for (const vehicle of vehiclesResult.docs) {
    const category = vehicle.category as VehicleCategory | null
    if (!category || typeof category === 'string') continue

    vehicles.push({
      id: vehicle.id,
      name: vehicle.name,
      slug: vehicle.slug,
      ...(vehicle.badge ? { badge: vehicle.badge } : {}),
      featureImage: vehicle.featureImage ?? vehicle.heroImage ?? null,
      categorySlug: category.slug,
    })
  }

  return <VehicleTabsClient categories={categories} vehicles={vehicles} />
}
