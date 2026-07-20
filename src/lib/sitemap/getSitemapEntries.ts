import type { MetadataRoute } from 'next'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import config from '@payload-config'
import { getVehicleModelPath } from '@/lib/utils/vehicleModel'

import { getSiteUrl } from './getSiteUrl'

const publishedWhere = {
  _status: {
    equals: 'published' as const,
  },
}

function toSitemapEntry(url: string, lastModified?: string | null): MetadataRoute.Sitemap[number] {
  return {
    url,
    lastModified: lastModified ?? new Date(),
  }
}

const getCachedSitemapEntries = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const payload = await getPayload({ config })
    const siteUrl = getSiteUrl()
    const dateFallback = new Date().toISOString()

    const [pages, vehicles, vehicleModels, specialCategories] = await Promise.all([
      payload.find({
        collection: 'pages',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        where: publishedWhere,
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      payload.find({
        collection: 'vehicles',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        where: publishedWhere,
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      payload.find({
        collection: 'vehicle-models',
        overrideAccess: false,
        draft: false,
        depth: 1,
        limit: 1000,
        pagination: false,
        where: publishedWhere,
        select: {
          slug: true,
          updatedAt: true,
          vehicle: true,
        },
      }),
      payload.find({
        collection: 'special-categories',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
    ])

    const pageEntries = pages.docs
      .filter((page) => Boolean(page.slug))
      .map((page) =>
        toSitemapEntry(
          page.slug === 'home' ? `${siteUrl}/` : `${siteUrl}/${page.slug}`,
          page.updatedAt ?? dateFallback,
        ),
      )

    const vehicleEntries = vehicles.docs
      .filter((vehicle) => Boolean(vehicle.slug))
      .map((vehicle) =>
        toSitemapEntry(`${siteUrl}/vehicles/${vehicle.slug}`, vehicle.updatedAt ?? dateFallback),
      )

    const vehicleModelEntries = vehicleModels.docs.flatMap((model) => {
      const vehicle = model.vehicle
      if (!vehicle || typeof vehicle === 'string' || !vehicle.slug || !model.slug) {
        return []
      }

      return [
        toSitemapEntry(
          `${siteUrl}${getVehicleModelPath(vehicle.slug, model.slug)}`,
          model.updatedAt ?? dateFallback,
        ),
      ]
    })

    const specialCategoryEntries = specialCategories.docs
      .filter((category) => Boolean(category.slug))
      .map((category) =>
        toSitemapEntry(`${siteUrl}/specials/${category.slug}`, category.updatedAt ?? dateFallback),
      )

    return [...pageEntries, ...vehicleEntries, ...vehicleModelEntries, ...specialCategoryEntries]
  },
  ['sitemap'],
  {
    tags: ['sitemap'],
  },
)

export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  return getCachedSitemapEntries()
}
