import { buildSpecialContent } from '@/lib/specials-seed/buildSpecialContent'
import { SPECIALS_SEED_DATA, type SpecialSeedEntry } from '@/lib/specials-seed/specials-data'
import { matchSpecialToCatalog } from '@/lib/specials-seed/matchSpecialToCatalog'
import { createSeedStreamResponse } from '@/lib/seed/createSeedStreamResponse'
import { fetchRemoteImage, uploadSeedImage, type ImageImportStats } from '@/lib/seed/media'
import { getVehicleModelPath } from '@/lib/utils/vehicleModel'
import { buildSpecialMediaFilename } from '@/lib/vehicle-seed-images'
import config from '@payload-config'
import { headers } from 'next/headers'
import { createLocalReq, getPayload, type Payload, type PayloadRequest } from 'payload'

export const maxDuration = 300

const SPECIAL_OFFER_FORM_TITLE = 'Special Offer Enquiry Form'

function fileExtFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname
    const ext = pathname.split('.').pop()?.toLowerCase()
    if (!ext || ext.length > 5) return '.webp'
    return ext.startsWith('.') ? ext : `.${ext}`
  } catch {
    return '.webp'
  }
}

async function resolveSpecialOfferFormId(payload: Payload): Promise<string> {
  const forms = await payload.find({
    collection: 'forms',
    where: { title: { equals: SPECIAL_OFFER_FORM_TITLE } },
    limit: 1,
    depth: 0,
  })

  if (forms.totalDocs === 0) {
    throw new Error(
      `Missing "${SPECIAL_OFFER_FORM_TITLE}". Run "Create Special Offer Enquiry Form" first.`,
    )
  }

  return forms.docs[0].id as string
}

async function buildCatalogIdMaps(
  payload: Payload,
  req: PayloadRequest,
): Promise<{
  vehicleIdsBySlug: Map<string, string>
  modelIdsByKey: Map<string, string>
}> {
  const vehicleIdsBySlug = new Map<string, string>()
  const modelIdsByKey = new Map<string, string>()

  const vehicles = await payload.find({
    collection: 'vehicles',
    limit: 1000,
    depth: 0,
    draft: true,
    overrideAccess: true,
    pagination: false,
    req,
  })

  for (const vehicle of vehicles.docs) {
    if (vehicle.slug) vehicleIdsBySlug.set(vehicle.slug, vehicle.id as string)
  }

  const models = await payload.find({
    collection: 'vehicle-models',
    limit: 2000,
    depth: 0,
    draft: true,
    overrideAccess: true,
    pagination: false,
    req,
  })

  for (const model of models.docs) {
    if (!model.slug) continue
    const vehicleId =
      typeof model.vehicle === 'object' && model.vehicle !== null
        ? (model.vehicle.id as string)
        : (model.vehicle as string | undefined)
    if (!vehicleId) continue

    let vehicleSlug: string | undefined
    for (const [slug, id] of vehicleIdsBySlug.entries()) {
      if (id === vehicleId) {
        vehicleSlug = slug
        break
      }
    }
    if (!vehicleSlug) continue
    modelIdsByKey.set(`${vehicleSlug}::${model.slug}`, model.id as string)
  }

  return { vehicleIdsBySlug, modelIdsByKey }
}

async function uploadSpecialImage(
  entry: SpecialSeedEntry,
  imageUrl: string,
  role: 'card' | 'detail',
  stats: ImageImportStats,
  payload: Payload,
  req: PayloadRequest,
): Promise<string | null> {
  const remote = await fetchRemoteImage(imageUrl)
  if (!remote) {
    stats.imagesMissing++
    return null
  }

  const ext = fileExtFromUrl(imageUrl)
  const mediaFilename = buildSpecialMediaFilename(entry.slug, role, ext)
  const alt = `${entry.title} — Eagle Ford special offer`

  return uploadSeedImage(payload, req, remote, mediaFilename, alt, stats)
}

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  const payloadReq = await createLocalReq({ user }, payload)

  return createSeedStreamResponse(async (log) => {
    const result = {
      categoriesCreated: 0,
      categoriesSkipped: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      imagesUploaded: 0,
      imagesMissing: 0,
      linkedToModel: 0,
      linkedToVehicleOnly: 0,
      errors: 0,
    }

    const stats: ImageImportStats = {
      imagesUploaded: 0,
      imagesMissing: 0,
    }

    log.info('Resolving Special Offer Enquiry Form...')
    const formId = await resolveSpecialOfferFormId(payload)

    log.info('Seeding special categories...')
    const categoryIdsByTitle = new Map<string, string>()
    const categoryTitles = [...new Set(SPECIALS_SEED_DATA.map((entry) => entry.specialsCategory))]

    for (const [index, title] of categoryTitles.entries()) {
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      const existing = await payload.find({
        collection: 'special-categories',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
        req: payloadReq,
      })

      if (existing.totalDocs > 0) {
        categoryIdsByTitle.set(title, existing.docs[0].id as string)
        result.categoriesSkipped++
        continue
      }

      const created = await payload.create({
        collection: 'special-categories',
        data: {
          title,
          slug,
          generateSlug: false,
          sortOrder: index,
        },
        overrideAccess: true,
        req: payloadReq,
      })
      categoryIdsByTitle.set(title, created.id as string)
      result.categoriesCreated++
      log.info(`Created special category: ${title}`)
    }

    log.info('Loading vehicle catalog for specials links...')
    const { vehicleIdsBySlug, modelIdsByKey } = await buildCatalogIdMaps(payload, payloadReq)
    log.info(`Catalog ready — ${vehicleIdsBySlug.size} vehicles, ${modelIdsByKey.size} models`)

    log.info(`Importing ${SPECIALS_SEED_DATA.length} specials from seed data...`)

    for (const [index, entry] of SPECIALS_SEED_DATA.entries()) {
      try {
        log.info(`[${index + 1}/${SPECIALS_SEED_DATA.length}] ${entry.title}`)

        const cardImageId = await uploadSpecialImage(
          entry,
          entry.cardImageUrl,
          'card',
          stats,
          payload,
          payloadReq,
        )

        if (!cardImageId) {
          log.warn(`Skipping ${entry.slug} — card image could not be uploaded`)
          result.skipped++
          continue
        }

        const detailImageId = await uploadSpecialImage(
          entry,
          entry.detailImageUrl,
          'detail',
          stats,
          payload,
          payloadReq,
        )

        const catalog = matchSpecialToCatalog(entry)
        const vehicleId = catalog.vehicleSlug
          ? (vehicleIdsBySlug.get(catalog.vehicleSlug) ?? null)
          : null
        const modelId =
          catalog.vehicleSlug && catalog.modelSlug
            ? (modelIdsByKey.get(`${catalog.vehicleSlug}::${catalog.modelSlug}`) ?? null)
            : null

        let modelHref: string | null = null
        if (catalog.vehicleSlug && catalog.modelSlug && modelId) {
          modelHref = getVehicleModelPath(catalog.vehicleSlug, catalog.modelSlug)
          result.linkedToModel++
        } else if (catalog.vehicleSlug && vehicleId) {
          modelHref = `/vehicles/${catalog.vehicleSlug}`
          result.linkedToVehicleOnly++
        }

        if (catalog.vehicleSlug && !vehicleId) {
          log.warn(
            `No vehicle found for slug "${catalog.vehicleSlug}" — run Import Vehicle Catalog first`,
          )
        } else if (catalog.modelSlug && !modelId) {
          log.warn(
            `No model found for "${catalog.vehicleSlug}/${catalog.modelSlug}" — linking vehicle only`,
          )
        }

        const content = buildSpecialContent({
          title: entry.title,
          subheading: entry.contentSubheading,
          bodyHtml: entry.bodyHtml,
          detailImageId: detailImageId ?? cardImageId,
          formId,
          modelHref,
        })
        const categoryId = categoryIdsByTitle.get(entry.specialsCategory)
        if (!categoryId) {
          throw new Error(`Missing special category "${entry.specialsCategory}"`)
        }

        const specialData = {
          title: entry.title,
          subTitle: entry.subTitle,
          offerType: entry.offerType,
          category: categoryId,
          cardImage: cardImageId,
          ...(entry.pricingLabel ? { pricingLabel: entry.pricingLabel } : {}),
          ...(entry.specialOffer != null ? { specialOffer: entry.specialOffer } : {}),
          ...(entry.bestSaving != null ? { bestSaving: entry.bestSaving } : {}),
          ...(vehicleId ? { vehicle: vehicleId } : { vehicle: null }),
          ...(modelId ? { vehicleModel: modelId } : { vehicleModel: null }),
          content,
          sortOrder: entry.sortOrder,
          slug: entry.slug,
          generateSlug: false,
          _status: 'published' as const,
        }

        const existing = await payload.find({
          collection: 'specials',
          where: { slug: { equals: entry.slug } },
          limit: 1,
          draft: true,
          overrideAccess: true,
          req: payloadReq,
        })

        if (existing.totalDocs > 0) {
          await payload.update({
            collection: 'specials',
            id: existing.docs[0].id,
            data: specialData,
            draft: false,
            req: payloadReq,
            context: { disableRevalidate: true },
          })
          result.updated++
          log.info(`Updated special: ${entry.slug}`)
        } else {
          await payload.create({
            collection: 'specials',
            draft: false,
            data: specialData,
            req: payloadReq,
            context: { disableRevalidate: true },
          })
          result.created++
          log.info(`Created special: ${entry.slug}`)
        }
      } catch (error) {
        result.errors++
        const message = error instanceof Error ? error.message : 'Unknown error'
        log.error(`Failed to import ${entry.slug}: ${message}`)
      }
    }

    result.imagesUploaded = stats.imagesUploaded
    result.imagesMissing = stats.imagesMissing

    log.info(
      `Import complete — created: ${result.created}, updated: ${result.updated}, skipped: ${result.skipped}, linked to model: ${result.linkedToModel}, linked to vehicle only: ${result.linkedToVehicleOnly}, images uploaded: ${result.imagesUploaded}, images missing: ${result.imagesMissing}, errors: ${result.errors}`,
    )

    return result
  }, payload.logger)
}
