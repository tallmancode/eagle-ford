import {
  buildSeedMediaFilename,
  getColourSwatch,
  getModelHeroImage,
  getVehicleFeatureImage,
  getVehicleGallery,
  getVehicleHero,
  toPayloadFile,
  type SeedImage,
} from '@/lib/vehicle-seed-images'
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

async function uploadSeedImage(
  payload: Payload,
  req: PayloadRequest,
  image: SeedImage,
  mediaFilename: string,
  alt: string,
  stats: ImageImportStats,
): Promise<string> {
  const existingId = await findSeedMediaId(payload, req, mediaFilename)
  if (existingId) return existingId

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
      if (retryId) return retryId
    }
    throw err
  }
}

async function buildVehicleImages(
  payload: Payload,
  req: PayloadRequest,
  vehicleName: string,
  vehicleSlug: string,
  colours: ColourDef[],
  stats: ImageImportStats,
): Promise<BuiltVehicleImages> {
  const heroImage = getVehicleHero(vehicleSlug)
  const heroMediaId = heroImage
    ? await uploadSeedImage(
        payload,
        req,
        heroImage,
        buildSeedMediaFilename(vehicleSlug, 'hero', 'banner'),
        `${vehicleName} hero image`,
        stats,
      )
    : (stats.imagesMissing++, null)

  const featureImage = getVehicleFeatureImage(vehicleSlug)
  const featureMediaId = featureImage
    ? await uploadSeedImage(
        payload,
        req,
        featureImage,
        buildSeedMediaFilename(vehicleSlug, 'feature', 'card'),
        `${vehicleName} feature image`,
        stats,
      )
    : (stats.imagesMissing++, null)

  const galleryImages = getVehicleGallery(vehicleSlug)
  if (galleryImages.length === 0) stats.imagesMissing++

  const galleryIds: string[] = []
  for (const [index, galleryImage] of galleryImages.slice(0, 8).entries()) {
    galleryIds.push(
      await uploadSeedImage(
        payload,
        req,
        galleryImage,
        buildSeedMediaFilename(vehicleSlug, 'gallery', String(index + 1).padStart(2, '0')),
        `${vehicleName} gallery image`,
        stats,
      ),
    )
  }

  const builtColours: BuiltColour[] = []
  for (const colour of colours) {
    const swatchImage = getColourSwatch(vehicleSlug, colour.colourName)
    let swatchMediaId: string | undefined

    if (swatchImage) {
      swatchMediaId = await uploadSeedImage(
        payload,
        req,
        swatchImage,
        buildSeedMediaFilename(vehicleSlug, 'colour', colour.colourName),
        `${colour.colourName} colour swatch`,
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

async function buildModelColours(
  payload: Payload,
  req: PayloadRequest,
  vehicleSlug: string,
  colours: ColourDef[],
  stats: ImageImportStats,
): Promise<BuiltColour[]> {
  const builtColours: BuiltColour[] = []

  for (const colour of colours) {
    const mediaFilename = buildSeedMediaFilename(vehicleSlug, 'colour', colour.colourName)
    let swatchMediaId = (await findSeedMediaId(payload, req, mediaFilename)) ?? undefined

    if (!swatchMediaId) {
      const swatchImage = getColourSwatch(vehicleSlug, colour.colourName)
      if (swatchImage) {
        swatchMediaId = await uploadSeedImage(
          payload,
          req,
          swatchImage,
          mediaFilename,
          `${colour.colourName} colour swatch`,
          stats,
        )
      } else {
        stats.imagesMissing++
      }
    }

    builtColours.push({
      colourName: colour.colourName,
      ...(colour.colourNote ? { colourNote: colour.colourNote } : {}),
      ...(swatchMediaId ? { colourSwatch: swatchMediaId } : {}),
    })
  }

  return builtColours
}

// ---------------------------------------------------------------------------
// Vehicle seed data
// ---------------------------------------------------------------------------

type ColourDef = { colourName: string; colourNote?: string }
type FeatureDef = { featureTitle: string; featureDescription: string }
type VariantDef = { name: string; slug: string; price: number; highlights: string[] }
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
        featureTitle: '12″ IP Screen',
        featureDescription:
          'New coast-to-coast dashboard increases the sense of space and width in the cabin. The integrated 12-inch centre LED touchscreen is hi-tech with a tough truck inspired look.',
      },
      {
        featureTitle: 'Dark Interior Finish',
        featureDescription:
          'Experience a sanctuary of modern focus with an interior finished in deep, tonal accents that exude a premium feel. These sophisticated dark materials are designed to resist the rigors of daily use while maintaining a sleek, cohesive look throughout the cabin.',
      },
      {
        featureTitle: 'Ranger Raising the Bar Again',
        featureDescription:
          "Ranger raises the stakes for 2026. Tougher in stance, sharper in design and finished with bold black accents for XLT, Wildtrak and Platinum series that give it serious presence. It's built from the same hard-working DNA that has made it Mzansi's number one 4x4.",
      },
    ],
    colours: [
      { colourName: 'Frozen White' },
      { colourName: 'Carbonized Grey' },
      { colourName: 'Agate Black' },
      { colourName: 'Ignite Red' },
      { colourName: 'Blue Lighting' },
      { colourName: 'Acacia Green', colourNote: 'Platinum Only' },
      { colourName: 'Lucid Red' },
      { colourName: 'Command Grey', colourNote: 'Sport & Tremor Only' },
    ],
    pageUrl: 'https://www.eagleford.co.za/new/next-level-ranger/',
    variants: [
      {
        name: '2.0 SiT Double Cab XL 4x2 6MT',
        slug: '2.0-sit-double-cab-xl-4x2-6mt',
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
        featureTitle: 'Bold New Front Face',
        featureDescription:
          'Capable and reliable, the Ranger Super Cab is ready to work. The new black grille and halogen daytime running lamps showcase the global Built Ford Tough design.',
      },
      {
        featureTitle: 'Durable Wheels',
        featureDescription:
          'Perfect for driving in rugged conditions, the Ranger Super Cab comes with solid and durable 16-inch alloy wheels.',
      },
      {
        featureTitle: 'Coast-to-Coast Dashboard',
        featureDescription:
          'New coast-to-coast dashboard increases the sense of space and width in the cabin. The integrated 10-inch centre LED touchscreen is hi-tech with a tough, truck-inspired look.',
      },
    ],
    colours: [],
    pageUrl: 'https://www.eagleford.co.za/new/ranger-super-cab/',
    variants: [
      {
        name: 'Ranger 2.0 SiT SuperCab XL auto',
        slug: 'ranger-2.0-sit-supercab-xl-auto',
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
        featureTitle: 'Bold New Front Face',
        featureDescription:
          'Capable and reliable, the XL is ready to work. The new black grille and halogen daytime running lamps showcase the global Built Ford Tough design.',
      },
      {
        featureTitle: 'Durable Wheels',
        featureDescription:
          'Perfect for driving in rugged conditions, the XL comes with solid and durable 16-inch alloy wheels.',
      },
      {
        featureTitle: 'Coast-to-Coast Dashboard',
        featureDescription:
          'When your bakkie doubles as your office, a smart design makes all the difference. Packed with technology and features to help you work smarter and play harder. Built tough. Built safe.',
      },
    ],
    colours: [],
    pageUrl: 'https://www.eagleford.co.za/new/ranger-single-cab/',
    variants: [
      {
        name: 'Ranger 2.0 SiT Single Cab XL 4x2 auto',
        slug: 'ranger-2.0-sit-single-cab-xl-4x2-auto',
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
        featureTitle: 'Distinctive Front Design',
        featureDescription:
          'The distinctive grille with black centre bar and the iconic C-Clamp LEDs creates a rugged look. Steel underbody protection and black fog lamp rings bring it all together.',
      },
      {
        featureTitle: 'Built for Weekend Adventures',
        featureDescription:
          'The Ford Everest features selectable drive modes to help you tackle tough terrain and make you feel more in control.',
      },
      {
        featureTitle: 'Eyes Where You Need Them',
        featureDescription:
          'With Pro-Trailer Backup Assist and 360-Degree Camera, you can reverse your trailer without the pressure.',
      },
      {
        featureTitle: 'Flagship Interior',
        featureDescription:
          'The elevated luxury interior features driver & passenger heated & ventilated leather accented seats with driver 10-way power and memory, bespoke inserts, quilt design and signature Platinum badging. A Panoramic Roof adds to the spacious feel.',
      },
    ],
    colours: [],
    pageUrl: 'https://www.eagleford.co.za/new/next-level-everest/',
    variants: [
      {
        name: '2.0 SiT Active 4x2 10AT',
        slug: '2.0-sit-active-4x2-10at',
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
        featureTitle: 'Striking Exterior and Cutting-Edge Features',
        featureDescription:
          'The dynamic Ford Territory catches your eye instantly with its imposing exterior, sleek interior, available 19-inch alloy wheels, full LED headlamps and tail lamps, and LED daytime running lights.',
      },
      {
        featureTitle: 'More Space, Advanced Tech and Safety',
        featureDescription:
          'Next-level Technology including 12″ Digital touchscreen, 12.3″ Digital cluster, Arkamys 3D audio system and Apple CarPlay & Android Auto.',
      },
      {
        featureTitle: 'Spacious Interior and Premium Design',
        featureDescription:
          "Designed with your comfort in mind, Territory's interior gives you ample legroom and cargo space.",
      },
    ],
    colours: [],
    pageUrl: 'https://www.eagleford.co.za/new/new-level-territory/',
    variants: [
      {
        name: 'Territory 1.8T Ambiente',
        slug: 'territory-1.8t-ambiente',
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
        featureTitle: 'Flexible Drive Modes',
        featureDescription:
          'Get familiar with fearlessness and move better on various terrains with Normal, Sport, Track, Drag Strip, Slippery or Custom drive modes.',
      },
      {
        featureTitle: 'Pulse-Raising 5.0L V8 Engine',
        featureDescription:
          'The 2024 Mustang GT with the Gen-4 5.0L Coyote V8 engine generates a track-ready 328kW of power and 540Nm of torque.',
      },
      {
        featureTitle: 'Styled for Performance',
        featureDescription:
          "Every 2024 Mustang GT Model comes with a distinctive, raised wedge decklid spoiler that's painted to match the selected body colour.",
      },
      {
        featureTitle: 'Intelligent and Good Looking',
        featureDescription:
          'An iconic drive is always at your fingertips. The Mustang GT is here with Intelligent Access through its Push-button Start function.',
      },
    ],
    colours: [
      { colourName: 'Race Red' },
      { colourName: 'Adriatic Blue' },
      { colourName: 'Orange Fury' },
      { colourName: 'Iconic Silver' },
      { colourName: 'Carbonized Gray' },
      { colourName: 'Vapor Blue' },
      { colourName: 'Molten Magenta' },
      { colourName: 'Oxford White' },
      { colourName: 'Absolute Black' },
    ],
    pageUrl: 'https://www.eagleford.co.za/new/mustang-gt/',
    variants: [
      {
        name: 'MUSTANG 5.0L V8 GT FASTBACK 10AT',
        slug: 'mustang-5.0l-v8-gt-fastback-10at',
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
        featureTitle: 'A Track-Ready Powerhouse',
        featureDescription:
          'Kick out 334kW of power and 540Nm of torque, and leave behind the pack in the Mustang Dark Horse.',
      },
      {
        featureTitle: 'Iconic Looks',
        featureDescription:
          'Signature Dark Horse Lettering and badging throughout the Dark Horse make for an iconic aesthetic.',
      },
      {
        featureTitle: 'Precision Shifting at Every Turn',
        featureDescription:
          'Take the streets by surprise and let the Mustang Dark Horse do the talking with its MagneRide® Damping System and 6 Selectable Drive Modes.',
      },
      {
        featureTitle: 'Feel The Flow of Pure Power',
        featureDescription:
          'Harness precision and unbridled power in the Mustang Dark Horse. Featuring Active Valve Performance Exhaust System and Remote Rev.',
      },
    ],
    colours: [
      { colourName: 'Race Red' },
      { colourName: 'Carbonized Gray' },
      { colourName: 'Blue Ember' },
      { colourName: 'Oxford White' },
    ],
    pageUrl: 'https://www.eagleford.co.za/new/mustang-dark-horse/',
    variants: [
      {
        name: 'MUSTANG 5.0L V8 DARK HORSE 10AT',
        slug: 'mustang-5.0l-v8-dark-horse-10at',
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
        featureTitle: 'Power and Torque Meet Efficiency',
        featureDescription:
          '2.0L Ford EcoBlue Diesel Engine. 7.4l/180 KM outstanding fuel efficiency. 8-Speed Automatic transmission.',
      },
      {
        featureTitle: 'Space for Any Tour',
        featureDescription:
          'With a modern platform, the Tourneo Custom 8-seater provides a range of seating configurations, making it ideal for transporting passengers or equipment.',
      },
      {
        featureTitle: 'A Mode for Your Every Muse',
        featureDescription:
          'Enjoy a choice of Drive Modes: Normal, Eco, Sport, Slippery, and Trail. The system adjusts various settings including throttle response.',
      },
      {
        featureTitle: 'Comfort and Tech',
        featureDescription:
          "13\u2033 Touchscreen display. 5G Embedded modem. 4-Way Adjustable driver's seat with lumbar support.",
      },
    ],
    colours: [
      { colourName: 'Magnetic' },
      { colourName: 'Chrome Blue' },
      { colourName: 'Agate Black' },
      { colourName: 'Moondust Silver' },
      { colourName: 'Blazer Blue' },
      { colourName: 'Race Red' },
      { colourName: 'Frozen White' },
    ],
    pageUrl: 'https://www.eagleford.co.za/new/new-tourneo-custom/',
    variants: [
      {
        name: 'Tourneo Trend',
        slug: 'tourneo-trend',
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
        featureTitle: 'Load Capacity and Payload',
        featureDescription: '5.8m³ of load area space. Up to 1,269kg max gross payload.',
      },
      {
        featureTitle: 'Selectable Drive Modes',
        featureDescription:
          'The Transit Custom Always Delivers, with up to 5 Selectable Drive Modes to choose from that enables you to take your business almost anywhere.',
      },
      {
        featureTitle: '2.0L Ford EcoBlue Engine',
        featureDescription: '100–125kW. 360–390Nm. Outstanding fuel efficiency.',
      },
      {
        featureTitle: 'Tech-Savvy',
        featureDescription:
          '13″ Touchscreen Display with SYNC® 4. 12″ Digital Instrument Cluster. 8″ Configurable Center Display. Wireless Charger.',
      },
    ],
    colours: [{ colourName: 'Frozen White' }],
    pageUrl: 'https://www.eagleford.co.za/new/new-transit-custom/',
    variants: [
      {
        name: 'TRANSIT CUSTOM 2.0L LWB VAN BASE 6MT',
        slug: 'transit-custom-2.0l-lwb-van-base-6mt',
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
        featureTitle: 'Load Capacity and Payload',
        featureDescription: '13.5m³ of load area space. Up to 2,270kg max gross payload.',
      },
      {
        featureTitle: 'Selectable Drive Modes',
        featureDescription:
          'The Transit Van has up to 4 Selectable Drive Modes to choose from, enabling you to take your business almost anywhere.',
      },
      {
        featureTitle: '2.0L Ford EcoBlue Engine Diesel',
        featureDescription: '100–121kW. 360–390Nm.',
      },
      {
        featureTitle: 'Security at its Core',
        featureDescription:
          'Ford knows your Transit is your livelihood. Multiple security systems alert you if your vehicle is being tampered with or moved from where it should be.',
      },
    ],
    colours: [{ colourName: 'Frozen White' }],
    pageUrl: 'https://www.eagleford.co.za/new/transit-van/',
    variants: [
      {
        name: '2.2 TDCi ELWB Ambiente 6MT',
        slug: '2.2-tdci-elwb-ambiente-6mt',
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
        veh.colours,
        result,
      )

      if (existing.totalDocs > 0) {
        const doc = existing.docs[0]
        vehicleIdMap[veh.slug] = doc.id as string

        const updateData: {
          faqs: typeof veh.faqs
          heroImage?: string
          featureImage?: string
          gallery?: { image: string }[]
          colours?: BuiltColour[]
        } = { faqs: veh.faqs }

        if (images.heroMediaId) updateData.heroImage = images.heroMediaId
        if (images.featureMediaId) updateData.featureImage = images.featureMediaId
        if (images.galleryIds.length > 0) {
          updateData.gallery = images.galleryIds.map((id) => ({ image: id }))
        }
        if (veh.colours.length > 0) updateData.colours = images.colours

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
          features: veh.features.map((f) => ({
            featureTitle: f.featureTitle,
            featureDescription: f.featureDescription,
          })),
          colours: images.colours,
          faqs: veh.faqs,
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

        const modelHeroImage = getModelHeroImage(veh.slug, variant.slug)
        const heroMediaId = modelHeroImage
          ? await uploadSeedImage(
              payload,
              payloadReq,
              modelHeroImage,
              buildSeedMediaFilename(veh.slug, 'model', variant.slug),
              `${variant.name} hero image`,
              result,
            )
          : (result.imagesMissing++, null)

        const variantColours = await buildModelColours(
          payload,
          payloadReq,
          veh.slug,
          veh.colours,
          result,
        )

        if (existing.totalDocs > 0) {
          const updateData: {
            heroImage?: string
            colours?: BuiltColour[]
          } = {}

          if (heroMediaId) updateData.heroImage = heroMediaId
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
