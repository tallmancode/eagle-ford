import { createSeedStreamResponse } from '@/lib/seed/createSeedStreamResponse'
import { normalizeCatalogSlug } from '@/lib/seed/normalizeCatalogSlug'
import {
  fetchRemoteImage,
  findSeedMediaId,
  uploadSeedImage,
  type ImageImportStats,
} from '@/lib/seed/media'
import { buildSeedMediaFilename, type SeedImage } from '@/lib/vehicle-seed-images'
import {
  CATEGORY_DATA,
  VEHICLE_CATALOG_DATA as CATALOG_DATA,
} from '@/lib/vehicle-seed/vehicle-catalog-data'
import { ensureVehicleSlugIndexes } from '@/lib/vehicle-catalog/ensureVehicleSlugIndexes'
import type {
  ColourDef,
  EngineOptionDef,
  FeatureDef,
  GalleryDef,
  ModelDef,
  SpecHighlightDef,
} from '@/lib/vehicle-seed/vehicle-catalog-types'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import type { Payload, PayloadRequest } from 'payload'

export const maxDuration = 300

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type BuiltColour = {
  colourName: string
  colourNote?: string
  colourSwatch?: string
}

type BuiltVehicleImages = {
  heroMediaId: string | null
  featureMediaId: string | null
  galleryIds: string[]
  colours: BuiltColour[]
}

function seoHeroImageAlt(vehicleName: string): string {
  return `${vehicleName} hero banner — new Ford model at Eagle Ford South Africa`
}

function seoFeatureCardImageAlt(vehicleName: string): string {
  return `${vehicleName} model overview — new Ford vehicles at Eagle Ford`
}

function seoFeatureSectionImageAlt(vehicleName: string, featureTitle: string): string {
  return `${vehicleName} ${featureTitle} — Ford feature and technology highlight`
}

function seoColourImageAlt(vehicleName: string, colourName: string, colourNote?: string): string {
  const trimNote = colourNote ? ` (${colourNote})` : ''
  return `${vehicleName} exterior in ${colourName}${trimNote} paint colour option`
}

function seoGalleryImageAlt(vehicleName: string, index: number): string {
  return `${vehicleName} gallery photo ${index + 1} — exterior and interior views`
}

function seoModelFeatureImageAlt(vehicleName: string, variantName: string): string {
  return `Ford ${variantName} — ${vehicleName} model variant at Eagle Ford South Africa`
}

function seoBrochureAlt(vehicleName: string): string {
  return `Ford ${vehicleName} brochure PDF download — Eagle Ford South Africa`
}

function formatPayloadWriteError(
  collection: string,
  entityLabel: string,
  slug: string,
  error: unknown,
): string {
  const base = `[${collection}] Failed to save "${entityLabel}" (slug: "${slug}")`
  if (error instanceof Error) {
    const message = error.message
    if (message.includes('Value must be unique') || message.includes('duplicate key')) {
      return `${base}: slug conflicts with a stale global MongoDB unique index. Run "pnpm repair:vehicle-slug-indexes" (or re-run import after restart) to drop slug_1 and apply per-parent uniqueness. Original error: ${message}`
    }
    return `${base}: ${message}`
  }

  if (error && typeof error === 'object' && 'errors' in error && Array.isArray(error.errors)) {
    const slugError = error.errors.find(
      (entry) =>
        entry &&
        typeof entry === 'object' &&
        'path' in entry &&
        (entry as { path?: string }).path === 'slug',
    ) as { message?: string } | undefined
    if (slugError?.message) {
      return `${base}: ${slugError.message}`
    }
  }

  return `${base}: ${String(error)}`
}

function buildModelMetaDescription(
  vehicleName: string,
  variantName: string,
  highlights: string[],
): string {
  const lead = `Explore the ${vehicleName} ${variantName} at Eagle Ford.`
  const highlightText = highlights.slice(0, 3).join('. ')
  return highlightText ? `${lead} ${highlightText}.` : lead
}

function brochureMediaFilename(vehicleSlug: string): string {
  return `${vehicleSlug}-brochure.pdf`
}

async function uploadVehicleBrochure(
  payload: Payload,
  req: PayloadRequest,
  vehicleSlug: string,
  vehicleName: string,
  brochureUrl: string | undefined,
  brochureAlt: string | undefined,
  stats: ImageImportStats,
): Promise<string | null> {
  if (!brochureUrl) return null

  const remoteFile = await fetchRemoteImage(brochureUrl)
  if (!remoteFile) {
    stats.imagesMissing++
    return null
  }

  return uploadSeedImage(
    payload,
    req,
    remoteFile,
    brochureMediaFilename(vehicleSlug),
    brochureAlt ?? seoBrochureAlt(vehicleName),
    stats,
  )
}

async function buildVehicleImages(
  payload: Payload,
  req: PayloadRequest,
  vehicleName: string,
  vehicleSlug: string,
  heroImageUrl: string | undefined,
  heroImageAlt: string | undefined,
  featureImageUrl: string | undefined,
  featureImageAlt: string | undefined,
  gallery: GalleryDef[],
  colours: ColourDef[],
  stats: ImageImportStats,
): Promise<BuiltVehicleImages> {
  const heroAlt = heroImageAlt ?? seoHeroImageAlt(vehicleName)
  const featureCardAlt = featureImageAlt ?? seoFeatureCardImageAlt(vehicleName)

  let heroMediaId: string | null = null
  if (heroImageUrl) {
    const remoteHeroImage = await fetchRemoteImage(heroImageUrl)
    if (remoteHeroImage) {
      heroMediaId = await uploadSeedImage(
        payload,
        req,
        remoteHeroImage,
        buildSeedMediaFilename(vehicleSlug, 'hero', 'banner'),
        heroAlt,
        stats,
      )
    } else {
      stats.imagesMissing++
    }
  } else {
    stats.imagesMissing++
  }

  let featureMediaId: string | null = null
  if (featureImageUrl) {
    const remoteFeatureImage = await fetchRemoteImage(featureImageUrl)
    if (remoteFeatureImage) {
      featureMediaId = await uploadSeedImage(
        payload,
        req,
        remoteFeatureImage,
        buildSeedMediaFilename(vehicleSlug, 'feature', 'card'),
        featureCardAlt,
        stats,
      )
    } else {
      stats.imagesMissing++
    }
  } else {
    stats.imagesMissing++
  }

  const galleryIds: string[] = []
  for (const [index, item] of gallery.entries()) {
    const remoteGalleryImage = await fetchRemoteImage(item.imageUrl)
    if (remoteGalleryImage) {
      galleryIds.push(
        await uploadSeedImage(
          payload,
          req,
          remoteGalleryImage,
          buildSeedMediaFilename(vehicleSlug, 'gallery', String(index + 1).padStart(2, '0')),
          item.imageAlt || seoGalleryImageAlt(vehicleName, index),
          stats,
        ),
      )
    } else {
      stats.imagesMissing++
    }
  }

  const builtColours: BuiltColour[] = []
  for (const colour of colours) {
    const swatchImage = await resolveColourSwatchImage(colour)
    let swatchMediaId: string | undefined
    const colourAlt =
      colour.colourImageAlt ?? seoColourImageAlt(vehicleName, colour.colourName, colour.colourNote)

    if (swatchImage) {
      swatchMediaId = await uploadSeedImage(
        payload,
        req,
        swatchImage,
        buildSeedMediaFilename(vehicleSlug, 'colour', colour.colourName),
        colourAlt,
        stats,
      )
    } else {
      stats.imagesMissing++
    }

    builtColours.push({
      colourName: colour.colourName,
      ...(colour.colourNote ? { colourNote: colour.colourNote } : {}),
      ...(swatchMediaId ? { colourSwatch: swatchMediaId } : {}),
    })
  }

  return { heroMediaId, featureMediaId, galleryIds, colours: builtColours }
}

async function resolveColourSwatchImage(colour: ColourDef): Promise<SeedImage | null> {
  if (!colour.colourImageUrl) return null
  return fetchRemoteImage(colour.colourImageUrl)
}

async function buildModelColours(
  payload: Payload,
  req: PayloadRequest,
  vehicleName: string,
  vehicleSlug: string,
  colours: ColourDef[],
  stats: ImageImportStats,
): Promise<BuiltColour[]> {
  const builtColours: BuiltColour[] = []

  for (const colour of colours) {
    const mediaFilename = buildSeedMediaFilename(vehicleSlug, 'colour', colour.colourName)
    const colourAlt =
      colour.colourImageAlt ?? seoColourImageAlt(vehicleName, colour.colourName, colour.colourNote)
    let swatchMediaId = (await findSeedMediaId(payload, req, mediaFilename)) ?? undefined

    if (!swatchMediaId) {
      const swatchImage = await resolveColourSwatchImage(colour)
      if (swatchImage) {
        swatchMediaId = await uploadSeedImage(
          payload,
          req,
          swatchImage,
          mediaFilename,
          colourAlt,
          stats,
        )
      } else {
        stats.imagesMissing++
      }
    } else {
      await payload.update({
        collection: 'media',
        id: swatchMediaId,
        data: { alt: colourAlt },
        req,
        context: { disableRevalidate: true },
      })
    }

    builtColours.push({
      colourName: colour.colourName,
      ...(colour.colourNote ? { colourNote: colour.colourNote } : {}),
      ...(swatchMediaId ? { colourSwatch: swatchMediaId } : {}),
    })
  }

  return builtColours
}

type BuiltFeature = {
  featureTitle: string
  featureDescription: string
  featureImage?: string
}

async function buildVehicleFeatures(
  payload: Payload,
  req: PayloadRequest,
  vehicleSlug: string,
  vehicleName: string,
  features: FeatureDef[],
  stats: ImageImportStats,
): Promise<BuiltFeature[]> {
  const builtFeatures: BuiltFeature[] = []

  for (const [index, feature] of features.entries()) {
    let featureImageId: string | undefined

    if (feature.featureImageUrl) {
      const image = await fetchRemoteImage(feature.featureImageUrl)
      if (image) {
        const featureAlt =
          feature.featureImageAlt ?? seoFeatureSectionImageAlt(vehicleName, feature.featureTitle)
        featureImageId = await uploadSeedImage(
          payload,
          req,
          image,
          buildSeedMediaFilename(
            vehicleSlug,
            'feature-section',
            String(index + 1).padStart(2, '0'),
          ),
          featureAlt,
          stats,
        )
      } else {
        stats.imagesMissing++
      }
    }

    builtFeatures.push({
      featureTitle: feature.featureTitle,
      featureDescription: feature.featureDescription,
      ...(featureImageId ? { featureImage: featureImageId } : {}),
    })
  }

  return builtFeatures
}

async function buildModelSeedImages(
  payload: Payload,
  req: PayloadRequest,
  vehicleName: string,
  vehicleSlug: string,
  model: ModelDef,
  stats: ImageImportStats,
): Promise<{
  heroMediaId: string | null
  featureMediaId: string | null
  galleryIds: string[]
  colours: BuiltColour[]
  features: BuiltFeature[]
}> {
  const images = await buildVehicleImages(
    payload,
    req,
    vehicleName,
    `${vehicleSlug}-${model.slug}`,
    model.heroImageUrl,
    model.heroImageAlt,
    model.featureImageUrl,
    model.featureImageAlt,
    model.gallery ?? [],
    model.colours ?? [],
    stats,
  )

  const features = model.features?.length
    ? await buildVehicleFeatures(
        payload,
        req,
        `${vehicleSlug}-${model.slug}`,
        model.name,
        model.features,
        stats,
      )
    : []

  return {
    heroMediaId: images.heroMediaId,
    featureMediaId: images.featureMediaId,
    galleryIds: images.galleryIds,
    colours: images.colours,
    features,
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

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
      vehiclesCreated: 0,
      vehiclesUpdated: 0,
      vehiclesSkipped: 0,
      modelsCreated: 0,
      modelsUpdated: 0,
      modelsSkipped: 0,
      variantsCreated: 0,
      variantsUpdated: 0,
      variantsSkipped: 0,
      imagesUploaded: 0,
      imagesMissing: 0,
    }

    // ── 1. Upsert vehicle categories ────────────────────────────────────────
    log.info('Ensuring vehicle slug indexes are scoped per parent...')
    await ensureVehicleSlugIndexes(payload)

    log.info('Seeding vehicle categories...')
    const categoryIdMap: Record<string, string> = {}

    for (const cat of CATEGORY_DATA) {
      const existing = await payload.find({
        collection: 'vehicle-categories',
        where: { slug: { equals: cat.slug } },
        limit: 1,
      })

      if (existing.totalDocs > 0) {
        categoryIdMap[cat.slug] = existing.docs[0].id as string
        result.categoriesSkipped++
      } else {
        const created = await payload.create({
          collection: 'vehicle-categories',
          data: { title: cat.title, slug: cat.slug, sortOrder: cat.sortOrder },
          req: payloadReq,
        })
        categoryIdMap[cat.slug] = created.id as string
        result.categoriesCreated++
        log.info(`Created category: ${cat.title}`)
      }
    }

    // ── 2. Upsert vehicles ──────────────────────────────────────────────────
    log.info('Seeding vehicles...')
    const vehicleIdMap: Record<string, string> = {}

    for (const [index, veh] of CATALOG_DATA.entries()) {
      const existing = await payload.find({
        collection: 'vehicles',
        where: { slug: { equals: veh.slug } },
        limit: 1,
        draft: true,
        overrideAccess: true,
        req: payloadReq,
      })

      log.info(`Loading seed images for: ${veh.name}`)
      const images = await buildVehicleImages(
        payload,
        payloadReq,
        veh.name,
        veh.slug,
        veh.heroImageUrl,
        veh.heroImageAlt,
        veh.featureImageUrl,
        veh.featureImageAlt,
        veh.gallery,
        veh.colours,
        result,
      )
      const features = await buildVehicleFeatures(
        payload,
        payloadReq,
        veh.slug,
        veh.name,
        veh.features,
        result,
      )
      const brochureMediaId = await uploadVehicleBrochure(
        payload,
        payloadReq,
        veh.slug,
        veh.name,
        veh.brochureUrl,
        veh.brochureAlt,
        result,
      )

      if (existing.totalDocs > 0) {
        const doc = existing.docs[0]
        vehicleIdMap[veh.slug] = doc.id as string

        const updateData: {
          faqs: typeof veh.faqs
          features: BuiltFeature[]
          heroImage?: string
          featureImage?: string
          gallery?: { image: string }[]
          colours?: BuiltColour[]
          brochure?: string
          specHighlights?: SpecHighlightDef[]
          engineOptions?: EngineOptionDef[]
          meta: {
            metaTitle: string
            metaDescription: string
            metaImage?: string
          }
        } = {
          faqs: veh.faqs,
          features,
          meta: {
            metaTitle: veh.name,
            metaDescription: veh.description,
            ...(images.heroMediaId ? { metaImage: images.heroMediaId } : {}),
          },
        }

        if (images.heroMediaId) updateData.heroImage = images.heroMediaId
        if (images.featureMediaId) updateData.featureImage = images.featureMediaId
        if (images.galleryIds.length > 0) {
          updateData.gallery = images.galleryIds.map((id) => ({ image: id }))
        }
        if (veh.colours.length > 0) updateData.colours = images.colours
        if (brochureMediaId) updateData.brochure = brochureMediaId
        if (veh.specHighlights) updateData.specHighlights = veh.specHighlights
        if (veh.engineOptions) updateData.engineOptions = veh.engineOptions

        await payload.update({
          collection: 'vehicles',
          id: doc.id,
          data: updateData,
          req: payloadReq,
          context: { disableRevalidate: true },
        })
        result.vehiclesUpdated++
        log.info(`Updated vehicle: ${veh.name}`)
        continue
      }

      if (!images.heroMediaId) {
        log.warn(`No hero image for ${veh.name} — skipping create`)
        result.vehiclesSkipped++
        continue
      }

      const created = await payload.create({
        collection: 'vehicles',
        draft: false,
        data: {
          name: veh.name,
          slug: veh.slug,
          generateSlug: false,
          ...(veh.badge ? { badge: veh.badge } : {}),
          category: categoryIdMap[veh.categorySlug],
          heroImage: images.heroMediaId,
          ...(images.featureMediaId ? { featureImage: images.featureMediaId } : {}),
          gallery: images.galleryIds.map((id) => ({ image: id })),
          features,
          colours: images.colours,
          faqs: veh.faqs,
          ...(brochureMediaId ? { brochure: brochureMediaId } : {}),
          ...(veh.specHighlights ? { specHighlights: veh.specHighlights } : {}),
          ...(veh.engineOptions ? { engineOptions: veh.engineOptions } : {}),
          startingPrice: veh.startingPrice,
          priceDisclaimer: 'Including Optional Service plan and excluding Packs & factory options',
          showInMegaMenu: true,
          sortOrder: index + 1,
          meta: {
            metaTitle: veh.name,
            metaDescription: veh.description,
            metaImage: images.heroMediaId,
          },
          _status: 'published',
        },
        req: payloadReq,
        context: { disableRevalidate: true },
      })

      vehicleIdMap[veh.slug] = created.id as string
      result.vehiclesCreated++
      log.info(`Created vehicle: ${veh.name}`)
    }

    // ── 3. Upsert vehicle models and variants ─────────────────────────────
    log.info('Seeding vehicle models and variants...')
    const modelIdMap: Record<string, string> = {}

    for (const veh of CATALOG_DATA) {
      const vehicleId = vehicleIdMap[veh.slug]
      if (!vehicleId) {
        log.warn(`No vehicle ID for ${veh.slug} — skipping models`)
        continue
      }

      for (const [modelIndex, modelDef] of veh.models.entries()) {
        const modelKey = `${veh.slug}::${modelDef.slug}`
        const normalizedModelSlug = normalizeCatalogSlug(modelDef.slug)
        const existingModel = await payload.find({
          collection: 'vehicle-models',
          where: {
            and: [{ slug: { equals: normalizedModelSlug } }, { vehicle: { equals: vehicleId } }],
          },
          limit: 1,
          draft: true,
          overrideAccess: true,
          req: payloadReq,
        })

        const modelImages = await buildModelSeedImages(
          payload,
          payloadReq,
          veh.name,
          veh.slug,
          modelDef,
          result,
        )

        const modelData = {
          name: modelDef.name,
          slug: normalizedModelSlug,
          generateSlug: false,
          vehicle: vehicleId,
          ...(modelImages.heroMediaId ? { heroImage: modelImages.heroMediaId } : {}),
          ...(modelImages.featureMediaId ? { featureImage: modelImages.featureMediaId } : {}),
          ...(modelImages.galleryIds.length > 0
            ? { gallery: modelImages.galleryIds.map((id) => ({ image: id })) }
            : {}),
          ...(modelImages.features.length > 0 ? { features: modelImages.features } : {}),
          ...(modelImages.colours.length > 0 ? { colours: modelImages.colours } : {}),
          ...(modelDef.faqs?.length ? { faqs: modelDef.faqs } : {}),
          showInMegaMenu: modelDef.showInMegaMenu ?? false,
          sortOrder: modelDef.sortOrder ?? modelIndex + 1,
          meta: {
            metaTitle: `${modelDef.name} | ${veh.name}`,
            metaDescription:
              modelDef.description ??
              `Explore the ${modelDef.name} trim of the ${veh.name} at Eagle Ford.`,
            ...(modelImages.heroMediaId ? { metaImage: modelImages.heroMediaId } : {}),
          },
          _status: 'published' as const,
        }

        let modelId: string
        try {
          if (existingModel.totalDocs > 0) {
            modelId = existingModel.docs[0].id as string
            await payload.update({
              collection: 'vehicle-models',
              id: modelId,
              data: modelData,
              req: payloadReq,
              context: { disableRevalidate: true },
            })
            result.modelsUpdated++
            log.info(`Updated model: ${modelDef.name}`)
          } else {
            const createdModel = await payload.create({
              collection: 'vehicle-models',
              draft: false,
              data: modelData,
              req: payloadReq,
              context: { disableRevalidate: true },
            })
            modelId = createdModel.id as string
            result.modelsCreated++
            log.info(`Created model: ${modelDef.name}`)
          }
        } catch (error) {
          throw new Error(
            formatPayloadWriteError('vehicle-models', modelDef.name, normalizedModelSlug, error),
          )
        }

        modelIdMap[modelKey] = modelId

        for (const [variantIndex, variantDef] of modelDef.variants.entries()) {
          const normalizedVariantSlug = normalizeCatalogSlug(variantDef.slug)
          const existingVariant = await payload.find({
            collection: 'vehicle-variants',
            where: {
              and: [{ slug: { equals: normalizedVariantSlug } }, { model: { equals: modelId } }],
            },
            limit: 1,
            draft: true,
            overrideAccess: true,
            req: payloadReq,
          })

          const variantFeatureAlt =
            variantDef.featureImageAlt ?? seoModelFeatureImageAlt(modelDef.name, variantDef.name)

          let featureMediaId: string | null = null
          if (variantDef.featureImageUrl) {
            const remoteVariantFeature = await fetchRemoteImage(variantDef.featureImageUrl)
            if (remoteVariantFeature) {
              featureMediaId = await uploadSeedImage(
                payload,
                payloadReq,
                remoteVariantFeature,
                buildSeedMediaFilename(veh.slug, `${modelDef.slug}-variant`, variantDef.slug),
                variantFeatureAlt,
                result,
              )
            } else {
              result.imagesMissing++
            }
          }

          const variantColours = await buildModelColours(
            payload,
            payloadReq,
            modelDef.name,
            `${veh.slug}-${modelDef.slug}`,
            modelDef.colours ?? veh.colours,
            result,
          )

          const variantData = {
            name: variantDef.name,
            slug: normalizedVariantSlug,
            generateSlug: false,
            model: modelId,
            price: variantDef.price,
            highlights: variantDef.highlights.map((h) => ({ highlight: h })),
            ...(featureMediaId ? { heroImage: featureMediaId, featureImage: featureMediaId } : {}),
            ...(variantColours.length > 0 ? { colours: variantColours } : {}),
            sortOrder: variantIndex + 1,
            meta: {
              metaTitle: `${variantDef.name} | ${modelDef.name}`,
              metaDescription: buildModelMetaDescription(
                modelDef.name,
                variantDef.name,
                variantDef.highlights,
              ),
              ...(featureMediaId ? { metaImage: featureMediaId } : {}),
            },
            _status: 'published' as const,
          }

          try {
            if (existingVariant.totalDocs > 0) {
              await payload.update({
                collection: 'vehicle-variants',
                id: existingVariant.docs[0].id,
                data: variantData,
                req: payloadReq,
                context: { disableRevalidate: true },
              })
              result.variantsUpdated++
              log.info(`Updated variant: ${variantDef.name}`)
            } else {
              await payload.create({
                collection: 'vehicle-variants',
                draft: false,
                data: variantData,
                req: payloadReq,
                context: { disableRevalidate: true },
              })
              result.variantsCreated++
              log.info(`Created variant: ${variantDef.name}`)
            }
          } catch (error) {
            throw new Error(
              formatPayloadWriteError(
                'vehicle-variants',
                variantDef.name,
                normalizedVariantSlug,
                error,
              ),
            )
          }
        }
      }
    }

    log.info('Vehicle import complete.')

    return { success: true, ...result }
  }, payload.logger)
}
