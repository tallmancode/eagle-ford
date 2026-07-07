import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import type { File } from 'payload'

export const maxDuration = 300

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchFile(url: string): Promise<File | null> {
  try {
    const res = await fetch(url, { method: 'GET' })
    if (!res.ok) return null
    const data = await res.arrayBuffer()
    const ext = url.split('.').pop()?.split('?')[0] ?? 'jpg'
    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    }
    return {
      name: url.split('/').pop()?.split('?')[0] ?? `vehicle-image.${ext}`,
      data: Buffer.from(data),
      mimetype: mimeMap[ext] ?? 'image/jpeg',
      size: data.byteLength,
    }
  } catch {
    return null
  }
}

async function scrapeImages(pageUrl: string): Promise<{ hero: string | null; gallery: string[] }> {
  try {
    const html = await fetch(pageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EagleFordBot/1.0)' },
    }).then((r) => r.text())

    // Match all img src attributes on the page
    const imgRegex = /src="(https?:\/\/(?:www\.)?eagleford\.co\.za[^"]+\.(?:jpg|jpeg|png|webp))"/gi
    const all = [...html.matchAll(imgRegex)]
      .map((m) => m[1])
      // Filter out icons, logos, nav elements
      .filter(
        (u) =>
          !u.includes('logo') &&
          !u.includes('icon') &&
          !u.includes('arrow') &&
          !u.includes('favicon') &&
          !u.includes('suzuki') &&
          !u.includes('footer') &&
          !u.includes('flag') &&
          !u.includes('whatsapp'),
      )
      // Deduplicate
      .filter((u, i, arr) => arr.indexOf(u) === i)

    const hero = all[0] ?? null
    const gallery = all.slice(1)

    return { hero, gallery }
  } catch {
    return { hero: null, gallery: [] }
  }
}

async function scrapeColourSwatches(
  pageUrl: string,
): Promise<{ colourName: string; src: string }[]> {
  try {
    const html = await fetch(pageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EagleFordBot/1.0)' },
    }).then((r) => r.text())

    // Match img tags that have an alt attribute containing "Colour"
    const swatchRegex =
      /<img[^>]+alt="([^"]*Colour[^"]*)"[^>]+src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))"|<img[^>]+src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))"[^>]+alt="([^"]*Colour[^"]*)"/gi

    const swatches: { colourName: string; src: string }[] = []
    for (const m of html.matchAll(swatchRegex)) {
      const alt = m[1] || m[4]
      const src = m[2] || m[3]
      if (alt && src) {
        swatches.push({ colourName: alt.replace(' Colour', '').trim(), src })
      }
    }
    return swatches
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// Vehicle seed data
// ---------------------------------------------------------------------------

type ColourDef = { colourName: string; colourNote?: string }
type FeatureDef = { featureTitle: string; featureDescription: string }
type VariantDef = { name: string; slug: string; price: number; highlights: string[] }

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
  },
]

const CATEGORY_DATA = [
  { title: 'Bakkies', slug: 'bakkies', sortOrder: 1 },
  { title: 'SUVs', slug: 'suvs', sortOrder: 2 },
  { title: 'Passenger Cars', slug: 'passenger-cars', sortOrder: 3 },
  { title: 'Vans & Buses', slug: 'vans-and-buses', sortOrder: 4 },
]

// Reliable placeholder image — Payload template
const PLACEHOLDER_URL =
  'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-hero1.webp'

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
    vehiclesSkipped: 0,
    modelsCreated: 0,
    modelsSkipped: 0,
    imagesUploaded: 0,
    imagesFailed: 0,
  }

  try {
    // ── 1. Upload placeholder image (used as fallback) ──────────────────────
    payload.logger.info('Fetching placeholder image...')
    const placeholderFile = await fetchFile(PLACEHOLDER_URL)
    let placeholderMediaId: string | null = null

    if (placeholderFile) {
      const placeholderMedia = await payload.create({
        collection: 'media',
        data: { alt: 'Vehicle placeholder image' },
        file: placeholderFile,
        req: payloadReq,
      })
      placeholderMediaId = placeholderMedia.id as string
      result.imagesUploaded++
      payload.logger.info('Placeholder image uploaded.')
    }

    // ── 2. Upsert vehicle categories ────────────────────────────────────────
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

    // ── 3. Upsert vehicles ──────────────────────────────────────────────────
    payload.logger.info('Seeding vehicles...')
    const vehicleIdMap: Record<string, string> = {}

    for (const [index, veh] of VEHICLE_DATA.entries()) {
      const existing = await payload.find({
        collection: 'vehicles',
        where: { slug: { equals: veh.slug } },
        limit: 1,
      })

      if (existing.totalDocs > 0) {
        vehicleIdMap[veh.slug] = existing.docs[0].id as string
        result.vehiclesSkipped++
        payload.logger.info(`Skipped existing vehicle: ${veh.name}`)
        continue
      }

      // Scrape images from the live site
      payload.logger.info(`Scraping images for: ${veh.name}`)
      const { hero: heroUrl, gallery: galleryUrls } = await scrapeImages(veh.pageUrl)

      // Hero image
      let heroMediaId = placeholderMediaId
      if (heroUrl) {
        const heroFile = await fetchFile(heroUrl)
        if (heroFile) {
          const heroMedia = await payload.create({
            collection: 'media',
            data: { alt: `${veh.name} hero image` },
            file: heroFile,
            req: payloadReq,
          })
          heroMediaId = heroMedia.id as string
          result.imagesUploaded++
        } else {
          result.imagesFailed++
        }
      } else {
        result.imagesFailed++
      }

      // Gallery images (cap at 8)
      const galleryIds: string[] = []
      for (const galleryUrl of galleryUrls.slice(0, 8)) {
        const galleryFile = await fetchFile(galleryUrl)
        if (galleryFile) {
          const galleryMedia = await payload.create({
            collection: 'media',
            data: { alt: `${veh.name} gallery image` },
            file: galleryFile,
            req: payloadReq,
          })
          galleryIds.push(galleryMedia.id as string)
          result.imagesUploaded++
        } else {
          if (placeholderMediaId) galleryIds.push(placeholderMediaId)
          result.imagesFailed++
        }
      }

      // Build colours — attempt to scrape colour swatches
      const scrapedSwatches = await scrapeColourSwatches(veh.pageUrl)
      const colours = await Promise.all(
        veh.colours.map(async (c) => {
          const swatch = scrapedSwatches.find((s) =>
            s.colourName.toLowerCase().includes(c.colourName.toLowerCase()),
          )
          let swatchMediaId = placeholderMediaId

          if (swatch) {
            const swatchFile = await fetchFile(swatch.src)
            if (swatchFile) {
              const swatchMedia = await payload.create({
                collection: 'media',
                data: { alt: `${c.colourName} colour swatch` },
                file: swatchFile,
                req: payloadReq,
              })
              swatchMediaId = swatchMedia.id as string
              result.imagesUploaded++
            } else {
              result.imagesFailed++
            }
          }

          return {
            colourName: c.colourName,
            ...(c.colourNote ? { colourNote: c.colourNote } : {}),
            ...(swatchMediaId ? { colourSwatch: swatchMediaId } : {}),
          }
        }),
      )

      const created = await payload.create({
        collection: 'vehicles',
        draft: false,
        data: {
          name: veh.name,
          slug: veh.slug,
          ...(veh.badge ? { badge: veh.badge } : {}),
          category: categoryIdMap[veh.categorySlug],
          heroImage: heroMediaId as string,
          gallery: galleryIds.map((id) => ({ image: id })),
          features: veh.features.map((f) => ({
            featureTitle: f.featureTitle,
            featureDescription: f.featureDescription,
          })),
          colours,
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

    // ── 4. Upsert vehicle models ────────────────────────────────────────────
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
        })

        if (existing.totalDocs > 0) {
          result.modelsSkipped++
          continue
        }

        // Scrape colour swatches from variant page
        const variantPageUrl = `${veh.pageUrl}${variant.slug}/`
        const variantSwatches = await scrapeColourSwatches(variantPageUrl)

        const variantColours = await Promise.all(
          veh.colours.map(async (c) => {
            const swatch = variantSwatches.find((s) =>
              s.colourName.toLowerCase().includes(c.colourName.toLowerCase()),
            )
            let swatchMediaId = placeholderMediaId

            if (swatch) {
              const swatchFile = await fetchFile(swatch.src)
              if (swatchFile) {
                const swatchMedia = await payload.create({
                  collection: 'media',
                  data: { alt: `${c.colourName} swatch` },
                  file: swatchFile,
                  req: payloadReq,
                })
                swatchMediaId = swatchMedia.id as string
                result.imagesUploaded++
              } else {
                result.imagesFailed++
              }
            }

            return {
              colourName: c.colourName,
              ...(c.colourNote ? { colourNote: c.colourNote } : {}),
              ...(swatchMediaId ? { colourSwatch: swatchMediaId } : {}),
            }
          }),
        )

        await payload.create({
          collection: 'vehicle-models',
          draft: false,
          data: {
            name: variant.name,
            slug: variant.slug,
            vehicle: vehicleId,
            price: variant.price,
            highlights: variant.highlights.map((h) => ({ highlight: h })),
            colours: variantColours,
            sortOrder: modelIndex + 1,
            _status: 'published',
          },
          req: payloadReq,
          context: { disableRevalidate: true },
        })

        result.modelsCreated++
        payload.logger.info(`Created model: ${variant.name}`)
      }
    }

    payload.logger.info('Vehicle import complete.')

    return Response.json({ success: true, ...result })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error importing vehicles' })
    return new Response('Error importing vehicles.', { status: 500 })
  }
}
