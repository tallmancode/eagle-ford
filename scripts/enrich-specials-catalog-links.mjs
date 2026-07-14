/**
 * Adds vehicleSlug / modelSlug to specials-data.ts using catalog matching.
 * Run: node scripts/enrich-specials-catalog-links.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, '../src/lib/specials-seed/specials-data.ts')

// Inline matcher (mirrors matchSpecialToCatalog.ts) so we don't need tsx
function tokenize(value) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/double[\s-]?cab|\bdc\b/g, ' doublecab ')
    .replace(/super[\s-]?cab|supercab|\bsup\b|\bsc\b/g, ' supercab ')
    .replace(/single[\s-]?cab/g, ' singlecab ')
    .replace(/\b4wd\b/g, ' 4x4 ')
    .replace(/\b10at\b|\b8at\b|\b6at\b/g, ' auto ')
    .replace(/\b6mt\b|\bmanual\b/g, ' manual ')
    .replace(/[^a-z0-9.]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function tokenSet(value) {
  return [...new Set(tokenize(value))]
}

function scoreTokens(haystack, needle) {
  if (needle.length === 0) return 0
  let hits = 0
  for (const token of needle) if (haystack.includes(token)) hits++
  return hits / needle.length
}

const CATALOG = [
  {
    slug: 'next-level-ranger',
    variants: [
      ['2.0-sit-double-cab-xl-4x2-6mt', '2.0 SiT Double Cab XL 4x2 6MT'],
      ['2.0-sit-double-cab-xlt-4x2-10at', '2.0 SiT Double Cab XLT 4x2 10AT'],
      ['2.3l-double-cab-sport-4x2-10at', '2.3L Double Cab Sport 4x2 10AT'],
      ['2.3l-double-cab-wildtrak-4x2-10at', '2.3L Double Cab Wildtrak 4x2 10AT'],
      ['3.0l-v6-double-cab-tremor-4x4-10at', '3.0L V6 Double Cab Tremor 4x4 10AT'],
      ['3.0l-v6-double-cab-wildtrak-4x4-10at', '3.0L V6 Double Cab Wildtrak 4x4 10AT'],
      ['3.0l-v6-double-cab-platinum-4x4-10at', '3.0L V6 Double Cab Platinum 4x4 10AT'],
      ['3.0l-v6-tt-double-cab-raptor-4x4-10at', '3.0L V6 TT Double Cab Raptor 4x4 10AT'],
    ],
  },
  {
    slug: 'ranger-super-cab',
    variants: [
      ['ranger-2.0-sit-supercab-xl-auto', 'Ranger 2.0 SiT SuperCab XL auto'],
      ['ranger-2.0-sit-supercab-xlt', 'Ranger 2.0 SiT SuperCab XLT'],
      [
        'ford-ranger-2.0-biturbo-supercab-wildtrak-4x4',
        'Ford Ranger 2.0 BiTurbo SuperCab Wildtrak 4x4',
      ],
    ],
  },
  {
    slug: 'ranger-single-cab',
    variants: [
      ['ranger-2.0-sit-single-cab-xl-4x2-auto', 'Ranger 2.0 SiT Single Cab XL 4x2 auto'],
      ['2.0-sit-single-cab-xl-4x4-manual', '2.0 SiT Single Cab XL 4x4 Manual'],
      ['ranger-2.0-sit-supercab-xl-4x4', 'Ranger 2.0 SiT SuperCab XL 4x4'],
    ],
  },
  {
    slug: 'next-level-everest',
    variants: [
      ['2.0-sit-active-4x2-10at', '2.0 SiT Active 4x2 10AT'],
      ['2.0-sit-active-4x4-10at', '2.0 SiT Active 4x4 10AT'],
      ['3.0-v6-sport-4x4-10at', '3.0 V6 Sport 4x4 10AT'],
      ['3.0-v6-wildtrak-4x4-10at', '3.0 V6 Wildtrak 4x4 10AT'],
      ['3.0-v6-platinum-4x4-10at', '3.0 V6 Platinum 4x4 10AT'],
    ],
  },
  {
    slug: 'new-level-territory',
    variants: [
      ['territory-1.8t-ambiente', 'Territory 1.8T Ambiente'],
      ['territory-1.8t-trend', 'Territory 1.8T Trend'],
      ['1.8t-titanium', '1.8T Titanium'],
    ],
  },
  {
    slug: 'mustang-gt',
    variants: [['mustang-5.0l-v8-gt-fastback-10at', 'MUSTANG 5.0L V8 GT FASTBACK 10AT']],
  },
  {
    slug: 'mustang-dark-horse',
    variants: [['mustang-5.0l-v8-dark-horse-10at', 'MUSTANG 5.0L V8 DARK HORSE 10AT']],
  },
  {
    slug: 'new-tourneo-custom',
    variants: [
      ['tourneo-trend', 'Tourneo Trend'],
      ['tourneo-sport', 'Tourneo Sport'],
      ['tourneo-titanium-x', 'Tourneo Titanium X'],
    ],
  },
  {
    slug: 'new-transit-custom',
    variants: [['transit-custom-2.0l-lwb-van-base-6mt', 'TRANSIT CUSTOM 2.0L LWB VAN BASE 6MT']],
  },
  {
    slug: 'transit-van',
    variants: [['2.2-tdci-elwb-ambiente-6mt', '2.2 TDCi ELWB Ambiente 6MT']],
  },
].map((v) => ({
  ...v,
  variants: v.variants.map(([slug, name]) => ({
    slug,
    name,
    tokens: tokenSet(`${name} ${slug}`),
  })),
}))

function detectVehicle(title, subTitle, specialSlug) {
  const hay = `${title} ${subTitle} ${specialSlug}`.toLowerCase()
  if (/dark horse/.test(hay)) return CATALOG.find((v) => v.slug === 'mustang-dark-horse')
  if (/mustang/.test(hay)) return CATALOG.find((v) => v.slug === 'mustang-gt')
  if (/everest/.test(hay)) return CATALOG.find((v) => v.slug === 'next-level-everest')
  if (/territory/.test(hay)) return CATALOG.find((v) => v.slug === 'new-level-territory')
  if (/tourneo/.test(hay)) return CATALOG.find((v) => v.slug === 'new-tourneo-custom')
  if (/transit custom/.test(hay)) return CATALOG.find((v) => v.slug === 'new-transit-custom')
  if (/transit/.test(hay)) return CATALOG.find((v) => v.slug === 'transit-van')
  if (/ranger/.test(hay) || /raptor/.test(hay)) {
    if (/single\s*cab|\bsinglecab\b/.test(hay) || /ranger-sc-/.test(specialSlug)) {
      return CATALOG.find((v) => v.slug === 'ranger-single-cab')
    }
    if (
      /super\s*cab|\bsupercab\b|\bsup\b/.test(hay) ||
      /ranger-sup-/.test(specialSlug) ||
      /-super-cab-/.test(specialSlug)
    ) {
      return CATALOG.find((v) => v.slug === 'ranger-super-cab')
    }
    return CATALOG.find((v) => v.slug === 'next-level-ranger')
  }
  return null
}

function bestVariant(vehicle, subTitle, specialSlug) {
  const needle = tokenSet(`${subTitle} ${specialSlug}`).filter(
    (t) => !['ford', 'next', 'level', 'new', 'ranger', 'everest', 'offer'].includes(t),
  )
  let best = null
  for (const variant of vehicle.variants) {
    const score = scoreTokens(variant.tokens, needle)
    if (!best || score > best.score) best = { slug: variant.slug, score }
  }
  if (!best || best.score < 0.45) return null
  return best.slug
}

function matchSpecial(entry) {
  if (entry.offerType === 'service' || entry.offerType === 'enquiry') {
    return { vehicleSlug: null, modelSlug: null }
  }
  const vehicle = detectVehicle(entry.title, entry.subTitle, entry.slug)
  if (!vehicle) return { vehicleSlug: null, modelSlug: null }
  return {
    vehicleSlug: vehicle.slug,
    modelSlug: bestVariant(vehicle, entry.subTitle, entry.slug),
  }
}

function serializeValue(value, indent = 0) {
  const pad = '  '.repeat(indent)
  const next = indent + 1
  const nextPad = '  '.repeat(next)
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'string') return JSON.stringify(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return `[\n${value.map((item) => `${nextPad}${serializeValue(item, next)},`).join('\n')}\n${pad}]`
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined)
    return `{\n${entries
      .map(([k, v]) => `${nextPad}${k}: ${serializeValue(v, next)},`)
      .join('\n')}\n${pad}}`
  }
  return JSON.stringify(value)
}

const source = readFileSync(DATA_FILE, 'utf8')
const arrayStart = source.indexOf('export const SPECIALS_SEED_DATA')
const eq = source.indexOf('[', arrayStart)
// Evaluate array by transforming TS to JSON-ish via Function — strip types first
const arrayLiteral = source.slice(eq)
// Convert to JS object by wrapping
const specials = Function(`"use strict"; return (${arrayLiteral.replace(/as const/g, '')})`)()

let linked = 0
let vehicleOnly = 0
let unlinked = 0

const enriched = specials.map((entry) => {
  const { vehicleSlug, modelSlug } = matchSpecial(entry)
  const next = { ...entry }
  delete next.vehicleSlug
  delete next.modelSlug
  if (vehicleSlug) {
    next.vehicleSlug = vehicleSlug
    linked++
    if (modelSlug) next.modelSlug = modelSlug
    else vehicleOnly++
  } else {
    unlinked++
  }
  return next
})

const file = `import type { OfferType } from '@/lib/specials/constants'

/**
 * Static seed data for specials import.
 * Generated from https://www.eagleford.co.za/specials/ via scripts/generate-specials-data.mjs
 * Catalog links (vehicleSlug / modelSlug) enriched via scripts/enrich-specials-catalog-links.mjs
 */
export type SpecialSeedEntry = {
  slug: string
  title: string
  subTitle: string
  offerType: OfferType
  pricingLabel?: string
  specialOffer?: number
  sortOrder: number
  cardImageUrl: string
  detailImageUrl: string
  contentSubheading: string
  bodyHtml: string
  /** Parent vehicle family slug from vehicles seed (omit when not applicable) */
  vehicleSlug?: string
  /** Vehicle model / variant slug (omit when not applicable) */
  modelSlug?: string
}

export const SPECIALS_SEED_DATA: SpecialSeedEntry[] = ${serializeValue(enriched)}
`

writeFileSync(DATA_FILE, file, 'utf8')
console.log(
  `Enriched ${enriched.length} specials — with vehicle: ${linked}, with model: ${linked - vehicleOnly}, vehicle-only: ${vehicleOnly}, unlinked: ${unlinked}`,
)
