/**
 * Scrapes eagleford.co.za/specials and writes nested DATA to
 * src/lib/specials-seed/specials-data.ts (payment + price-point only).
 * Run: node scripts/generate-specials-data.mjs
 */
import { writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LIVE_SITE_BASE = 'https://www.eagleford.co.za'
const LISTING_URL = `${LIVE_SITE_BASE}/specials/`
const OUT_FILE = join(__dirname, '../src/lib/specials-seed/specials-data.ts')

/** Live data-sub → short CMS category title */
const SUB_TO_CATEGORY = {
  'truck-month-ranger-double-cab-offers': 'Ranger Double Cab Specials',
  'truck-month-super-cab-ranger-offers': 'Ranger Super Cab Specials',
  'truck-month-ranger-single-cab-offers': 'Ranger Single Cab Specials',
  'new-level-territory-offers': 'Territory Specials',
  'next-level-everest-offers': 'Everest Specials',
  'ranger-raptor-offers': 'Ranger Raptor Specials',
  'mustang-offers': 'Mustang Specials',
  'transit-custom-offers': 'Transit Custom Specials',
  'tourneo-custom-offers': 'Tourneo Custom Specials',
}

const CATEGORY_ORDER = Object.values(SUB_TO_CATEGORY)

function toAbsoluteUrl(path) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${LIVE_SITE_BASE}${path.startsWith('/') ? path : `/${path}`}`
}

function extractSlug(href) {
  const path = href.replace(/^\/+|\/+$/g, '').replace(/^specials\//, '')
  return path.replace(/^-+/, '')
}

function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\uFFFD/g, '•')
    .replace(/[•·]/g, '•')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractTitleFromHeading(html) {
  const boldMatch = html.match(/<span class="font-bold text-2xl">([\s\S]*?)<\/span>/i)
  if (boldMatch) {
    const bold = stripHtml(boldMatch[1])
    const beforeBold = stripHtml(html.slice(0, boldMatch.index ?? 0))
    if (/ford/i.test(beforeBold)) return `Ford ${bold}`.trim()
    return bold
  }
  return stripHtml(html)
}

/** Require a digit after R so /R/i does not match the "r" in "Offer". */
function parseZarAmount(text) {
  const match = text.match(/R\s*(\d[\d\s,]*)/i)
  if (!match) return null
  const amount = Number.parseInt(match[1].replace(/[\s,]/g, ''), 10)
  return Number.isFinite(amount) ? amount : null
}

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
    name: 'Next Level Ranger',
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
    name: 'Ranger Super Cab',
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
    name: 'Ranger Single Cab',
    variants: [
      ['ranger-2.0-sit-single-cab-xl-4x2-auto', 'Ranger 2.0 SiT Single Cab XL 4x2 auto'],
      ['2.0-sit-single-cab-xl-4x4-manual', '2.0 SiT Single Cab XL 4x4 Manual'],
      ['ranger-2.0-sit-supercab-xl-4x4', 'Ranger 2.0 SiT SuperCab XL 4x4'],
    ],
  },
  {
    slug: 'next-level-everest',
    name: 'Next Level Everest',
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
    name: 'New Level Territory',
    variants: [
      ['territory-1.8t-ambiente', 'Territory 1.8T Ambiente'],
      ['territory-1.8t-trend', 'Territory 1.8T Trend'],
      ['1.8t-titanium', '1.8T Titanium'],
    ],
  },
  {
    slug: 'mustang-gt',
    name: 'Mustang GT',
    variants: [['mustang-5.0l-v8-gt-fastback-10at', 'MUSTANG 5.0L V8 GT FASTBACK 10AT']],
  },
  {
    slug: 'mustang-dark-horse',
    name: 'Mustang Dark Horse',
    variants: [['mustang-5.0l-v8-dark-horse-10at', 'MUSTANG 5.0L V8 DARK HORSE 10AT']],
  },
  {
    slug: 'new-tourneo-custom',
    name: 'New Tourneo Custom',
    variants: [
      ['tourneo-trend', 'Tourneo Trend'],
      ['tourneo-sport', 'Tourneo Sport'],
      ['tourneo-titanium-x', 'Tourneo Titanium X'],
    ],
  },
  {
    slug: 'new-transit-custom',
    name: 'New Transit Custom',
    variants: [['transit-custom-2.0l-lwb-van-base-6mt', 'TRANSIT CUSTOM 2.0L LWB VAN BASE 6MT']],
  },
  {
    slug: 'transit-van',
    name: 'Transit Van',
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
    const score = scoreTokens(variant.tokens, needle.length > 0 ? needle : tokenSet(subTitle))
    if (!best || score > best.score) best = { slug: variant.slug, name: variant.name, score }
  }
  if (!best || best.score < 0.45) return null
  // CMS slug style used in seed linkedModel (dots stripped)
  return best.slug.replace(/\./g, '')
}

function matchCatalogNames(title, labelOverride, slug) {
  const vehicle = detectVehicle(title, labelOverride, slug)
  if (!vehicle) return { linkedVehicle: undefined, linkedModel: undefined }
  return {
    linkedVehicle: vehicle.name,
    linkedModel: bestVariant(vehicle, labelOverride, slug) ?? undefined,
  }
}

function detectOfferType(typeLabel, pricingLines) {
  if (/price point/i.test(typeLabel) || pricingLines.some((l) => /special offer/i.test(l))) {
    return 'price-point'
  }
  if (/payment/i.test(typeLabel) || pricingLines.some((l) => /from\s+r/i.test(l))) {
    return 'payment'
  }
  return null
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
    if (entries.length === 0) return '{}'
    return `{\n${entries
      .map(([k, v]) => `${nextPad}${k}: ${serializeValue(v, next)},`)
      .join('\n')}\n${pad}}`
  }
  return JSON.stringify(value)
}

async function fetchText(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
  return response.text()
}

async function main() {
  console.log('Fetching listing...')
  const listingHtml = await fetchText(LISTING_URL)

  const cardRegex =
    /<div class="offer-card[\s\S]*?data-sub="([^"]*)"[\s\S]*?data-category="([^"]*)"[\s\S]*?<a href="([^"]+)"[\s\S]*?<img src="([^"]+)"[\s\S]*?<h3 class="text-xl[\s\S]*?>([\s\S]*?)<\/h3>[\s\S]*?<p class="text-base[\s\S]*?>([\s\S]*?)<\/p>[\s\S]*?<h3 class="text-sm text-primary min-h-6 mb-1 sub-cat-name hidden">([\s\S]*?)<\/h3>[\s\S]*?<div class="flex flex-col w-full h-16">([\s\S]*?)<\/div>/gi

  /** @type {Map<string, object[]>} */
  const byCategory = new Map()
  for (const title of CATEGORY_ORDER) byCategory.set(title, [])

  let kept = 0
  let skipped = 0
  let match
  while ((match = cardRegex.exec(listingHtml)) !== null) {
    const [, dataSub, , href, imageSrc, titleHtml, subtitleHtml, hiddenType, pricingDiv] = match
    const categoryTitle = SUB_TO_CATEGORY[dataSub]
    if (!categoryTitle) {
      skipped++
      continue
    }

    const pricingLines = [...pricingDiv.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)]
      .map((m) => stripHtml(m[1]))
      .filter(Boolean)

    const typeLabel = stripHtml(hiddenType)
    const offerType = detectOfferType(typeLabel, pricingLines)
    if (offerType !== 'price-point' && offerType !== 'payment') {
      skipped++
      continue
    }

    const title = extractTitleFromHeading(titleHtml)
    const labelOverride = stripHtml(subtitleHtml)
    const slug = extractSlug(href)
    const { linkedVehicle, linkedModel } = matchCatalogNames(title, labelOverride, slug)

    const imageUrl = toAbsoluteUrl(imageSrc)
    const entry = {
      offerType,
      labelOverride,
      cardImage: imageUrl,
      // Same as card for now (no separate detail scrape)
      detailImageUrl: imageUrl,
      ...(linkedVehicle ? { linkedVehicle } : {}),
      ...(linkedModel ? { linkedModel } : {}),
      slug,
    }

    if (offerType === 'price-point') {
      const offerLine = pricingLines.find((l) => /special offer/i.test(l))
      const savingLine = pricingLines.find((l) => /best saving/i.test(l))
      const specialOffer = offerLine ? parseZarAmount(offerLine) : null
      const bestSaving = savingLine ? parseZarAmount(savingLine) : null
      if (specialOffer != null) entry.specialOffer = specialOffer
      if (bestSaving != null) entry.bestSaving = bestSaving
    } else {
      const paymentLine = pricingLines.find((l) => /from\s+r/i.test(l)) ?? pricingLines[0]
      const paymentFrom = paymentLine ? parseZarAmount(paymentLine) : null
      if (paymentFrom != null) entry.paymentFrom = paymentFrom
    }

    byCategory.get(categoryTitle).push(entry)
    kept++
  }

  const data = CATEGORY_ORDER.filter((title) => (byCategory.get(title) ?? []).length > 0).map(
    (specialsCategory) => ({
      specialsCategory,
      specials: byCategory.get(specialsCategory),
    }),
  )

  const file = `import type { OfferType } from '@/lib/specials/constants'

/**
 * Static seed data for specials import.
 * Generated from https://www.eagleford.co.za/specials/ via scripts/generate-specials-data.mjs
 */
export type SpecialSeedItem = {
  offerType: Extract<OfferType, 'price-point' | 'payment'>
  labelOverride: string
  cardImage: string
  /** Detail/hero image URL — same as cardImage for now */
  detailImageUrl: string
  /** Catalog vehicle family name or slug (e.g. "Next Level Ranger" / "next-level-ranger") */
  linkedVehicle?: string
  /** CMS vehicle-model slug (preferred) or catalog display name */
  linkedModel?: string
  specialOffer?: number
  bestSaving?: number
  paymentFrom?: number
  slug: string
}

export type SpecialSeedCategory = {
  specialsCategory: string
  specials: SpecialSeedItem[]
}

/** Flat entry used by the import route (category + item). */
export type SpecialSeedEntry = SpecialSeedItem & {
  specialsCategory: string
  sortOrder: number
}

export const DATA: SpecialSeedCategory[] = ${serializeValue(data)}

export const SPECIALS_SEED_DATA: SpecialSeedEntry[] = DATA.flatMap((category) =>
  category.specials.map((special, index) => ({
    ...special,
    specialsCategory: category.specialsCategory,
    sortOrder: index + 1,
  })),
)
`

  writeFileSync(OUT_FILE, file, 'utf8')
  console.log(`Kept ${kept} specials (skipped ${skipped}) across ${data.length} categories`)
  for (const cat of data) {
    console.log(`  ${cat.specialsCategory}: ${cat.specials.length}`)
  }
  console.log(`Wrote ${OUT_FILE}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
