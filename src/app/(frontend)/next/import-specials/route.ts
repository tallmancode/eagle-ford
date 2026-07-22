import { SPECIALS_SEED_DATA, type SpecialSeedEntry } from '@/lib/specials-seed/specials-data'
import { matchSpecialToCatalog } from '@/lib/specials-seed/matchSpecialToCatalog'
import { createSeedStreamResponse } from '@/lib/seed/createSeedStreamResponse'
import { fetchRemoteImage, uploadSeedImage, type ImageImportStats } from '@/lib/seed/media'
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
  variantIdsByKey: Map<string, string>
}> {
  const vehicleIdsBySlug = new Map<string, string>()
  const modelIdsByKey = new Map<string, string>()
  const variantIdsByKey = new Map<string, string>()

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

    const parent = model.vehicle
    const vehicleId =
      typeof parent === 'object' && parent !== null
        ? (parent.id as string)
        : (parent as string | undefined)
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
    const undotted = model.slug.replace(/\./g, '')
    if (undotted !== model.slug) {
      modelIdsByKey.set(`${vehicleSlug}::${undotted}`, model.id as string)
    }
  }

  const variants = await payload.find({
    collection: 'vehicle-variants',
    limit: 5000,
    depth: 1,
    draft: true,
    overrideAccess: true,
    pagination: false,
    req,
  })

  for (const variant of variants.docs) {
    if (!variant.slug) continue

    const modelRef = variant.model
    const modelId =
      typeof modelRef === 'object' && modelRef !== null
        ? (modelRef.id as string)
        : (modelRef as string | undefined)
    if (!modelId) continue

    let matchKey: string | null = null
    for (const [key, id] of modelIdsByKey.entries()) {
      if (id === modelId) {
        matchKey = key
        break
      }
    }
    if (!matchKey) continue

    variantIdsByKey.set(`${matchKey}::${variant.slug}`, variant.id as string)
    const undotted = variant.slug.replace(/\./g, '')
    if (undotted !== variant.slug) {
      variantIdsByKey.set(`${matchKey}::${undotted}`, variant.id as string)
    }
  }

  return { vehicleIdsBySlug, modelIdsByKey, variantIdsByKey }
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
  const alt = `${entry.labelOverride} — Eagle Ford special offer`

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
      linkedToVariant: 0,
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
        const categoryId = existing.docs[0].id as string
        await payload.update({
          collection: 'special-categories',
          id: categoryId,
          data: {
            enquiryForm: formId,
            sortOrder: index,
          },
          overrideAccess: true,
          req: payloadReq,
          context: { disableRevalidate: true },
        })
        categoryIdsByTitle.set(title, categoryId)
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
          enquiryForm: formId,
        },
        overrideAccess: true,
        req: payloadReq,
      })
      categoryIdsByTitle.set(title, created.id as string)
      result.categoriesCreated++
      log.info(`Created special category: ${title}`)
    }

    log.info('Loading vehicle catalog for specials links...')
    const { vehicleIdsBySlug, modelIdsByKey, variantIdsByKey } = await buildCatalogIdMaps(
      payload,
      payloadReq,
    )
    log.info(
      `Catalog ready — ${vehicleIdsBySlug.size} vehicles, ${modelIdsByKey.size} models, ${variantIdsByKey.size} variants`,
    )

    log.info(`Importing ${SPECIALS_SEED_DATA.length} specials from seed data...`)

    for (const [index, entry] of SPECIALS_SEED_DATA.entries()) {
      try {
        log.info(`[${index + 1}/${SPECIALS_SEED_DATA.length}] ${entry.labelOverride}`)

        const cardImageId = await uploadSpecialImage(
          entry,
          entry.cardImage,
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

        const catalog = matchSpecialToCatalog({
          labelOverride: entry.labelOverride,
          slug: entry.slug,
          offerType: entry.offerType,
          linkedVehicle: entry.linkedVehicle,
          linkedModel: entry.linkedModel,
          linkedVariant: entry.linkedVariant,
        })

        let vehicleSlug = catalog.vehicleSlug
        const modelSlug = catalog.modelSlug
        const variantSlug = catalog.variantSlug
        let vehicleId = vehicleSlug ? (vehicleIdsBySlug.get(vehicleSlug) ?? null) : null
        let modelId: string | null = null
        let variantId: string | null = null

        if (modelSlug) {
          if (vehicleSlug) {
            modelId = modelIdsByKey.get(`${vehicleSlug}::${modelSlug}`) ?? null
          }
          if (!modelId) {
            const undottedTarget = modelSlug.replace(/\./g, '')
            for (const [key, id] of modelIdsByKey.entries()) {
              const keyModel = key.includes('::') ? key.slice(key.lastIndexOf('::') + 2) : key
              if (keyModel === modelSlug || keyModel.replace(/\./g, '') === undottedTarget) {
                modelId = id
                const inferredVehicleSlug = key.slice(0, key.length - keyModel.length - 2)
                if (!vehicleSlug) {
                  vehicleSlug = inferredVehicleSlug
                  vehicleId = vehicleIdsBySlug.get(inferredVehicleSlug) ?? null
                }
                break
              }
            }
          }
        }

        if (variantSlug && modelId) {
          if (vehicleSlug && modelSlug) {
            variantId = variantIdsByKey.get(`${vehicleSlug}::${modelSlug}::${variantSlug}`) ?? null
          }
          if (!variantId) {
            const undottedTarget = variantSlug.replace(/\./g, '')
            for (const [key, id] of variantIdsByKey.entries()) {
              const keyVariant = key.slice(key.lastIndexOf('::') + 2)
              if (keyVariant === variantSlug || keyVariant.replace(/\./g, '') === undottedTarget) {
                variantId = id
                break
              }
            }
          }
        }

        if (vehicleSlug && variantSlug && variantId) {
          result.linkedToVariant++
        } else if (vehicleSlug && modelSlug && modelId) {
          result.linkedToModel++
        } else if (vehicleSlug && vehicleId) {
          result.linkedToVehicleOnly++
        }

        if (vehicleSlug && !vehicleId) {
          log.warn(`No vehicle found for slug "${vehicleSlug}" — run Import Vehicle Catalog first`)
        } else if (modelSlug && !modelId) {
          log.warn(`No model found for "${vehicleSlug ?? '?'}/${modelSlug}" — linking vehicle only`)
        } else if (variantSlug && !variantId) {
          log.warn(
            `No variant found for "${vehicleSlug ?? '?'}/${modelSlug ?? '?'}/${variantSlug}" — linking model only`,
          )
        }

        const categoryId = categoryIdsByTitle.get(entry.specialsCategory)
        if (!categoryId) {
          throw new Error(`Missing special category "${entry.specialsCategory}"`)
        }

        const specialData = {
          title: entry.labelOverride,
          offerType: entry.offerType,
          category: categoryId,
          cardImage: cardImageId,
          ...(entry.specialOffer != null ? { specialOffer: entry.specialOffer } : {}),
          ...(entry.bestSaving != null ? { bestSaving: entry.bestSaving } : {}),
          ...(entry.paymentFrom != null ? { paymentFrom: entry.paymentFrom } : {}),
          ...(vehicleId ? { vehicle: vehicleId } : { vehicle: null }),
          ...(modelId ? { vehicleModel: modelId } : { vehicleModel: null }),
          ...(variantId ? { vehicleVariant: variantId } : { vehicleVariant: null }),
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
