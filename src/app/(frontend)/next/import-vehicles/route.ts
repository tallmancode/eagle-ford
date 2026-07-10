import { buildSeedMediaFilename, toPayloadFile, type SeedImage } from '@/lib/vehicle-seed-images'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import type { Payload, PayloadRequest } from 'payload'

export const maxDuration = 300

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type ImageImportStats = {
  imagesUploaded: number
  imagesMissing: number
}

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

function isDuplicateFilenameError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'data' in err &&
    Array.isArray((err as { data?: { errors?: { path?: string }[] } }).data?.errors) &&
    (err as { data: { errors: { path?: string }[] } }).data.errors.some(
      (e) => e.path === 'filename',
    )
  )
}

async function findSeedMediaId(
  payload: Payload,
  req: PayloadRequest,
  mediaFilename: string,
): Promise<string | null> {
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: mediaFilename } },
    limit: 1,
    req,
  })

  return existing.totalDocs > 0 ? (existing.docs[0].id as string) : null
}

async function fetchRemoteImage(url: string): Promise<SeedImage | null> {
  try {
    const response = await fetch(url)
    if (!response.ok) return null

    const buffer = Buffer.from(await response.arrayBuffer())
    const pathname = new URL(url).pathname
    const filename = decodeURIComponent(pathname.split('/').pop() ?? 'feature.webp')

    return { buffer, filename }
  } catch {
    return null
  }
}

async function uploadSeedImage(
  payload: Payload,
  req: PayloadRequest,
  image: SeedImage,
  mediaFilename: string,
  alt: string,
  stats: ImageImportStats,
): Promise<string> {
  const existingId = await findSeedMediaId(payload, req, mediaFilename)
  if (existingId) {
    await payload.update({
      collection: 'media',
      id: existingId,
      data: { alt },
      req,
      context: { disableRevalidate: true },
    })
    return existingId
  }

  try {
    const media = await payload.create({
      collection: 'media',
      data: { alt },
      file: toPayloadFile(image, mediaFilename),
      req,
    })
    stats.imagesUploaded++
    return media.id as string
  } catch (err) {
    if (isDuplicateFilenameError(err)) {
      const retryId = await findSeedMediaId(payload, req, mediaFilename)
      if (retryId) {
        await payload.update({
          collection: 'media',
          id: retryId,
          data: { alt },
          req,
          context: { disableRevalidate: true },
        })
        return retryId
      }
    }
    throw err
  }
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

// ---------------------------------------------------------------------------
// Vehicle seed data
// ---------------------------------------------------------------------------

type ColourDef = {
  colourName: string
  colourNote?: string
  colourImageUrl?: string
  colourImageAlt?: string
}
type FeatureDef = {
  featureTitle: string
  featureDescription: string
  featureImageUrl?: string
  featureImageAlt?: string
}
type GalleryDef = { imageUrl: string; imageAlt: string }
type VariantDef = {
  name: string
  slug: string
  price: number
  highlights: string[]
  featureImageUrl?: string
  featureImageAlt?: string
}
type FaqDef = { question: string; answer: string }

type VehicleDef = {
  name: string
  slug: string
  badge?: 'newly-launched' | 'coming-soon' | 'limited'
  categorySlug: string
  startingPrice: number
  description: string
  features: FeatureDef[]
  colours: ColourDef[]
  heroImageUrl: string
  heroImageAlt: string
  featureImageUrl: string
  featureImageAlt: string
  gallery: GalleryDef[]
  brochureUrl?: string
  brochureAlt?: string
  pageUrl: string
  variants: VariantDef[]
  faqs: FaqDef[]
}

const VEHICLE_DATA: VehicleDef[] = [
  // ── Bakkies ────────────────────────────────────────────────────────────────
  {
    name: 'Next Level Ranger',
    slug: 'next-level-ranger',
    badge: 'newly-launched',
    categorySlug: 'bakkies',
    startingPrice: 621000,
    description:
      "Tougher looks. Same unstoppable DNA. A refined Ranger has arrived in Mzansi, and introducing the new Ford Ranger Sport, taking capability and injecting it with adrenaline. Featuring a bold new look and dynamic handling, it's designed for those who refuse to blend in. It's the Ranger you trust, refined for the drive you crave.",
    features: [
      {
        featureImageUrl: 'https://www.eagleford.co.za/Next%20Level%20Ranger_img_2.webp',
        featureImageAlt: 'Next Level Ranger 12″ IP Screen — Ford feature and technology highlight',
        featureTitle: '12″ IP Screen',
        featureDescription:
          'New coast-to-coast dashboard increases the sense of space and width in the cabin. The integrated 12-inch centre LED touchscreen is hi-tech with a tough truck inspired look.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Next%20Level%20Ranger_img_3.webp',
        featureImageAlt:
          'Next Level Ranger Dark Interior Finish — Ford feature and technology highlight',
        featureTitle: 'Dark Interior Finish',
        featureDescription:
          'Experience a sanctuary of modern focus with an interior finished in deep, tonal accents that exude a premium feel. These sophisticated dark materials are designed to resist the rigors of daily use while maintaining a sleek, cohesive look throughout the cabin.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Next%20Level%20Ranger_img_1.webp',
        featureImageAlt:
          'Next Level Ranger raising the bar — Ford bakkie design and capability highlight',
        featureTitle: 'Ranger Raising the Bar Again',
        featureDescription:
          "Ranger raises the stakes for 2026. Tougher in stance, sharper in design and finished with bold black accents for XLT, Wildtrak and Platinum series that give it serious presence. It's built from the same hard-working DNA that has made it Mzansi's number one 4x4.",
      },
    ],
    colours: [
      {
        colourName: 'Frozen White',
        colourImageAlt: 'Next Level Ranger exterior in Frozen White paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/c202169b-7f2b-40b0-a27d-d2b3786509f8_Next-Gen-Ford-Ranger-Colour-Frozen-White.webp',
      },
      {
        colourName: 'Carbonized Grey',
        colourImageAlt: 'Next Level Ranger exterior in Carbonized Grey paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/a43d7824-c608-453a-adbb-9e3b20495449_Next-Gen-Ford-Ranger-Colour-Carbonized-Grey.webp',
      },
      {
        colourName: 'Agate Black',
        colourImageAlt: 'Next Level Ranger exterior in Agate Black paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/50816176-2616-4188-a94d-786a23784b91_Next-Gen-Ford-Ranger-Colour-Agate-Black.webp',
      },
      {
        colourName: 'Ignite Red',
        colourImageAlt: 'Next Level Ranger exterior in Ignite Red paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/4bbd014a-07a7-415c-9d77-5a1bc0b2306a_Next-Gen-Ford-Ranger-Colour-Ignite-Red.webp',
      },
      {
        colourName: 'Blue Lighting',
        colourImageAlt: 'Next Level Ranger exterior in Blue Lighting paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/a325b8ac-2030-4c1e-a60b-fcbf9f084daa_Next-Gen-Ford-Ranger-Colour-Blue-Lighting.webp',
      },
      {
        colourName: 'Acacia Green',
        colourNote: 'Platinum Only',
        colourImageAlt:
          'Next Level Ranger exterior in Acacia Green (Platinum Only) paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/4f2aa4ed-b78d-41c2-9a2f-40ed24fcc77c_Next-Gen-Ford-Ranger-Colour-Acacia-Green.webp',
      },
      {
        colourName: 'Lucid Red',
        colourImageAlt: 'Next Level Ranger exterior in Lucid Red paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/b5bba215-7438-406f-937d-63667935f5be_Next-Gen-Ford-Ranger-Colour-Lucid-Red.webp',
      },
      {
        colourName: 'Command Grey',
        colourNote: 'Sport & Tremor Only',
        colourImageAlt:
          'Next Level Ranger exterior in Command Grey (Sport & Tremor Only) paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/09652c1b-a63f-4522-a037-9866b738430f_Next-Gen-Ford-Ranger-Colour-Command-Grey.webp',
      },
    ],
    heroImageUrl: 'https://www.eagleford.co.za/new/Next-Level-Ranger/./images/banner.webp',
    heroImageAlt: 'Ford Next Level Ranger bakkie hero banner on South African roads — Eagle Ford',
    featureImageUrl: 'https://www.eagleford.co.za/new/Next-Level-Ranger/./images/hero.webp',
    featureImageAlt: 'Ford Next Level Ranger side profile — new Ford bakkies at Eagle Ford',
    gallery: [
      {
        imageUrl: 'https://www.eagleford.co.za/new/Next-Level-Ranger/./images/gallery/img_0.webp',
        imageAlt: 'Next Level Ford Ranger Gallery 1',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Next-Level-Ranger/./images/gallery/img_1.webp',
        imageAlt: 'Next Level Ford Ranger Gallery 2',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Next-Level-Ranger/./images/gallery/img_2.webp',
        imageAlt: 'Next Level Ford Ranger Gallery 3',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Next-Level-Ranger/./images/gallery/img_3.webp',
        imageAlt: 'Next Level Ford Ranger Gallery 4',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Next-Level-Ranger/./images/gallery/img_4.webp',
        imageAlt: 'Next Level Ford Ranger Gallery 5',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Next-Level-Ranger/./images/gallery/img_5.webp',
        imageAlt: 'Next Level Ford Ranger Gallery 6',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Next-Level-Ranger/./images/gallery/img_6.webp',
        imageAlt: 'Next Level Ford Ranger Gallery 7',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Next-Level-Ranger/./images/gallery/img_7.webp',
        imageAlt: 'Next Level Ford Ranger Gallery 8',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Next-Level-Ranger/./images/gallery/img_8.webp',
        imageAlt: 'Next Level Ford Ranger Gallery 9',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Next-Level-Ranger/./images/gallery/img_9.webp',
        imageAlt: 'Next Level Ford Ranger Gallery 10',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Next-Level-Ranger/./images/gallery/img_10.webp',
        imageAlt: 'Next Level Ford Ranger Gallery 11',
      },
    ],
    brochureUrl:
      'https://www.eagleford.co.za/new/Next-Level-Ranger/./files/brochures/20260609-ranger-brochure.pdf',
    brochureAlt: 'Ford Next Level Ranger brochure PDF download — Eagle Ford South Africa',
    pageUrl: 'https://www.eagleford.co.za/new/next-level-ranger/',
    variants: [
      {
        name: '2.0 SiT Double Cab XL 4x2 6MT',
        slug: '2.0-sit-double-cab-xl-4x2-6mt',
        featureImageUrl: 'https://www.eagleford.co.za/252764_image.webp',
        featureImageAlt:
          'Ford 2.0 SiT Double Cab XL 4x2 6MT — Next Level Ranger model variant at Eagle Ford South Africa',
        price: 621000,
        highlights: [
          '12" Colour Touchscreen',
          '16" Steel Wheels',
          '2.0L Panther Single Turbo 125kW with 6MT',
          'Automatic High Head Lamps',
          'Halogen Head Lamps',
          'Rear-view Camera',
          'SYNC4 A Low With Wireless Apple CarPlay/Android',
          'Voice Pass Through E.G. Siri',
        ],
      },
      {
        name: '2.0 SiT Double Cab XLT 4x2 10AT',
        slug: '2.0-sit-double-cab-xlt-4x2-10at',
        featureImageUrl: 'https://www.eagleford.co.za/252765_image.webp',
        featureImageAlt:
          'Ford 2.0 SiT Double Cab XLT 4x2 10AT — Next Level Ranger model variant at Eagle Ford South Africa',
        price: 699500,
        highlights: [
          '10AT Replaces 6AT',
          '12" Colour Touchscreen',
          'Automatic High Head Lamps',
          'Halogen Head Lamps',
          'Lane Change Warning',
        ],
      },
      {
        name: '2.3L Double Cab Sport 4x2 10AT',
        slug: '2.3l-double-cab-sport-4x2-10at',
        featureImageUrl: 'https://www.eagleford.co.za/252766_image.webp',
        featureImageAlt:
          'Ford 2.3L Double Cab Sport 4x2 10AT — Next Level Ranger model variant at Eagle Ford South Africa',
        price: 839600,
        highlights: [
          '360 Camera',
          'Adaptive Cruise Control with Stop/Go',
          'Electronic Park Brake',
          'E-Shifter',
          'Zone Lighting',
        ],
      },
      {
        name: '2.3L Double Cab Wildtrak 4x2 10AT',
        slug: '2.3l-double-cab-wildtrak-4x2-10at',
        featureImageUrl: 'https://www.eagleford.co.za/252767_image.webp',
        featureImageAlt:
          'Ford 2.3L Double Cab Wildtrak 4x2 10AT — Next Level Ranger model variant at Eagle Ford South Africa',
        price: 899000,
        highlights: [
          '12" Colour Touchscreen',
          '18" Steel Spare Wheel',
          '18" Alloy Wheels',
          '2x USB Points & 400W Inverter Rear of Console',
          '6-Way Manual Passenger Seat Adjust',
          '8 Speakers',
          'Automatic Headlamp Levelling',
          'Heated Front Seats',
          'Matrix LED Headlamps',
          'SYNC4 High Including Navigation',
        ],
      },
      {
        name: '3.0L V6 Double Cab Tremor 4x4 10AT',
        slug: '3.0l-v6-double-cab-tremor-4x4-10at',
        featureImageUrl: 'https://www.eagleford.co.za/252768_image.webp',
        featureImageAlt:
          'Ford 3.0L V6 Double Cab Tremor 4x4 10AT — Next Level Ranger model variant at Eagle Ford South Africa',
        price: 1039000,
        highlights: [
          '3.0L V6 LION 184kW With 10AT (E-Shifter) Only',
          '6 Speakers',
          'Composite Off-Road Side Steps',
          'Large Wheelarch Flares',
          'Load Box Edge Protectors',
          'Painted Front Fender Grille',
          'Roll Bar',
          'Unique Vinyl Seats with Embroidered Seat Logos',
        ],
      },
      {
        name: '3.0L V6 Double Cab Wildtrak 4x4 10AT',
        slug: '3.0l-v6-double-cab-wildtrak-4x4-10at',
        featureImageUrl: 'https://www.eagleford.co.za/252773_image.webp',
        featureImageAlt:
          'Ford 3.0L V6 Double Cab Wildtrak 4x4 10AT — Next Level Ranger model variant at Eagle Ford South Africa',
        price: 1070000,
        highlights: [
          '18" Alloy Wheels',
          '2x USB Points & 400W Inverter Rear of Console',
          '6-Way Manual Passenger Seat Adjust',
          'Automatic Headlamp Levelling',
          'Heated Front Seats',
          'Matrix LED Headlamps',
          'SYNC4 High Including Navigation',
          '12" Colour Touchscreen',
          '18" Steel Spare Wheel',
          '8 Speakers',
          'Pro Trailer Backup Assist',
        ],
      },
      {
        name: '3.0L V6 Double Cab Platinum 4x4 10AT',
        slug: '3.0l-v6-double-cab-platinum-4x4-10at',
        featureImageUrl: 'https://www.eagleford.co.za/252769_image.webp',
        featureImageAlt:
          'Ford 3.0L V6 Double Cab Platinum 4x4 10AT — Next Level Ranger model variant at Eagle Ford South Africa',
        price: 1179500,
        highlights: [
          '10-Way Power, Heating/Ventilation & Memory Function',
          '20" Alloy Wheels',
          'Badging – Seats & Mats',
          'Cargo Management System',
          'Chrome Interior Door Handles',
          'Painted Grille',
          'ST90 Fog Lamps',
          'Wheel Lip Moulding with Painted Flare',
        ],
      },
      {
        name: '3.0L V6 TT Double Cab Raptor 4x4 10AT',
        slug: '3.0l-v6-tt-double-cab-raptor-4x4-10at',
        featureImageUrl: 'https://www.eagleford.co.za/252770_image.webp',
        featureImageAlt:
          'Ford 3.0L V6 TT Double Cab Raptor 4x4 10AT — Next Level Ranger model variant at Eagle Ford South Africa',
        price: 1299000,
        highlights: [
          '12.4-Inch Digital Instrument Cluster',
          'FORD Grille',
          'Performance Fox Suspension',
          '292kW 3.0-Litre V6 Turbo Petrol Engine',
          'Selectable Drive Modes: Normal, Eco, Slippery, Mud, Sand, Baja, Rock Crawl',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the starting price of the Next Level Ranger?',
        answer:
          'The Next Level Ranger range starts from R 621,000 for the 2.0 SiT Double Cab XL 4x2 6MT. Prices include an optional service plan and exclude packs and factory options. Visit Eagle Ford for current pricing and specials.',
      },
      {
        question: 'Which Next Level Ranger trims are available?',
        answer:
          'The range spans XL, XLT, Sport, Wildtrak, Tremor, Platinum and Raptor. Engines include the 2.0 SiT, 2.3L and the 3.0L V6 (including the twin-turbo Raptor), with both 4x2 and 4x4 drivetrains depending on the derivative.',
      },
      {
        question: 'What is the difference between 4x2 and 4x4 Ranger models?',
        answer:
          '4x2 models are ideal for on-road, light commercial and family use. 4x4 models (such as Tremor, Wildtrak 4x4, Platinum and Raptor) add greater off-road ability, selectable drive modes and stronger towing confidence for tougher terrain.',
      },
      {
        question: 'What makes the Ranger Sport different?',
        answer:
          'The new Ford Ranger Sport injects adrenaline into Ranger capability with a bolder look, dynamic handling and lifestyle-focused features such as a 360 camera, Adaptive Cruise Control with Stop/Go, electronic park brake, e-shifter and zone lighting.',
      },
      {
        question: 'Is the Ranger Tremor built for off-road use?',
        answer:
          'Yes. The 3.0L V6 Double Cab Tremor 4x4 is oriented toward serious off-road work, with composite off-road side steps, large wheelarch flares, load-box edge protectors, a roll bar and unique vinyl seats with embroidered logos.',
      },
      {
        question: 'What tech comes standard in the Next Level Ranger cabin?',
        answer:
          'A coast-to-coast dashboard and integrated 12-inch centre touchscreen deliver a modern truck cabin. Derivatives offer SYNC4 with wireless Apple CarPlay and Android Auto, and higher trims add SYNC4 High with navigation plus premium audio.',
      },
      {
        question: 'How does the Ranger Raptor stand apart from other trims?',
        answer:
          'The Raptor is the performance flagship with a 292kW 3.0-litre V6 twin-turbo petrol engine, Performance Fox Suspension, a 12.4-inch digital cluster and selectable modes including Baja and Rock Crawl — built for high-speed off-road thrills.',
      },
      {
        question: 'What exterior colours can I choose?',
        answer:
          'Options include Frozen White, Carbonized Grey, Agate Black, Ignite Red, Blue Lighting, Lucid Red, Acacia Green (Platinum only) and Command Grey (Sport and Tremor only). Availability can vary by trim — confirm with Eagle Ford.',
      },
      {
        question: 'Does the Ranger support towing and trailer manoeuvring?',
        answer:
          'Higher-spec models such as the 3.0L V6 Wildtrak 4x4 include Pro Trailer Backup Assist to help reverse a trailer with less stress. Spec and tow ratings vary by derivative — speak to Eagle Ford for the right match to your trailer.',
      },
      {
        question: 'Can I finance a Next Level Ranger through Eagle Ford?',
        answer:
          'Yes. Eagle Ford can help with Ford finance options, trade-ins and a quote tailored to the trim you want. Contact the dealership for monthly payment estimates, deposit options and current stock.',
      },
    ],
  },
  {
    name: 'Ranger Super Cab',
    slug: 'ranger-super-cab',
    categorySlug: 'bakkies',
    startingPrice: 586500,
    description:
      'Meet our smartest, most capable, most versatile Ranger ever. Designed for over 180 countries, this is the bakkie the world will turn to – for work, family and play. Get ready to unlimit your Ranger life.',
    features: [
      {
        featureImageUrl: 'https://www.eagleford.co.za/Ranger%20Super%20Cab_img_1.webp',
        featureImageAlt:
          'Ranger Super Cab Bold New Front Face — Ford feature and technology highlight',
        featureTitle: 'Bold New Front Face',
        featureDescription:
          'Capable and reliable, the Ranger Super Cab is ready to work. The new black grille and halogen daytime running lamps showcase the global Built Ford Tough design.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Ranger%20Super%20Cab_img_2.webp',
        featureImageAlt: 'Ranger Super Cab Durable Wheels — Ford feature and technology highlight',
        featureTitle: 'Durable Wheels',
        featureDescription:
          'Perfect for driving in rugged conditions, the Ranger Super Cab comes with solid and durable 16-inch alloy wheels.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Ranger%20Super%20Cab_img_3.webp',
        featureImageAlt:
          'Ranger Super Cab Coast-to-Coast Dashboard — Ford feature and technology highlight',
        featureTitle: 'Coast-to-Coast Dashboard',
        featureDescription:
          'New coast-to-coast dashboard increases the sense of space and width in the cabin. The integrated 10-inch centre LED touchscreen is hi-tech with a tough, truck-inspired look.',
      },
    ],
    colours: [],
    heroImageUrl: 'https://www.eagleford.co.za/new/Ranger-Super-Cab/./images/banner.webp',
    heroImageAlt: 'Ford Ranger Super Cab work bakkie hero banner — Eagle Ford South Africa',
    featureImageUrl: 'https://www.eagleford.co.za/new/Ranger-Super-Cab/./images/hero.webp',
    featureImageAlt: 'Ford Ranger Super Cab model overview — commercial Ford bakkies at Eagle Ford',
    gallery: [],
    brochureUrl:
      'https://www.eagleford.co.za/new/Ranger-Super-Cab/./files/brochures/20260609-ranger-brochure.pdf',
    brochureAlt: 'Ford Ranger Super Cab brochure PDF download — Eagle Ford South Africa',
    pageUrl: 'https://www.eagleford.co.za/new/ranger-super-cab/',
    variants: [
      {
        name: 'Ranger 2.0 SiT SuperCab XL auto',
        slug: 'ranger-2.0-sit-supercab-xl-auto',
        featureImageUrl: 'https://www.eagleford.co.za/159411_image.webp',
        featureImageAlt:
          'Ford Ranger 2.0 SiT SuperCab XL auto — Ranger Super Cab model variant at Eagle Ford South Africa',
        price: 586500,
        highlights: [
          '6-speed automatic transmission',
          'Compression Ratio 15.8:1',
          'Combined Fuel Economy (L/100km) 7.5',
          'Fuel Tank Capacity: 80L',
        ],
      },
      {
        name: 'Ranger 2.0 SiT SuperCab XLT',
        slug: 'ranger-2.0-sit-supercab-xlt',
        featureImageUrl: 'https://www.eagleford.co.za/159412_image.webp',
        featureImageAlt:
          'Ford Ranger 2.0 SiT SuperCab XLT — Ranger Super Cab model variant at Eagle Ford South Africa',
        price: 623000,
        highlights: [
          '6-speed automatic transmission',
          'CO2 Emissions (g/km) 203',
          'Combined Fuel Economy 7.7 (L/100km)',
          'Fuel Type: Diesel',
        ],
      },
      {
        name: 'Ford Ranger 2.0 BiTurbo SuperCab Wildtrak 4x4',
        slug: 'ford-ranger-2.0-biturbo-supercab-wildtrak-4x4',
        featureImageUrl: 'https://www.eagleford.co.za/252771_image.webp',
        featureImageAlt:
          'Ford Ford Ranger 2.0 BiTurbo SuperCab Wildtrak 4x4 — Ranger Super Cab model variant at Eagle Ford South Africa',
        price: 842500,
        highlights: [
          '12″ Colour Touchscreen',
          '18″ Alloy Wheels with A/T Tyres',
          '360 Degree Camera including 4x4 Offroad Screen',
          'B&O Play Amplifier, Subwoofer and Extra Speaker (10 Speakers)',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is a Ranger Super Cab and how does it differ from Double Cab?',
        answer:
          'The Super Cab sits between Single and Double Cab layouts — it offers rear-hinged occasional rear access with a longer load box than a Double Cab, making it a strong mix of work payload and everyday practicality.',
      },
      {
        question: 'What is the starting price of the Ranger Super Cab?',
        answer:
          'The Ranger Super Cab range starts from R 586,500 for the 2.0 SiT SuperCab XL auto. Confirm current pricing, service plans and factory options with Eagle Ford.',
      },
      {
        question: 'Which Super Cab derivatives are available?',
        answer:
          'Available models include the 2.0 SiT SuperCab XL auto, 2.0 SiT SuperCab XLT, and the 2.0 BiTurbo SuperCab Wildtrak 4x4 for buyers who want higher specification and off-road ability.',
      },
      {
        question: 'Is the Super Cab suitable for both work and lifestyle?',
        answer:
          'Yes. It is designed as one of Ford’s most versatile Rangers — capable for commercial loads while remaining practical for family and leisure use thanks to its smart cab layout and tough chassis.',
      },
      {
        question: 'What fuel economy can I expect from the Super Cab XL?',
        answer:
          'The 2.0 SiT SuperCab XL auto quotes combined fuel economy of around 7.5 L/100km with an 80L fuel tank. Real-world figures vary with load, terrain and driving style.',
      },
      {
        question: 'What tech is in the Ranger Super Cab cabin?',
        answer:
          'A coast-to-coast dashboard with an integrated 10-inch centre LED touchscreen gives a modern, truck-inspired cabin. Higher Wildtrak models step up to a 12-inch touchscreen and premium audio.',
      },
      {
        question: 'What makes the Super Cab Wildtrak special?',
        answer:
          'The 2.0 BiTurbo SuperCab Wildtrak 4x4 adds lifestyle and capability extras such as 18-inch alloys with A/T tyres, a 360-degree camera with 4x4 off-road screen, and a B&O Play audio system with 10 speakers.',
      },
      {
        question: 'Does the Super Cab look different from other Rangers?',
        answer:
          'It shares the bold Built Ford Tough front face with a black grille and halogen daytime running lamps, plus durable 16-inch alloy wheels on work-focused XL derivatives.',
      },
      {
        question: 'Is the Super Cab available in 4x4?',
        answer:
          'Yes. The BiTurbo SuperCab Wildtrak is offered as a 4x4 for buyers who need more traction and off-road confidence. XL and XLT variants lean toward efficient on-road and light commercial use.',
      },
      {
        question: 'Can Eagle Ford help me choose between Super Cab and Double Cab?',
        answer:
          'Absolutely. Our sales team can match cab style, payload and budget to how you use your bakkie — whether that is fleet work, towing or weekend loads. Visit Eagle Ford for a comparison and quote.',
      },
    ],
  },
  {
    name: 'Ranger Single Cab',
    slug: 'ranger-single-cab',
    categorySlug: 'bakkies',
    startingPrice: 590000,
    description: 'Tough, smart, versatile. Perfect for work, family and play.',
    features: [
      {
        featureImageUrl: 'https://www.eagleford.co.za/Ranger%20Single%20Cab_img_1.webp',
        featureImageAlt:
          'Ranger Single Cab Bold New Front Face — Ford feature and technology highlight',
        featureTitle: 'Bold New Front Face',
        featureDescription:
          'Capable and reliable, the XL is ready to work. The new black grille and halogen daytime running lamps showcase the global Built Ford Tough design.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Ranger%20Single%20Cab_img_2.webp',
        featureImageAlt: 'Ranger Single Cab Durable Wheels — Ford feature and technology highlight',
        featureTitle: 'Durable Wheels',
        featureDescription:
          'Perfect for driving in rugged conditions, the XL comes with solid and durable 16-inch alloy wheels.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Ranger%20Single%20Cab_img_3.webp',
        featureImageAlt:
          'Ranger Single Cab Coast-to-Coast Dashboard — Ford feature and technology highlight',
        featureTitle: 'Coast-to-Coast Dashboard',
        featureDescription:
          'When your bakkie doubles as your office, a smart design makes all the difference. Packed with technology and features to help you work smarter and play harder. Built tough. Built safe.',
      },
    ],
    colours: [],
    heroImageUrl: 'https://www.eagleford.co.za/new/Ranger-Single-Cab/./images/banner.webp',
    heroImageAlt: 'Ford Ranger Single Cab commercial bakkie hero banner — Eagle Ford',
    featureImageUrl: 'https://www.eagleford.co.za/new/Ranger-Single-Cab/./images/hero.webp',
    featureImageAlt: 'Ford Ranger Single Cab model overview — fleet Ford bakkies at Eagle Ford',
    gallery: [
      {
        imageUrl: 'https://www.eagleford.co.za/new/Ranger-Single-Cab/./images/gallery/img_0.webp',
        imageAlt: 'Ford Ranger XL Single Cab Gallery 1',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Ranger-Single-Cab/./images/gallery/img_1.webp',
        imageAlt: 'Ford Ranger XL Single Cab Gallery 2',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Ranger-Single-Cab/./images/gallery/img_2.webp',
        imageAlt: 'Ford Ranger XL Single Cab Gallery 3',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Ranger-Single-Cab/./images/gallery/img_3.webp',
        imageAlt: 'Ford Ranger XL Single Cab Gallery 4',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Ranger-Single-Cab/./images/gallery/img_4.webp',
        imageAlt: 'Ford Ranger XL Single Cab Gallery 5',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Ranger-Single-Cab/./images/gallery/img_5.webp',
        imageAlt: 'Ford Ranger XL Single Cab Gallery 6',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Ranger-Single-Cab/./images/gallery/img_6.webp',
        imageAlt: 'Ford Ranger XL Single Cab Gallery 7',
      },
    ],
    brochureUrl:
      'https://www.eagleford.co.za/new/Ranger-Single-Cab/./files/brochures/20260609-ranger-brochure.pdf',
    brochureAlt: 'Ford Ranger Single Cab brochure PDF download — Eagle Ford South Africa',
    pageUrl: 'https://www.eagleford.co.za/new/ranger-single-cab/',
    variants: [
      {
        name: 'Ranger 2.0 SiT Single Cab XL 4x2 auto',
        slug: 'ranger-2.0-sit-single-cab-xl-4x2-auto',
        featureImageUrl: 'https://www.eagleford.co.za/252886_image.webp',
        featureImageAlt:
          'Ford Ranger 2.0 SiT single cab XL 4x2 auto — Ranger Single Cab model variant at Eagle Ford South Africa',
        price: 590000,
        highlights: [
          '10″ Colour Touchscreen',
          '17″ x 7.5 Alloy Wheels',
          '2.0-Litre Single Turbo Diesel',
          '8″ Digital Colour Instrument Cluster Display',
          'Cruise Control',
          'Maximum Power: 125kW @ 3500rpm',
          'Rear View Camera & Rear Parking Sensors',
        ],
      },
      {
        name: '2.0 SiT Single Cab XL 4x4 Manual',
        slug: '2.0-sit-single-cab-xl-4x4-manual',
        featureImageUrl: 'https://www.eagleford.co.za/252887_image.webp',
        featureImageAlt:
          'Ford 2.0 SiT single cab XL 4x4 manual — Ranger Single Cab model variant at Eagle Ford South Africa',
        price: 635200,
        highlights: [
          '10″ Colour Touchscreen',
          '17″ x 7.5 Alloy Wheels',
          '4x4 with Electronic Shift On The Fly (ESOF)',
          '6-speed manual transmission',
          'Engine Type: 2.0-Litre Single Turbo Diesel',
          'Maximum Power: 125kW @ 3500rpm',
          'Rear View Camera & Rear Parking Sensors',
        ],
      },
      {
        name: 'Ranger 2.0 SiT SuperCab XL 4x4',
        slug: 'ranger-2.0-sit-supercab-xl-4x4',
        featureImageUrl: 'https://www.eagleford.co.za/252888_image.webp',
        featureImageAlt:
          'Ford Ranger 2.0 SiT SuperCab XL 4x4 — Ranger Single Cab model variant at Eagle Ford South Africa',
        price: 675500,
        highlights: [
          'Digital Instrument Cluster with Configurable Display: 8″',
          'Drivetrain: 4WD',
          'Transmission: 10AT',
        ],
      },
    ],
    faqs: [
      {
        question: 'Who is the Ranger Single Cab best suited for?',
        answer:
          'The Single Cab is built for work-first buyers and fleets who need a tough, smart bakkie with a full-size load box — while still offering modern tech for daily driving and site work.',
      },
      {
        question: 'What is the starting price of the Ranger Single Cab?',
        answer:
          'Pricing starts from R 590,000 for the Ranger 2.0 SiT Single Cab XL 4x2 auto. Speak to Eagle Ford for current stock, service plans and fleet deals.',
      },
      {
        question: 'Which Single Cab models are available?',
        answer:
          'Key derivatives include the 2.0 SiT Single Cab XL 4x2 auto and the 2.0 SiT Single Cab XL 4x4 manual. Related SuperCab 4x4 options are also listed for buyers comparing cab styles.',
      },
      {
        question: 'Is a 4x4 Single Cab available?',
        answer:
          'Yes. The 2.0 SiT Single Cab XL 4x4 Manual offers Electronic Shift On The Fly (ESOF) 4x4 with a 6-speed manual — ideal when you need traction on farms, construction sites or gravel routes.',
      },
      {
        question: 'What powertrain does the Single Cab XL use?',
        answer:
          'The XL derivatives use a 2.0-litre single turbo diesel producing up to 125kW at 3,500rpm — a proven workhorse pairing for payload and everyday economy.',
      },
      {
        question: 'What cabin technology is included?',
        answer:
          'Expect a 10-inch colour touchscreen, an 8-inch digital instrument cluster, cruise control, and a rear-view camera with rear parking sensors to help when reversing on busy sites or driveways.',
      },
      {
        question: 'How does Single Cab compare to Super Cab or Double Cab?',
        answer:
          'Single Cab maximises load-box length and keeps the cabin work-focused. Super Cab adds occasional rear access; Double Cab prioritises four proper doors and passenger space. Eagle Ford can help you pick the right layout.',
      },
      {
        question: 'Is the Single Cab comfortable for daily driving?',
        answer:
          'Yes. Beyond rugged looks with a black grille and durable alloys, the coast-to-coast dashboard and digital displays make it feel modern when the bakkie doubles as your office between jobs.',
      },
      {
        question: 'Can I use the Single Cab for light recreational towing?',
        answer:
          'Many buyers do, depending on derivative and load. Tow ratings and GVM limits vary — ask Eagle Ford for the correct specification and accessories for your trailer or equipment.',
      },
      {
        question: 'Does Eagle Ford offer fleet or business purchasing help?',
        answer:
          'Yes. For contractors and fleets, Eagle Ford can advise on derivatives, finance structures and aftersales support so your Single Cab stays earning on the road.',
      },
    ],
  },
  // ── SUVs ───────────────────────────────────────────────────────────────────
  {
    name: 'Next Level Everest',
    slug: 'next-level-everest',
    badge: 'newly-launched',
    categorySlug: 'suvs',
    startingPrice: 825000,
    description:
      'The new 2026 Ford Everest combines rugged capability with modern refinement, featuring a bold front-end design with a distinctive grille, signature C-Clamp LED lighting, steel underbody protection and black exterior accents. Gloss black 18-inch alloy wheels enhance its commanding road presence, while the spacious cabin is equipped with a premium high-tech dashboard, a digital instrument cluster and a large 12-inch touchscreen infotainment system.',
    features: [
      {
        featureImageUrl: 'https://www.eagleford.co.za/Next%20Level%20Everest_img_1.webp',
        featureImageAlt:
          'Next Level Everest Distinctive Front Design — Ford feature and technology highlight',
        featureTitle: 'Distinctive Front Design',
        featureDescription:
          'The distinctive grille with black centre bar and the iconic C-Clamp LEDs creates a rugged look. Steel underbody protection and black fog lamp rings bring it all together.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Next%20Level%20Everest_img_2.webp',
        featureImageAlt:
          'Next Level Everest Built for Weekend Adventures — Ford feature and technology highlight',
        featureTitle: 'Built for Weekend Adventures',
        featureDescription:
          'The Ford Everest features selectable drive modes to help you tackle tough terrain and make you feel more in control.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Next%20Level%20Everest_img_3.webp',
        featureImageAlt:
          'Next Level Everest Eyes Where You Need Them — Ford feature and technology highlight',
        featureTitle: 'Eyes Where You Need Them',
        featureDescription:
          'With Pro-Trailer Backup Assist and 360-Degree Camera, you can reverse your trailer without the pressure.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Next%20Level%20Everest_img_4.webp',
        featureImageAlt:
          'Next Level Everest Flagship Interior — Ford feature and technology highlight',
        featureTitle: 'Flagship Interior',
        featureDescription:
          'The elevated luxury interior features driver & passenger heated & ventilated leather accented seats with driver 10-way power and memory, bespoke inserts, quilt design and signature Platinum badging. A Panoramic Roof adds to the spacious feel.',
      },
    ],
    colours: [],
    heroImageUrl: 'https://www.eagleford.co.za/new/Next-Level-Everest/./images/banner.webp',
    heroImageAlt: 'Ford Next Level Everest SUV adventure hero banner — Eagle Ford',
    featureImageUrl: 'https://www.eagleford.co.za/new/Next-Level-Everest/./images/hero.webp',
    featureImageAlt: 'Ford Next Level Everest model overview — new Ford SUVs at Eagle Ford',
    gallery: [
      {
        imageUrl: 'https://www.eagleford.co.za/new/Next-Level-Everest/./images/gallery/img_0.webp',
        imageAlt: 'Next Level Everest gallery photo 1 — exterior and interior views',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Next-Level-Everest/./images/gallery/img_1.webp',
        imageAlt: 'Next Level Everest gallery photo 2 — exterior and interior views',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Next-Level-Everest/./images/gallery/img_2.webp',
        imageAlt: 'Next Level Everest gallery photo 3 — exterior and interior views',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Next-Level-Everest/./images/gallery/img_3.webp',
        imageAlt: 'Next Level Everest gallery photo 4 — exterior and interior views',
      },
    ],
    brochureUrl:
      'https://www.eagleford.co.za/new/Next-Level-Everest/./files/brochures/22-may-2026-everest-brochure.pdf',
    brochureAlt: 'Ford Next Level Everest brochure PDF download — Eagle Ford South Africa',
    pageUrl: 'https://www.eagleford.co.za/new/next-level-everest/',
    variants: [
      {
        name: '2.0 SiT Active 4x2 10AT',
        slug: '2.0-sit-active-4x2-10at',
        featureImageUrl: 'https://www.eagleford.co.za/253070_image.webp',
        featureImageAlt:
          'Ford 2.0 SiT Active 4x2 10 AT — Next Level Everest model variant at Eagle Ford South Africa',
        price: 825000,
        highlights: [
          '10-speed automatic',
          '12-inch LED portrait screen with SYNC 4A',
          '8-inch Digital instrument cluster',
          '9 Airbags',
          'ANCAP 5 Star Safety Rating',
          'Black front grille & C-Clamp LED headlamps',
          'Drive System: 2WD',
          'Engine: 2.0L Turbo 125kW',
          'Smart Keyless Entry with Push Button Start',
          'Wireless Apple CarPlay & Android Auto',
          'Wireless Charging',
        ],
      },
      {
        name: '2.0 SiT Active 4x4 10AT',
        slug: '2.0-sit-active-4x4-10at',
        featureImageUrl: 'https://www.eagleford.co.za/253089_image.webp',
        featureImageAlt:
          'Ford 2.0 SiT Active 4x4 10 AT — Next Level Everest model variant at Eagle Ford South Africa',
        price: 875000,
        highlights: [
          '10-speed automatic',
          '12-inch LED portrait screen with SYNC 4A',
          '8-inch Digital instrument cluster',
          '9 Airbags',
          'ANCAP 5 Star Safety Rating',
          'Drive System: 4WD',
          'Engine: 2.0L Turbo 125kW',
          'Wireless Apple CarPlay & Android Auto',
          'Wireless Charging',
        ],
      },
      {
        name: '3.0 V6 Sport 4x4 10AT',
        slug: '3.0-v6-sport-4x4-10at',
        featureImageUrl: 'https://www.eagleford.co.za/253090_image.webp',
        featureImageAlt:
          'Ford 3.0 V6 Sport 4x4 10 AT — Next Level Everest model variant at Eagle Ford South Africa',
        price: 1149000,
        highlights: [
          '10-speed automatic',
          '12-inch LED portrait screen with SYNC 4A',
          '8-inch Digital instrument cluster',
          '9 Airbags',
          'Drive System: 4WD',
          'Engine: 3.0L V6 184kW',
          'Pro Power Onboard 400W (230V) Inverter',
          'Wheel Size: 20″ Alloy',
          'Wireless Charging',
        ],
      },
      {
        name: '3.0 V6 Wildtrak 4x4 10AT',
        slug: '3.0-v6-wildtrak-4x4-10at',
        featureImageUrl: 'https://www.eagleford.co.za/253091_image.webp',
        featureImageAlt:
          'Ford 3.0 V6 Wildtrak 4x4 10 AT — Next Level Everest model variant at Eagle Ford South Africa',
        price: 1244000,
        highlights: [
          '10-speed automatic',
          '10-way power driver seat with memory settings',
          '12-inch LED portrait screen with SYNC 4A',
          '7 seats standard',
          'Drive System: e-Shifter (4WD)',
          'Electronic Parking Brake',
          'Engine: 3.0L V6 184kW',
          'Wheel Size: 20″ Alloy',
          'Wildtrak Finish',
          'Wireless Charging',
        ],
      },
      {
        name: '3.0 V6 Platinum 4x4 10AT',
        slug: '3.0-v6-platinum-4x4-10at',
        featureImageUrl: 'https://www.eagleford.co.za/253092_image.webp',
        featureImageAlt:
          'Ford 3.0 V6 Platinum 4x4 10 AT — Next Level Everest model variant at Eagle Ford South Africa',
        price: 1340000,
        highlights: [
          '10-speed automatic',
          '10-way power driver seat with memory settings',
          '12.4-inch Digital instrument cluster',
          '12-inch LED portrait screen with SYNC 4A',
          '7 seats standard',
          'Ambient Lighting',
          'C-Clamp Matrix LED headlamps with auto levelling',
          'Drive System: e-Shifter (4WD)',
          'Electronic Parking Brake',
          'Engine: 3.0L V6 184kW',
          'Leather accented seats with Platinum badging',
          'Panoramic Roof',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the starting price of the Next Level Everest?',
        answer:
          'The Next Level Everest starts from R 825,000 for the 2.0 SiT Active 4x2 10AT. Prices include an optional service plan and exclude packs and factory options unless stated otherwise.',
      },
      {
        question: 'How many seats does the Ford Everest have?',
        answer:
          'Higher Wildtrak and Platinum derivatives include 7 seats as standard, making the Everest a strong choice for larger families who still want off-road capability and towing confidence.',
      },
      {
        question: 'Which Everest trims can I choose from?',
        answer:
          'The range includes 2.0 SiT Active 4x2 and 4x4, plus 3.0 V6 Sport, Wildtrak and Platinum 4x4 models — stepping up in luxury, wheels, seats and driver assistance as you move through the line-up.',
      },
      {
        question: 'What is the difference between Active 4x2 and Active 4x4?',
        answer:
          'Both Active models use the 2.0L turbo (125kW) with a 10-speed automatic, 12-inch SYNC 4A screen and strong safety kit. The 4x4 adds all-wheel traction for gravel, adventure trips and variable weather.',
      },
      {
        question: 'Is the Everest good for towing?',
        answer:
          'Yes — features such as Pro-Trailer Backup Assist and a 360-degree camera help take the stress out of reversing with a trailer. Confirm tow ratings for your chosen derivative with Eagle Ford.',
      },
      {
        question: 'What engines are available in the Next Level Everest?',
        answer:
          'Choose the efficient 2.0L turbo diesel in Active models, or step up to the 3.0L V6 (184kW) in Sport, Wildtrak and Platinum for stronger performance and presence.',
      },
      {
        question: 'What technology is in the Everest cabin?',
        answer:
          'Expect a premium dashboard with a digital instrument cluster and a large 12-inch portrait touchscreen with SYNC 4A, wireless Apple CarPlay/Android Auto and wireless charging on key derivatives.',
      },
      {
        question: 'What makes the Everest Platinum the flagship?',
        answer:
          'Platinum adds a luxury-focused cabin with leather-accented heated and ventilated seats, 10-way power driver seat with memory, a 12.4-inch digital cluster, Matrix LED headlamps, ambient lighting and a panoramic roof.',
      },
      {
        question: 'Does the Everest have selectable drive modes?',
        answer:
          'Yes. Selectable drive modes help you tackle tougher terrain with more control — ideal for weekend adventures beyond the tar.',
      },
      {
        question: 'Can I arrange a test drive of the Next Level Everest at Eagle Ford?',
        answer:
          'Yes. Contact Eagle Ford to book a drive, discuss Active through Platinum specifications, and get a finance quote based on your preferred derivative and extras.',
      },
    ],
  },
  {
    name: 'New Level Territory',
    slug: 'new-level-territory',
    badge: 'newly-launched',
    categorySlug: 'suvs',
    startingPrice: 489900,
    description:
      'Command looks everywhere you go with a bold new grille design and sharp, illuminating LED headlamps giving Territory an unmistakable character on any road.',
    features: [
      {
        featureImageUrl: 'https://www.eagleford.co.za/New%20Level%20Territory_img_1.webp',
        featureImageAlt:
          'New Level Territory Striking Exterior and Cutting-Edge Features — Ford feature and technology highlight',
        featureTitle: 'Striking Exterior and Cutting-Edge Features',
        featureDescription:
          'The dynamic Ford Territory catches your eye instantly with its imposing exterior, sleek interior, available 19-inch alloy wheels, full LED headlamps and tail lamps, and LED daytime running lights.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/New%20Level%20Territory_img_3.webp',
        featureImageAlt:
          'New Level Territory More Space, Advanced Tech and Safety — Ford feature and technology highlight',
        featureTitle: 'More Space, Advanced Tech and Safety',
        featureDescription:
          'Next-level Technology including 12″ Digital touchscreen, 12.3″ Digital cluster, Arkamys 3D audio system and Apple CarPlay & Android Auto.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/New%20Level%20Territory_img_2.webp',
        featureImageAlt:
          'New Level Territory Spacious Interior and Premium Design — Ford feature and technology highlight',
        featureTitle: 'Spacious Interior and Premium Design',
        featureDescription:
          "Designed with your comfort in mind, Territory's interior gives you ample legroom and cargo space.",
      },
    ],
    colours: [],
    heroImageUrl: 'https://www.eagleford.co.za/new/New-Level-Territory/./images/banner.webp',
    heroImageAlt: 'Ford New Level Territory family SUV hero banner — Eagle Ford',
    featureImageUrl: 'https://www.eagleford.co.za/new/New-Level-Territory/./images/hero.webp',
    featureImageAlt: 'Ford New Level Territory model overview — Ford SUVs at Eagle Ford',
    gallery: [
      {
        imageUrl: 'https://www.eagleford.co.za/new/New-Level-Territory/./images/gallery/img_0.webp',
        imageAlt: 'Ford Territory Gallery 1',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/New-Level-Territory/./images/gallery/img_1.webp',
        imageAlt: 'Ford Territory Gallery 2',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/New-Level-Territory/./images/gallery/img_2.webp',
        imageAlt: 'Ford Territory Gallery 3',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/New-Level-Territory/./images/gallery/img_3.webp',
        imageAlt: 'Ford Territory Gallery 5',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/New-Level-Territory/./images/gallery/img_4.webp',
        imageAlt: 'Ford Territory Gallery 6',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/New-Level-Territory/./images/gallery/img_5.webp',
        imageAlt: 'Ford Territory Gallery 7',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/New-Level-Territory/./images/gallery/img_6.webp',
        imageAlt: 'Ford Territory Gallery 8',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/New-Level-Territory/./images/gallery/img_7.webp',
        imageAlt: 'Ford Territory Gallery 9',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/New-Level-Territory/./images/gallery/img_8.webp',
        imageAlt: 'Ford Territory Gallery 11',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/New-Level-Territory/./images/gallery/img_9.webp',
        imageAlt: 'Ford Territory Gallery 10',
      },
    ],
    brochureUrl:
      'https://www.eagleford.co.za/new/New-Level-Territory/./files/brochures/20260410-territory-brochure.pdf',
    brochureAlt: 'Ford New Level Territory brochure PDF download — Eagle Ford South Africa',
    pageUrl: 'https://www.eagleford.co.za/new/new-level-territory/',
    variants: [
      {
        name: 'Territory 1.8T Ambiente',
        slug: 'territory-1.8t-ambiente',
        featureImageUrl: 'https://www.eagleford.co.za/252953_image.webp',
        featureImageAlt:
          'Ford Territory 1.8T Ambiente — New Level Territory model variant at Eagle Ford South Africa',
        price: 489900,
        highlights: [
          '12″ Colour Touchscreen',
          '7″ Cluster TFT with Two Analog Gauges',
          'Arkamys 3D Audio System',
          'Drive Configuration: FWD',
          'Electronically Powered Tailgate',
          'Engine: 1.8L GTDi EcoBoost®',
          'Power: 138kW @ 5200rpm',
          'Speakers x 6',
          'Stop/Start',
          'Torque: 318Nm @ 1750-3000rpm',
        ],
      },
      {
        name: 'Territory 1.8T Trend',
        slug: 'territory-1.8t-trend',
        featureImageUrl: 'https://www.eagleford.co.za/252954_image.webp',
        featureImageAlt:
          'Ford Territory 1.8T Trend — New Level Territory model variant at Eagle Ford South Africa',
        price: 539900,
        highlights: [
          '12″ Colour Touchscreen',
          '7″ Cluster TFT with Two Analog Gauges',
          'Arkamys 3D Audio System',
          'Drive Configuration: FWD',
          'Electronically Powered Tailgate',
          'Engine: 1.8L GTDi EcoBoost®',
          'Power: 138kW @ 5200rpm',
          'Speakers x 6',
          'Stop/Start',
          'Torque: 318Nm @ 1750-3000rpm',
          'Type: 7-speed automatic',
        ],
      },
      {
        name: '1.8T Titanium',
        slug: '1.8t-titanium',
        featureImageUrl: 'https://www.eagleford.co.za/252955_image.webp',
        featureImageAlt:
          'Ford 1.8T Titanium — New Level Territory model variant at Eagle Ford South Africa',
        price: 599900,
        highlights: [
          '12″ Colour Touchscreen',
          '19" Alloy Wheels',
          '7″ Cluster TFT with Two Analog Gauges',
          'Speakers x 6',
          'Stop/Start',
          '360 Degree Camera',
          'Arkamys 3D Audio System',
          'Drive Configuration: FWD',
          'Electronically Powered Tailgate',
          'Engine: 1.8L GTDi EcoBoost®',
          'Power: 138kW @ 5200rpm',
          'Premium Black Leather Seats with Manuka Tan Inserts',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the starting price of the New Level Territory?',
        answer:
          'The Territory range starts from R 489,900 for the 1.8T Ambiente. It is Ford’s more accessible SUV option compared with Everest, while still offering bold styling and modern tech.',
      },
      {
        question: 'How does Territory compare to a bakkie like the Ranger?',
        answer:
          'Territory is a passenger-focused SUV with a car-like cabin, cargo space and FWD EcoBoost performance. Choose Ranger when you need a load box, higher payloads or serious 4x4 work — Eagle Ford can help you decide.',
      },
      {
        question: 'Which Territory trims are available?',
        answer:
          'Choose Ambiente, Trend or Titanium. All use the 1.8L GTDi EcoBoost petrol engine; higher trims add refinement such as a 7-speed automatic (Trend) and premium leather plus a 360-degree camera (Titanium).',
      },
      {
        question: 'What engine does the Territory use?',
        answer:
          'Every listed derivative uses Ford’s 1.8L GTDi EcoBoost engine producing 138kW at 5,200rpm and 318Nm between 1,750 and 3,000rpm, with stop/start for efficiency in traffic.',
      },
      {
        question: 'Is the Territory front-wheel drive?',
        answer:
          'Yes. The Ambiente, Trend and Titanium models are specified with FWD — ideal for urban commuting, family travel and highway trips without the complexity of a 4x4 platform.',
      },
      {
        question: 'What technology comes with Territory?',
        answer:
          'Expect a 12-inch colour touchscreen, Arkamys 3D audio, an electronically powered tailgate, and smartphone connectivity. Higher specs emphasise comfort and camera/safety convenience.',
      },
      {
        question: 'What makes the Titanium the top Territory?',
        answer:
          'Titanium adds 19-inch alloys, a 360-degree camera and premium black leather seats with Manuka Tan inserts — a more premium look and everyday convenience package.',
      },
      {
        question: 'Is Territory a good family SUV?',
        answer:
          'Yes. It pairs spacious legroom and cargo space with striking LED lighting and a modern interior designed for comfort on school runs, weekends and longer trips.',
      },
      {
        question: 'Does Territory have a powered tailgate?',
        answer:
          'Yes — an electronically powered tailgate is listed across Ambiente, Trend and Titanium, making loading shopping or luggage easier when your hands are full.',
      },
      {
        question: 'Can I finance a Territory at Eagle Ford?',
        answer:
          'Yes. Eagle Ford can structure Ford finance around Ambiente, Trend or Titanium, including trade-in valuations and monthly payment illustrations for your budget.',
      },
    ],
  },
  // ── Passenger Cars ─────────────────────────────────────────────────────────
  {
    name: 'Mustang GT',
    slug: 'mustang-gt',
    categorySlug: 'passenger-cars',
    startingPrice: 1350000,
    description:
      'Stay ahead of the pack. Choose iconic power with an elegant style. Mustang GT 5.0L V8 Engine. Fastback Bodystyle. Top Speed 250 km/h. 7th Generation. Iconic legacy.',
    features: [
      {
        featureImageUrl: 'https://www.eagleford.co.za/Mustang%20GT_img_1.webp',
        featureImageAlt: 'Mustang GT Flexible Drive Modes — Ford feature and technology highlight',
        featureTitle: 'Flexible Drive Modes',
        featureDescription:
          'Get familiar with fearlessness and move better on various terrains with Normal, Sport, Track, Drag Strip, Slippery or Custom drive modes.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Mustang%20GT_img_2.webp',
        featureImageAlt:
          'Mustang GT Pulse-Raising 5.0L V8 Engine — Ford feature and technology highlight',
        featureTitle: 'Pulse-Raising 5.0L V8 Engine',
        featureDescription:
          'The 2024 Mustang GT with the Gen-4 5.0L Coyote V8 engine generates a track-ready 328kW of power and 540Nm of torque.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Mustang%20GT_img_3.webp',
        featureImageAlt:
          'Mustang GT Styled for Performance — Ford feature and technology highlight',
        featureTitle: 'Styled for Performance',
        featureDescription:
          "Every 2024 Mustang GT Model comes with a distinctive, raised wedge decklid spoiler that's painted to match the selected body colour.",
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Mustang%20GT_img_4.webp',
        featureImageAlt:
          'Mustang GT Intelligent and Good Looking — Ford feature and technology highlight',
        featureTitle: 'Intelligent and Good Looking',
        featureDescription:
          'An iconic drive is always at your fingertips. The Mustang GT is here with Intelligent Access through its Push-button Start function.',
      },
    ],
    colours: [
      {
        colourName: 'Race Red',
        colourImageAlt: 'Mustang GT exterior in Race Red paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/e96c8de2-92ec-4a05-940a-611012f6da14_image-700x400.webp',
      },
      {
        colourName: 'Adriatic Blue',
        colourImageAlt: 'Mustang GT exterior in Adriatic Blue paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/cedf4b06-9706-42e0-8160-c6f7747b4644_image-700x400-1-.webp',
      },
      {
        colourName: 'Orange Fury',
        colourImageAlt: 'Mustang GT exterior in Orange Fury paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/66d6c52a-fee1-4888-8934-18f2c10cb243_image-700x400-2-.webp',
      },
      {
        colourName: 'Iconic Silver',
        colourImageAlt: 'Mustang GT exterior in Iconic Silver paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/4d36cbc7-b8a7-4a84-aa3c-b5a0a96721fa_image-700x400-3-.webp',
      },
      {
        colourName: 'Carbonized Gray',
        colourImageAlt: 'Mustang GT exterior in Carbonized Gray paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/f01f2692-22cd-49f5-b141-7d4322e3df86_image-700x400-4-.webp',
      },
      {
        colourName: 'Vapor Blue',
        colourImageAlt: 'Mustang GT exterior in Vapor Blue paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/b5bbfbe7-463c-4483-896e-0f7eb72e1368_image-700x400-5-.webp',
      },
      {
        colourName: 'Molten Magenta',
        colourImageAlt: 'Mustang GT exterior in Molten Magenta paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/b384d21e-147d-4b6d-a0b2-95027fad205d_image-700x400-6-.webp',
      },
      {
        colourName: 'Oxford White',
        colourImageAlt: 'Mustang GT exterior in Oxford White paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/ffdd41e7-de44-496d-9f72-2c63275c3231_image-700x400-7-.webp',
      },
      {
        colourName: 'Absolute Black',
        colourImageAlt: 'Mustang GT exterior in Absolute Black paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/c2727cd6-91bc-4450-a956-d1945bef3f05_image-700x400-8-.webp',
      },
    ],
    heroImageUrl: 'https://www.eagleford.co.za/new/Mustang-GT/./images/banner.webp',
    heroImageAlt: 'Ford Mustang GT 5.0L V8 Fastback performance hero banner — Eagle Ford',
    featureImageUrl: 'https://www.eagleford.co.za/new/Mustang-GT/./images/hero.webp',
    featureImageAlt: 'Ford Mustang GT model overview — Ford performance cars at Eagle Ford',
    gallery: [
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-GT/./images/gallery/img_0.webp',
        imageAlt: 'Red Ford Mustang GT Front 3/4 action shot',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-GT/./images/gallery/img_1.webp',
        imageAlt:
          'Red Ford Mustang GT rear action shot driving through on an open mountain pass road',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-GT/./images/gallery/img_2.webp',
        imageAlt:
          'Red Ford Mustang GT Front 3/4 action shot driving through on an open mountain pass road',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-GT/./images/gallery/img_3.webp',
        imageAlt:
          'Ford Mustang GT Interior shot pov is from the backset looking towards the whole front dashboard showcasing modern interior',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-GT/./images/gallery/img_4.webp',
        imageAlt: 'Ford Mustang GT wireless phone on charger close up shot',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-GT/./images/gallery/img_5.webp',
        imageAlt:
          'Ford Mustang GT steering wheel close up shot pov showcasing modern leather steering wheel with multifunctionaility media buttons',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-GT/./images/gallery/img_6.webp',
        imageAlt:
          'Ford Mustang GT close up shot from the passenger door looking towards the driver side area',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-GT/./images/gallery/img_7.webp',
        imageAlt:
          'Ford Mustang GT close up shot from the passenger door looking into the backseat area',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-GT/./images/gallery/img_8.webp',
        imageAlt: 'Red Ford Mustang GT Front close up shot with lights on in the evening',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-GT/./images/gallery/img_9.webp',
        imageAlt: 'Red Ford Mustang GT rear close up shot with lights on in the evening',
      },
    ],
    brochureUrl:
      'https://www.eagleford.co.za/new/Mustang-GT/./files/brochures/mustang-reader-proof.pdf',
    brochureAlt: 'Ford Mustang GT brochure PDF download — Eagle Ford South Africa',
    pageUrl: 'https://www.eagleford.co.za/new/mustang-gt/',
    variants: [
      {
        name: 'MUSTANG 5.0L V8 GT FASTBACK 10AT',
        slug: 'mustang-5.0l-v8-gt-fastback-10at',
        featureImageUrl: 'https://www.eagleford.co.za/120158_image.webp',
        featureImageAlt:
          'Ford MUSTANG 5.0L V8 GT FASTBACK 10AT — Mustang GT model variant at Eagle Ford South Africa',
        price: 1350000,
        highlights: [
          'Automatic',
          'Average Range: 469km',
          'Fuel Tank size: 61L',
          'Number of seats: 2',
          'Petrol',
          'Power output: 328kW',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the starting price of the Mustang GT?',
        answer:
          'The Mustang GT Fastback starts from R 1,350,000 for the 5.0L V8 GT Fastback 10AT. Confirm current pricing, colours and finance options with Eagle Ford.',
      },
      {
        question: 'What engine and power does the Mustang GT offer?',
        answer:
          'The 7th-generation Mustang GT uses the Gen-4 5.0L Coyote V8 delivering 328kW and 540Nm — iconic naturally aspirated V8 performance in Fastback form.',
      },
      {
        question: 'What bodystyle is the Mustang GT?',
        answer:
          'The listed model is a Fastback with a raised wedge decklid spoiler body-coloured to match — the classic Mustang silhouette for everyday drama and weekend thrills.',
      },
      {
        question: 'Which drive modes are available on the Mustang GT?',
        answer:
          'Selectable modes include Normal, Sport, Track, Drag Strip, Slippery and Custom, so you can tailor throttle and chassis character to road or track conditions.',
      },
      {
        question: 'How fast is the Mustang GT?',
        answer:
          'The Mustang GT is rated with a top speed of 250 km/h. Always drive responsibly and within legal limits — performance figures are for capability context.',
      },
      {
        question: 'How many seats does the Mustang GT have?',
        answer:
          'The Fastback derivative listed is specified with 2 seats in the seed data used here — confirm seating layout and rear packaging when you view the vehicle at Eagle Ford.',
      },
      {
        question: 'What fuel range can I expect?',
        answer:
          'Quoted average range is around 469km from a 61L petrol tank, depending on driving style, mode selection and conditions.',
      },
      {
        question: 'What exterior colours are available?',
        answer:
          'Colours include Race Red, Adriatic Blue, Orange Fury, Iconic Silver, Carbonized Gray, Vapor Blue, Molten Magenta, Oxford White and Absolute Black — subject to stock.',
      },
      {
        question: 'Does the Mustang GT have keyless / push-button start?',
        answer:
          'Yes. Intelligent Access with Push-button Start keeps the iconic drive ready at your fingertips without a traditional key turn.',
      },
      {
        question: 'Should I choose Mustang GT or Dark Horse?',
        answer:
          'Choose GT for iconic 328kW V8 Fastback thrills. Dark Horse steps further toward track focus with higher power and MagneRide damping. Eagle Ford can demo both mindsets.',
      },
    ],
  },
  {
    name: 'Mustang Dark Horse',
    slug: 'mustang-dark-horse',
    categorySlug: 'passenger-cars',
    startingPrice: 1545000,
    description:
      'Street legal. Track ready. Experience the thrill of the New Mustang Dark Horse as it roars to life, drowning out all distractions with its exhilarating athleticism.',
    features: [
      {
        featureImageUrl: 'https://www.eagleford.co.za/Mustang%20Dark%20Horse_img_1.webp',
        featureImageAlt:
          'Mustang Dark Horse A Track-Ready Powerhouse — Ford feature and technology highlight',
        featureTitle: 'A Track-Ready Powerhouse',
        featureDescription:
          'Kick out 334kW of power and 540Nm of torque, and leave behind the pack in the Mustang Dark Horse.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Mustang%20Dark%20Horse_img_2.webp',
        featureImageAlt: 'Mustang Dark Horse Iconic Looks — Ford feature and technology highlight',
        featureTitle: 'Iconic Looks',
        featureDescription:
          'Signature Dark Horse Lettering and badging throughout the Dark Horse make for an iconic aesthetic.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Mustang%20Dark%20Horse_img_3.webp',
        featureImageAlt:
          'Mustang Dark Horse Precision Shifting at Every Turn — Ford feature and technology highlight',
        featureTitle: 'Precision Shifting at Every Turn',
        featureDescription:
          'Take the streets by surprise and let the Mustang Dark Horse do the talking with its MagneRide® Damping System and 6 Selectable Drive Modes.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Mustang%20Dark%20Horse_img_4.webp',
        featureImageAlt:
          'Mustang Dark Horse Feel The Flow of Pure Power — Ford feature and technology highlight',
        featureTitle: 'Feel The Flow of Pure Power',
        featureDescription:
          'Harness precision and unbridled power in the Mustang Dark Horse. Featuring Active Valve Performance Exhaust System and Remote Rev.',
      },
    ],
    colours: [
      {
        colourName: 'Race Red',
        colourImageAlt: 'Mustang Dark Horse exterior in Race Red paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/99bff3b9-68a1-49f8-9738-9136f3a017be_image-700x400--2-.webp',
      },
      {
        colourName: 'Carbonized Gray',
        colourImageAlt: 'Mustang Dark Horse exterior in Carbonized Gray paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/2940f1a4-f76b-44a0-9a9a-a29900de91e0_image-700x400.webp',
      },
      {
        colourName: 'Blue Ember',
        colourImageAlt: 'Mustang Dark Horse exterior in Blue Ember paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/0e5c6cce-0bf1-46a5-bb86-ed501015cdbd_image-700x400--1-.webp',
      },
      {
        colourName: 'Oxford White',
        colourImageAlt: 'Mustang Dark Horse exterior in Oxford White paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/aa957a98-80e0-49ce-862d-7442de26ec0b_image-700x400.webp',
      },
    ],
    heroImageUrl: 'https://www.eagleford.co.za/new/Mustang-Dark-Horse/./images/banner.webp',
    heroImageAlt: 'Ford Mustang Dark Horse track-ready performance hero banner — Eagle Ford',
    featureImageUrl: 'https://www.eagleford.co.za/new/Mustang-Dark-Horse/./images/hero.webp',
    featureImageAlt: 'Ford Mustang Dark Horse model overview — Ford performance at Eagle Ford',
    gallery: [
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-Dark-Horse/./images/gallery/img_0.webp',
        imageAlt: 'Mustang Dark Horse gallery photo 1 — exterior and interior views',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-Dark-Horse/./images/gallery/img_1.webp',
        imageAlt: 'Mustang Dark Horse gallery photo 2 — exterior and interior views',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-Dark-Horse/./images/gallery/img_2.webp',
        imageAlt: 'Mustang Dark Horse gallery photo 3 — exterior and interior views',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-Dark-Horse/./images/gallery/img_3.webp',
        imageAlt: 'Mustang Dark Horse gallery photo 4 — exterior and interior views',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-Dark-Horse/./images/gallery/img_4.webp',
        imageAlt: 'Mustang Dark Horse gallery photo 5 — exterior and interior views',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-Dark-Horse/./images/gallery/img_5.webp',
        imageAlt: 'Mustang Dark Horse gallery photo 6 — exterior and interior views',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-Dark-Horse/./images/gallery/img_6.webp',
        imageAlt: 'Mustang Dark Horse gallery photo 7 — exterior and interior views',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-Dark-Horse/./images/gallery/img_7.webp',
        imageAlt: 'Mustang Dark Horse gallery photo 8 — exterior and interior views',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-Dark-Horse/./images/gallery/img_8.webp',
        imageAlt: 'Mustang Dark Horse gallery photo 9 — exterior and interior views',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-Dark-Horse/./images/gallery/img_9.webp',
        imageAlt: 'Mustang Dark Horse gallery photo 10 — exterior and interior views',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Mustang-Dark-Horse/./images/gallery/img_10.webp',
        imageAlt: 'Mustang Dark Horse gallery photo 11 — exterior and interior views',
      },
    ],
    brochureUrl:
      'https://www.eagleford.co.za/new/Mustang-Dark-Horse/./files/brochures/mustang-reader-proof.pdf',
    brochureAlt: 'Ford Mustang Dark Horse brochure PDF download — Eagle Ford South Africa',
    pageUrl: 'https://www.eagleford.co.za/new/mustang-dark-horse/',
    variants: [
      {
        name: 'MUSTANG 5.0L V8 DARK HORSE 10AT',
        slug: 'mustang-5.0l-v8-dark-horse-10at',
        featureImageUrl: 'https://www.eagleford.co.za/159410_image.webp',
        featureImageAlt:
          'Ford MUSTANG 5.0L V8 DARK HORSE 10AT — Mustang Dark Horse model variant at Eagle Ford South Africa',
        price: 1545000,
        highlights: [
          'Automatic',
          'Average Range: 469km',
          'Fuel Tank size: 61L',
          'Number of seats: 2',
          'Petrol',
          'Power output: 334kW',
          'MagneRide® Damping System',
          '6 Selectable Drive Modes',
          'Active Valve Performance Exhaust System',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the starting price of the Mustang Dark Horse?',
        answer:
          'The Mustang Dark Horse starts from R 1,545,000 for the 5.0L V8 Dark Horse 10AT. Contact Eagle Ford for availability, colours and personalised finance.',
      },
      {
        question: 'How does Dark Horse differ from the Mustang GT?',
        answer:
          'Dark Horse is the more track-oriented Mustang — producing 334kW versus the GT’s 328kW, with MagneRide® damping, Active Valve Performance Exhaust and signature Dark Horse badging throughout.',
      },
      {
        question: 'What is MagneRide® and why does it matter?',
        answer:
          'MagneRide® is an advanced damping system that helps the Dark Horse stay composed and precise through corners — bridging street manners and track-ready control.',
      },
      {
        question: 'How many drive modes does Dark Horse offer?',
        answer:
          'Six selectable drive modes let you change the car’s character for everyday roads or more aggressive driving, working together with the performance chassis hardware.',
      },
      {
        question: 'What power and torque does Dark Horse produce?',
        answer:
          'Expect 334kW and 540Nm from the 5.0L V8 — street-legal performance with a clear focus on athleticism and drama.',
      },
      {
        question: 'Does Dark Horse have a performance exhaust?',
        answer:
          'Yes. An Active Valve Performance Exhaust System (plus Remote Rev) helps deliver the soundtrack and response that Dark Horse owners expect.',
      },
      {
        question: 'What transmission is offered?',
        answer:
          'The listed Dark Horse derivative uses a 10-speed automatic transmission for quick, precise shifts whether you’re commuting or pushing harder on a closed circuit.',
      },
      {
        question: 'What colours can I order?',
        answer:
          'Available colours include Race Red, Carbonized Gray, Blue Ember and Oxford White. Stock and factory availability can change — verify with Eagle Ford.',
      },
      {
        question: 'Is Dark Horse practical as a daily driver?',
        answer:
          'It is street legal and usable day to day, but it is engineered with a track-ready mindset. If you want softer GT character instead, compare both models with Eagle Ford.',
      },
      {
        question: 'Can I book a Dark Horse experience at Eagle Ford?',
        answer:
          'Yes. Reach out to arrange a viewing or test drive, discuss specification details and explore Ford finance for this flagship Mustang.',
      },
    ],
  },
  // ── Vans & Buses ───────────────────────────────────────────────────────────
  {
    name: 'New Tourneo Custom',
    slug: 'new-tourneo-custom',
    categorySlug: 'vans-and-buses',
    startingPrice: 1117500,
    description:
      'Ford Tourneo Custom. Feels like home. With an elevated look and increased passenger comfort, the Tourneo Custom is for family, play or business.',
    features: [
      {
        featureImageUrl: 'https://www.eagleford.co.za/New%20Tourneo%20Custom_img_1.webp',
        featureImageAlt:
          'New Tourneo Custom Power and Torque Meet Efficiency — Ford feature and technology highlight',
        featureTitle: 'Power and Torque Meet Efficiency',
        featureDescription:
          '2.0L Ford EcoBlue Diesel Engine. 7.4l/180 KM outstanding fuel efficiency. 8-Speed Automatic transmission.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/New%20Tourneo%20Custom_img_2.webp',
        featureImageAlt:
          'New Tourneo Custom Space for Any Tour — Ford feature and technology highlight',
        featureTitle: 'Space for Any Tour',
        featureDescription:
          'With a modern platform, the Tourneo Custom 8-seater provides a range of seating configurations, making it ideal for transporting passengers or equipment.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/New%20Tourneo%20Custom_img_3.webp',
        featureImageAlt:
          'New Tourneo Custom A Mode for Your Every Muse — Ford feature and technology highlight',
        featureTitle: 'A Mode for Your Every Muse',
        featureDescription:
          'Enjoy a choice of Drive Modes: Normal, Eco, Sport, Slippery, and Trail. The system adjusts various settings including throttle response.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/New%20Tourneo%20Custom_img_4.webp',
        featureImageAlt:
          'New Tourneo Custom Comfort and Tech — Ford feature and technology highlight',
        featureTitle: 'Comfort and Tech',
        featureDescription:
          "13\u2033 Touchscreen display. 5G Embedded modem. 4-Way Adjustable driver's seat with lumbar support.",
      },
    ],
    colours: [
      {
        colourName: 'Magnetic',
        colourImageAlt: 'New Tourneo Custom exterior in Magnetic paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/34fce414-d503-404b-8e3c-007f1c930d39default.webp',
      },
      {
        colourName: 'Chrome Blue',
        colourImageAlt: 'New Tourneo Custom exterior in Chrome Blue paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/3cf5ff4c-af7b-4054-aaf7-a06b5c28355edefault.webp',
      },
      {
        colourName: 'Agate Black',
        colourImageAlt: 'New Tourneo Custom exterior in Agate Black paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/0cdb5a9c-e3df-4ed6-a01e-e89cb8fb0be5default.webp',
      },
      {
        colourName: 'Moondust Silver',
        colourImageAlt: 'New Tourneo Custom exterior in Moondust Silver paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/c03c239f-18e6-44cd-981d-4bb8c4e4b46fdefault.webp',
      },
      {
        colourName: 'Blazer Blue',
        colourImageAlt: 'New Tourneo Custom exterior in Blazer Blue paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/74b06af3-93f1-4075-a3fa-4e9313b51667default.webp',
      },
      {
        colourName: 'Race Red',
        colourImageAlt: 'New Tourneo Custom exterior in Race Red paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/c46911e6-6835-44e8-9d08-83d603c429f1_image-700x400--2-.webp',
      },
      {
        colourName: 'Frozen White',
        colourImageAlt: 'New Tourneo Custom exterior in Frozen White paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/4ed0abdf-86cd-44d7-9b58-2f0d04f81bc6_image-700x400.webp',
      },
    ],
    heroImageUrl: 'https://www.eagleford.co.za/new/New-Tourneo-Custom/./images/banner.webp',
    heroImageAlt: 'Ford Tourneo Custom 8-seater people mover hero banner — Eagle Ford',
    featureImageUrl: 'https://www.eagleford.co.za/new/New-Tourneo-Custom/./images/hero.webp',
    featureImageAlt: 'Ford Tourneo Custom model overview — Ford vans and buses at Eagle Ford',
    gallery: [
      {
        imageUrl: 'https://www.eagleford.co.za/new/New-Tourneo-Custom/./images/gallery/img_0.webp',
        imageAlt: 'Ford Tourneo Custom',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/New-Tourneo-Custom/./images/gallery/img_1.webp',
        imageAlt: 'Ford Tourneo Custom — photo 2',
      },
    ],
    brochureUrl:
      'https://www.eagleford.co.za/new/New-Tourneo-Custom/./files/brochures/14-may-2026-tourneo-bus.pdf',
    brochureAlt: 'Ford New Tourneo Custom brochure PDF download — Eagle Ford South Africa',
    pageUrl: 'https://www.eagleford.co.za/new/new-tourneo-custom/',
    variants: [
      {
        name: 'Tourneo Trend',
        slug: 'tourneo-trend',
        featureImageUrl: 'https://www.eagleford.co.za/112033_image.webp',
        featureImageAlt:
          'Ford Tourneo Trend — New Tourneo Custom model variant at Eagle Ford South Africa',
        price: 1117500,
        highlights: [
          'Automatic',
          'Average Range: 946km',
          'Diesel',
          'Fuel Tank size: 70L',
          'Number of seats: 8',
          'Power output: 100kW',
        ],
      },
      {
        name: 'Tourneo Sport',
        slug: 'tourneo-sport',
        featureImageUrl: 'https://www.eagleford.co.za/146995_image.webp',
        featureImageAlt:
          'Ford Tourneo Sport — New Tourneo Custom model variant at Eagle Ford South Africa',
        price: 1232000,
        highlights: [
          'Automatic',
          'Average Range: 1081km',
          'Diesel',
          'Fuel Tank size: 80L',
          'Number of seats: 8',
          'Power output: 125kW',
        ],
      },
      {
        name: 'Tourneo Titanium X',
        slug: 'tourneo-titanium-x',
        featureImageUrl: 'https://www.eagleford.co.za/146996_image.webp',
        featureImageAlt:
          'Ford Tourneo Titanium X — New Tourneo Custom model variant at Eagle Ford South Africa',
        price: 1278500,
        highlights: [
          'Automatic',
          'Average Range: 1081km',
          'Diesel',
          'Fuel Tank size: 80L',
          'Number of seats: 8',
          'Power output: 125kW',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the New Tourneo Custom best used for?',
        answer:
          'Tourneo Custom is a passenger-focused people mover for family travel, shuttle work or business hosting — more comfort-oriented than a pure cargo van, with 8-seat flexibility.',
      },
      {
        question: 'What is the starting price of the Tourneo Custom?',
        answer:
          'Pricing starts from R 1,117,500 for Tourneo Trend. Sport and Titanium X step up in power, range and specification — ask Eagle Ford for current quotes.',
      },
      {
        question: 'How many seats does the Tourneo Custom have?',
        answer:
          'It is specified as an 8-seater with seating configurations that can adapt for passengers or equipment, depending how you set up the cabin.',
      },
      {
        question: 'Which Tourneo trims are available?',
        answer:
          'Choose Trend (100kW), Sport (125kW) or Titanium X (125kW). Higher trims add stronger performance and longer quoted average range with a larger fuel tank.',
      },
      {
        question: 'What engine and transmission does it use?',
        answer:
          'Tourneo Custom uses a 2.0L Ford EcoBlue diesel with an 8-speed automatic, balancing torque for passenger loads with strong claimed fuel efficiency.',
      },
      {
        question: 'What drive modes are available?',
        answer:
          'Selectable modes include Normal, Eco, Sport, Slippery and Trail, adjusting settings such as throttle response to suit the journey.',
      },
      {
        question: 'What technology is onboard?',
        answer:
          'Expect a large 13-inch touchscreen, 5G embedded modem connectivity and a supportive 4-way adjustable driver’s seat with lumbar support for longer trips.',
      },
      {
        question: 'How far can Tourneo Custom travel on a tank?',
        answer:
          'Quoted average range is about 946km on Trend (70L tank) and around 1,081km on Sport and Titanium X (80L tank), depending on load and driving style.',
      },
      {
        question: 'What colours can I choose?',
        answer:
          'Colours include Magnetic, Chrome Blue, Agate Black, Moondust Silver, Blazer Blue, Race Red and Frozen White — subject to stock at Eagle Ford.',
      },
      {
        question: 'Is Tourneo Custom the same as Transit Custom?',
        answer:
          'No. Tourneo Custom prioritises people-carrying comfort; Transit Custom is the commercial cargo sibling focused on load volume and payload. Eagle Ford can compare both for your use case.',
      },
    ],
  },
  {
    name: 'New Transit Custom',
    slug: 'new-transit-custom',
    categorySlug: 'vans-and-buses',
    startingPrice: 770000,
    description: 'The Ford Transit Custom, Always Delivers. Built to get the job done.',
    features: [
      {
        featureImageUrl: 'https://www.eagleford.co.za/New%20Transit%20Custom_img_1.webp',
        featureImageAlt:
          'New Transit Custom Load Capacity and Payload — Ford feature and technology highlight',
        featureTitle: 'Load Capacity and Payload',
        featureDescription: '5.8m³ of load area space. Up to 1,269kg max gross payload.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/New%20Transit%20Custom_img_2.webp',
        featureImageAlt:
          'New Transit Custom Selectable Drive Modes — Ford feature and technology highlight',
        featureTitle: 'Selectable Drive Modes',
        featureDescription:
          'The Transit Custom Always Delivers, with up to 5 Selectable Drive Modes to choose from that enables you to take your business almost anywhere.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/New%20Transit%20Custom_img_3.webp',
        featureImageAlt:
          'New Transit Custom 2.0L Ford EcoBlue Engine — Ford feature and technology highlight',
        featureTitle: '2.0L Ford EcoBlue Engine',
        featureDescription: '100–125kW. 360–390Nm. Outstanding fuel efficiency.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/New%20Transit%20Custom_img_5.webp',
        featureImageAlt: 'New Transit Custom Tech-Savvy — Ford feature and technology highlight',
        featureTitle: 'Tech-Savvy',
        featureDescription:
          '13″ Touchscreen Display with SYNC® 4. 12″ Digital Instrument Cluster. 8″ Configurable Center Display. Wireless Charger.',
      },
    ],
    colours: [
      {
        colourName: 'Frozen White',
        colourImageAlt: 'New Transit Custom exterior in Frozen White paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/cdffda4d-5e76-4661-a896-ae68c683d00b_Ford%20Transit%20Custom%20Panel%20Van%20Vehicle%20Colour.webp',
      },
    ],
    heroImageUrl: 'https://www.eagleford.co.za/new/New-Transit-Custom/./images/banner.webp',
    heroImageAlt: 'Ford Transit Custom commercial panel van hero banner — Eagle Ford',
    featureImageUrl: 'https://www.eagleford.co.za/new/New-Transit-Custom/./images/hero.webp',
    featureImageAlt: 'Ford Transit Custom model overview — Ford commercial vans at Eagle Ford',
    gallery: [
      {
        imageUrl: 'https://www.eagleford.co.za/new/New-Transit-Custom/./images/gallery/img_0.webp',
        imageAlt: 'New Transit Custom gallery photo 1 — exterior and interior views',
      },
    ],
    brochureUrl:
      'https://www.eagleford.co.za/new/New-Transit-Custom/./files/brochures/2-jun-2026-transit-brochure.pdf',
    brochureAlt: 'Ford New Transit Custom brochure PDF download — Eagle Ford South Africa',
    pageUrl: 'https://www.eagleford.co.za/new/new-transit-custom/',
    variants: [
      {
        name: 'TRANSIT CUSTOM 2.0L LWB VAN BASE 6MT',
        slug: 'transit-custom-2.0l-lwb-van-base-6mt',
        featureImageUrl: 'https://www.eagleford.co.za/112034_image.webp',
        featureImageAlt:
          'Ford TRANSIT CUSTOM 2.0L LWB VAN BASE 6MT — New Transit Custom model variant at Eagle Ford South Africa',
        price: 770000,
        highlights: [
          'Average Range: 671km',
          'Diesel',
          'Fuel Tank size: 55L',
          'Manual',
          'Number of seats: 2',
          'Power output: 100kW',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the starting price of the New Transit Custom?',
        answer:
          'The Transit Custom starts from R 770,000 for the 2.0L LWB Van Base 6MT. Eagle Ford can confirm commercial pricing, stock and business finance options.',
      },
      {
        question: 'How much load space and payload does Transit Custom offer?',
        answer:
          'Expect around 5.8m³ of load area and up to approximately 1,269kg max gross payload — built to get daily deliveries and trade work done efficiently.',
      },
      {
        question: 'What engine options are available?',
        answer:
          'The 2.0L Ford EcoBlue diesel spans roughly 100–125kW and 360–390Nm depending on derivative, with a focus on usable torque and fuel efficiency for business mileage.',
      },
      {
        question: 'Is the listed Base model manual or automatic?',
        answer:
          'The seeded Base LWB van uses a 6-speed manual gearbox with 100kW diesel power — ask Eagle Ford about other transmissions or higher specs if available.',
      },
      {
        question: 'How many seats does Transit Custom have?',
        answer:
          'The Base van is specified with 2 seats for a pure cargo layout. Passenger-focused transport is better served by Tourneo Custom.',
      },
      {
        question: 'What tech comes with Transit Custom?',
        answer:
          'Higher equipment mentions include a 13-inch touchscreen with SYNC® 4, a 12-inch digital instrument cluster, an 8-inch configurable centre display and wireless charging — confirm what is fitted on each derivative.',
      },
      {
        question: 'Does Transit Custom have selectable drive modes?',
        answer:
          'Yes — up to five selectable drive modes help you take the van almost anywhere your business needs to go, adapting response to conditions.',
      },
      {
        question: 'What fuel range can I expect?',
        answer:
          'The Base model quotes an average range around 671km from a 55L diesel tank. Real-world range depends on payload, traffic and driving style.',
      },
      {
        question: 'Is Transit Custom suitable for trades and SMEs?',
        answer:
          'Yes. It is designed as a compact commercial workhorse — strong payload for its size, modern cabin tech and modes that support mixed city and highway routes.',
      },
      {
        question: 'How does Transit Custom compare to Transit Van?',
        answer:
          'Transit Custom is the mid-size van with about 5.8m³ load volume. The larger Transit Van steps up to roughly 13.5m³ and higher payloads for bigger commercial loads.',
      },
    ],
  },
  {
    name: 'Transit Van',
    slug: 'transit-van',
    categorySlug: 'vans-and-buses',
    startingPrice: 1011500,
    description:
      'The Ford Transit Van. Built to deliver on your needs. Big space. Tough build. Ready to work.',
    features: [
      {
        featureImageUrl: 'https://www.eagleford.co.za/Transit%20Van_img_1.webp',
        featureImageAlt:
          'Transit Van Load Capacity and Payload — Ford feature and technology highlight',
        featureTitle: 'Load Capacity and Payload',
        featureDescription: '13.5m³ of load area space. Up to 2,270kg max gross payload.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Transit%20Van_img_2.webp',
        featureImageAlt:
          'Transit Van Selectable Drive Modes — Ford feature and technology highlight',
        featureTitle: 'Selectable Drive Modes',
        featureDescription:
          'The Transit Van has up to 4 Selectable Drive Modes to choose from, enabling you to take your business almost anywhere.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Transit%20Van_img_3.webp',
        featureImageAlt:
          'Transit Van 2.0L Ford EcoBlue Engine Diesel — Ford feature and technology highlight',
        featureTitle: '2.0L Ford EcoBlue Engine Diesel',
        featureDescription: '100–121kW. 360–390Nm.',
      },
      {
        featureImageUrl: 'https://www.eagleford.co.za/Transit%20Van_img_4.webp',
        featureImageAlt: 'Transit Van Security at its Core — Ford feature and technology highlight',
        featureTitle: 'Security at its Core',
        featureDescription:
          'Ford knows your Transit is your livelihood. Multiple security systems alert you if your vehicle is being tampered with or moved from where it should be.',
      },
    ],
    colours: [
      {
        colourName: 'Frozen White',
        colourImageAlt: 'Transit Van exterior in Frozen White paint colour option',
        colourImageUrl:
          'https://assets.conexa.r-e-d.co.za/images/269be3f2-e91b-497d-b5c9-d1b65293ebf5default.webp',
      },
    ],
    heroImageUrl: 'https://www.eagleford.co.za/new/Transit-Van/./images/banner.webp',
    heroImageAlt: 'Ford Transit Van large capacity commercial van hero banner — Eagle Ford',
    featureImageUrl: 'https://www.eagleford.co.za/new/Transit-Van/./images/hero.webp',
    featureImageAlt: 'Ford Transit Van model overview — Ford commercial vehicles at Eagle Ford',
    gallery: [
      {
        imageUrl: 'https://www.eagleford.co.za/new/Transit-Van/./images/gallery/img_0.webp',
        imageAlt: 'Transit',
      },
      {
        imageUrl: 'https://www.eagleford.co.za/new/Transit-Van/./images/gallery/img_1.webp',
        imageAlt: 'Transit — photo 2',
      },
    ],
    brochureUrl:
      'https://www.eagleford.co.za/new/Transit-Van/./files/brochures/2-jun-2026-transit-brochure.pdf',
    brochureAlt: 'Ford Transit Van brochure PDF download — Eagle Ford South Africa',
    pageUrl: 'https://www.eagleford.co.za/new/transit-van/',
    variants: [
      {
        name: '2.2 TDCi ELWB Ambiente 6MT',
        slug: '2.2-tdci-elwb-ambiente-6mt',
        featureImageUrl: 'https://www.eagleford.co.za/158671_image.webp',
        featureImageAlt:
          'Ford 2.2 TDCi ELWB Ambiente 6MT — Transit Van model variant at Eagle Ford South Africa',
        price: 1011500,
        highlights: ['Diesel', 'Fuel Tank size: 80L', 'Manual', 'Number of seats: 3'],
      },
    ],
    faqs: [
      {
        question: 'What is the starting price of the Transit Van?',
        answer:
          'The Transit Van starts from R 1,011,500 for the 2.2 TDCi ELWB Ambiente 6MT. Speak to Eagle Ford for commercial quotes, stock and aftersales support.',
      },
      {
        question: 'How much load space does the Transit Van offer?',
        answer:
          'Expect around 13.5m³ of load area — a big step up from Transit Custom’s roughly 5.8m³ — for bulk deliveries, equipment and large commercial cargo.',
      },
      {
        question: 'What payload can the Transit Van carry?',
        answer:
          'Maximum gross payload is quoted up to about 2,270kg depending on configuration. Always match GVM and loading to your specific derivative and body setup.',
      },
      {
        question: 'How does Transit Van compare to Transit Custom?',
        answer:
          'Transit Van is the larger workhorse for volume and payload. Transit Custom suits mid-size urban and trade routes. Eagle Ford can size the right van to your routes and loads.',
      },
      {
        question: 'What engine does the listed Ambiente use?',
        answer:
          'The ELWB Ambiente is specified with a diesel powertrain and 6-speed manual. Broader Transit messaging also references EcoBlue outputs in the 100–121kW class — confirm the exact engine on the unit you buy.',
      },
      {
        question: 'Does Transit Van have selectable drive modes?',
        answer:
          'Yes — up to four selectable drive modes help adapt the van to mixed conditions so you can take business almost anywhere.',
      },
      {
        question: 'How many seats are in the Transit Van Ambiente?',
        answer:
          'The 2.2 TDCi ELWB Ambiente is listed with 3 seats — a practical crew-cab feel for a driver plus two without sacrificing the huge rear load space.',
      },
      {
        question: 'What fuel tank size does it have?',
        answer:
          'The Ambiente derivative quotes an 80L diesel tank, supporting longer working days between fills when routes are demanding.',
      },
      {
        question: 'Is security a focus on Transit Van?',
        answer:
          'Yes. Ford understands a Transit is often a livelihood — multiple security systems help alert you if the vehicle is tampered with or moved from where it should be.',
      },
      {
        question: 'Can Eagle Ford help with commercial Finance and fleet support?',
        answer:
          'Yes. From choosing ELWB Ambiente specs to structuring business finance and planning servicing, Eagle Ford supports commercial buyers who need vans that stay earning.',
      },
    ],
  },
]

const CATEGORY_DATA = [
  { title: 'Bakkies', slug: 'bakkies', sortOrder: 1 },
  { title: 'SUVs', slug: 'suvs', sortOrder: 2 },
  { title: 'Passenger Cars', slug: 'passenger-cars', sortOrder: 3 },
  { title: 'Vans & Buses', slug: 'vans-and-buses', sortOrder: 4 },
]

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

  const result = {
    categoriesCreated: 0,
    categoriesSkipped: 0,
    vehiclesCreated: 0,
    vehiclesUpdated: 0,
    vehiclesSkipped: 0,
    modelsCreated: 0,
    modelsUpdated: 0,
    modelsSkipped: 0,
    imagesUploaded: 0,
    imagesMissing: 0,
  }

  try {
    // ── 1. Upsert vehicle categories ────────────────────────────────────────
    payload.logger.info('Seeding vehicle categories...')
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
        payload.logger.info(`Created category: ${cat.title}`)
      }
    }

    // ── 2. Upsert vehicles ──────────────────────────────────────────────────
    payload.logger.info('Seeding vehicles...')
    const vehicleIdMap: Record<string, string> = {}

    for (const [index, veh] of VEHICLE_DATA.entries()) {
      const existing = await payload.find({
        collection: 'vehicles',
        where: { slug: { equals: veh.slug } },
        limit: 1,
        draft: true,
        overrideAccess: true,
        req: payloadReq,
      })

      payload.logger.info(`Loading seed images for: ${veh.name}`)
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
        } = { faqs: veh.faqs, features }

        if (images.heroMediaId) updateData.heroImage = images.heroMediaId
        if (images.featureMediaId) updateData.featureImage = images.featureMediaId
        if (images.galleryIds.length > 0) {
          updateData.gallery = images.galleryIds.map((id) => ({ image: id }))
        }
        if (veh.colours.length > 0) updateData.colours = images.colours
        if (brochureMediaId) updateData.brochure = brochureMediaId

        await payload.update({
          collection: 'vehicles',
          id: doc.id,
          data: updateData,
          req: payloadReq,
          context: { disableRevalidate: true },
        })
        result.vehiclesUpdated++
        payload.logger.info(`Updated vehicle: ${veh.name}`)
        continue
      }

      if (!images.heroMediaId) {
        payload.logger.warn(`No hero image for ${veh.name} — skipping create`)
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
          startingPrice: veh.startingPrice,
          priceDisclaimer: 'Including Optional Service plan and excluding Packs & factory options',
          sortOrder: index + 1,
          _status: 'published',
        },
        req: payloadReq,
        context: { disableRevalidate: true },
      })

      vehicleIdMap[veh.slug] = created.id as string
      result.vehiclesCreated++
      payload.logger.info(`Created vehicle: ${veh.name}`)
    }

    // ── 3. Upsert vehicle models ────────────────────────────────────────────
    payload.logger.info('Seeding vehicle models...')

    for (const veh of VEHICLE_DATA) {
      const vehicleId = vehicleIdMap[veh.slug]
      if (!vehicleId) {
        payload.logger.warn(`No vehicle ID for ${veh.slug} — skipping models`)
        continue
      }

      for (const [modelIndex, variant] of veh.variants.entries()) {
        const existing = await payload.find({
          collection: 'vehicle-models',
          where: { slug: { equals: variant.slug } },
          limit: 1,
          draft: true,
          overrideAccess: true,
          req: payloadReq,
        })

        const modelFeatureAlt =
          variant.featureImageAlt ?? seoModelFeatureImageAlt(veh.name, variant.name)

        let featureMediaId: string | null = null
        if (variant.featureImageUrl) {
          const remoteModelFeature = await fetchRemoteImage(variant.featureImageUrl)
          if (remoteModelFeature) {
            featureMediaId = await uploadSeedImage(
              payload,
              payloadReq,
              remoteModelFeature,
              buildSeedMediaFilename(veh.slug, 'model-feature', variant.slug),
              modelFeatureAlt,
              result,
            )
          } else {
            result.imagesMissing++
          }
        } else {
          result.imagesMissing++
        }

        const heroMediaId = featureMediaId

        const variantColours = await buildModelColours(
          payload,
          payloadReq,
          veh.name,
          veh.slug,
          veh.colours,
          result,
        )

        if (existing.totalDocs > 0) {
          const updateData: {
            heroImage?: string
            featureImage?: string
            colours?: BuiltColour[]
          } = {}

          if (heroMediaId) updateData.heroImage = heroMediaId
          if (featureMediaId) updateData.featureImage = featureMediaId
          if (veh.colours.length > 0) updateData.colours = variantColours

          await payload.update({
            collection: 'vehicle-models',
            id: existing.docs[0].id,
            data: updateData,
            req: payloadReq,
            context: { disableRevalidate: true },
          })

          result.modelsUpdated++
          payload.logger.info(`Updated model: ${variant.name}`)
          continue
        }

        try {
          await payload.create({
            collection: 'vehicle-models',
            draft: false,
            data: {
              name: variant.name,
              slug: variant.slug,
              generateSlug: false,
              vehicle: vehicleId,
              price: variant.price,
              highlights: variant.highlights.map((h) => ({ highlight: h })),
              ...(heroMediaId ? { heroImage: heroMediaId } : {}),
              ...(featureMediaId ? { featureImage: featureMediaId } : {}),
              colours: variantColours,
              sortOrder: modelIndex + 1,
              _status: 'published',
            },
            req: payloadReq,
            context: { disableRevalidate: true },
          })

          result.modelsCreated++
          payload.logger.info(`Created model: ${variant.name}`)
        } catch (modelErr) {
          const isUniqueSlug =
            typeof modelErr === 'object' &&
            modelErr !== null &&
            'data' in modelErr &&
            Array.isArray((modelErr as { data?: { errors?: { path?: string }[] } }).data?.errors) &&
            (modelErr as { data: { errors: { path?: string }[] } }).data.errors.some(
              (e) => e.path === 'slug',
            )

          if (isUniqueSlug) {
            result.modelsSkipped++
            payload.logger.warn(
              `Slug already exists for model ${variant.name} (${variant.slug}) — skipping`,
            )
            continue
          }

          throw modelErr
        }
      }
    }

    payload.logger.info('Vehicle import complete.')

    return Response.json({ success: true, ...result })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error importing vehicles' })
    return new Response('Error importing vehicles.', { status: 500 })
  }
}
