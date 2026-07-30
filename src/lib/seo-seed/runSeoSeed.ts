import type { Payload, PayloadRequest } from 'payload'
import * as Sentry from '@sentry/nextjs'

import type { SeedLogger } from '@/lib/seed/SeedLogger'
import {
  PAGE_SEO_SEED,
  VEHICLE_MODEL_SEO_SEED,
  VEHICLE_SEO_SEED,
} from '@/lib/seo-seed/seo-seed-data'

export type SeoSeedResult = {
  pagesUpdated: number
  pagesSkipped: number
  vehiclesUpdated: number
  vehiclesSkipped: number
  modelsUpdated: number
  modelsSkipped: number
  errors: number
}

function relationId(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id: unknown }).id
    return typeof id === 'string' ? id : undefined
  }
  return undefined
}

export async function runSeoSeed(
  payload: Payload,
  req: PayloadRequest,
  log: SeedLogger,
): Promise<SeoSeedResult> {
  const result: SeoSeedResult = {
    pagesUpdated: 0,
    pagesSkipped: 0,
    vehiclesUpdated: 0,
    vehiclesSkipped: 0,
    modelsUpdated: 0,
    modelsSkipped: 0,
    errors: 0,
  }

  log.info('Starting SEO seed (update existing documents by slug only)...')

  // --- Pages (plugin-seo: meta.title / meta.description) ---
  log.info(`Pages: ${PAGE_SEO_SEED.length} SEO entries`)
  for (const entry of PAGE_SEO_SEED) {
    try {
      const found = await payload.find({
        collection: 'pages',
        where: { slug: { equals: entry.slug } },
        limit: 1,
        depth: 0,
        draft: true,
        overrideAccess: true,
        pagination: false,
        req,
      })
      const doc = found.docs[0]
      if (!doc) {
        log.warn(`[pages] No document with slug "${entry.slug}" — skipping`)
        result.pagesSkipped++
        continue
      }

      await payload.update({
        collection: 'pages',
        id: doc.id,
        data: {
          meta: {
            title: entry.title,
            description: entry.description,
            image: relationId(doc.meta?.image),
          },
        },
        draft: false,
        overrideAccess: true,
        req,
        context: { disableRevalidate: true },
      })
      log.info(`[pages] Updated SEO for "${entry.slug}"`)
      result.pagesUpdated++
    } catch (error) {
      result.errors++
      const message = error instanceof Error ? error.message : String(error)
      log.error(`[pages] Failed "${entry.slug}": ${message}`)
      Sentry.captureException(error, {
        tags: { seed: 'seo', collection: 'pages', slug: entry.slug },
      })
    }
  }

  // --- Vehicles (meta.metaTitle / meta.metaDescription) ---
  log.info(`Vehicles: ${VEHICLE_SEO_SEED.length} SEO entries`)
  for (const entry of VEHICLE_SEO_SEED) {
    try {
      const found = await payload.find({
        collection: 'vehicles',
        where: { slug: { equals: entry.slug } },
        limit: 1,
        depth: 0,
        draft: true,
        overrideAccess: true,
        pagination: false,
        req,
      })
      const doc = found.docs[0]
      if (!doc) {
        log.warn(`[vehicles] No document with slug "${entry.slug}" — skipping`)
        result.vehiclesSkipped++
        continue
      }

      await payload.update({
        collection: 'vehicles',
        id: doc.id,
        data: {
          meta: {
            metaTitle: entry.metaTitle,
            metaDescription: entry.metaDescription,
            metaImage: relationId(doc.meta?.metaImage),
          },
        },
        draft: false,
        overrideAccess: true,
        req,
        context: { disableRevalidate: true },
      })
      log.info(`[vehicles] Updated SEO for "${entry.slug}"`)
      result.vehiclesUpdated++
    } catch (error) {
      result.errors++
      const message = error instanceof Error ? error.message : String(error)
      log.error(`[vehicles] Failed "${entry.slug}": ${message}`)
      Sentry.captureException(error, {
        tags: { seed: 'seo', collection: 'vehicles', slug: entry.slug },
      })
    }
  }

  // --- Vehicle models (scoped by parent vehicle slug) ---
  log.info(`Vehicle models: ${VEHICLE_MODEL_SEO_SEED.length} SEO entries`)

  const vehicleIdBySlug = new Map<string, string>()
  const vehicles = await payload.find({
    collection: 'vehicles',
    limit: 1000,
    depth: 0,
    draft: true,
    overrideAccess: true,
    pagination: false,
    req,
    select: { slug: true },
  })
  for (const vehicle of vehicles.docs) {
    if (vehicle.slug) vehicleIdBySlug.set(vehicle.slug, vehicle.id as string)
  }

  for (const entry of VEHICLE_MODEL_SEO_SEED) {
    const label = `${entry.vehicleSlug}/${entry.modelSlug}`
    try {
      const vehicleId = vehicleIdBySlug.get(entry.vehicleSlug)
      if (!vehicleId) {
        log.warn(
          `[vehicle-models] Parent vehicle "${entry.vehicleSlug}" not found — skipping "${entry.modelSlug}"`,
        )
        result.modelsSkipped++
        continue
      }

      const models = await payload.find({
        collection: 'vehicle-models',
        where: {
          and: [{ slug: { equals: entry.modelSlug } }, { vehicle: { equals: vehicleId } }],
        },
        limit: 1,
        depth: 0,
        draft: true,
        overrideAccess: true,
        pagination: false,
        req,
      })

      const doc = models.docs[0]
      if (!doc) {
        log.warn(`[vehicle-models] No model "${label}" — skipping`)
        result.modelsSkipped++
        continue
      }

      await payload.update({
        collection: 'vehicle-models',
        id: doc.id,
        data: {
          meta: {
            metaTitle: entry.metaTitle,
            metaDescription: entry.metaDescription,
            metaImage: relationId(doc.meta?.metaImage),
          },
        },
        draft: false,
        overrideAccess: true,
        req,
        context: { disableRevalidate: true },
      })
      log.info(`[vehicle-models] Updated SEO for "${label}"`)
      result.modelsUpdated++
    } catch (error) {
      result.errors++
      const message = error instanceof Error ? error.message : String(error)
      log.error(`[vehicle-models] Failed "${label}": ${message}`)
      Sentry.captureException(error, {
        tags: {
          seed: 'seo',
          collection: 'vehicle-models',
          vehicleSlug: entry.vehicleSlug,
          modelSlug: entry.modelSlug,
        },
      })
    }
  }

  log.info(
    `SEO seed finished — pages ${result.pagesUpdated} updated / ${result.pagesSkipped} skipped; ` +
      `vehicles ${result.vehiclesUpdated}/${result.vehiclesSkipped}; ` +
      `models ${result.modelsUpdated}/${result.modelsSkipped}; errors ${result.errors}`,
  )

  if (result.errors > 0) {
    await Sentry.flush(2000)
  }

  return result
}
