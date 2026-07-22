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

async function matchCatalogLinks(title, labelOverride, slug, offerType) {
  const { matchSpecialToCatalog } =
    await import('../src/lib/specials-seed/matchSpecialToCatalog.ts')
  const { VEHICLE_CATALOG_DATA } = await import('../src/lib/vehicle-seed/vehicle-catalog-data.ts')

  const match = matchSpecialToCatalog({ title, labelOverride, slug, offerType })
  if (!match.vehicleSlug) return {}

  const vehicle = VEHICLE_CATALOG_DATA.find((v) => v.slug === match.vehicleSlug)
  const model = vehicle?.models.find((m) => m.slug === match.modelSlug)
  const variant = model?.variants.find((v) => v.slug === match.variantSlug)

  return {
    ...(vehicle?.name ? { linkedVehicle: vehicle.name } : {}),
    ...(model?.name ? { linkedModel: model.name } : {}),
    ...(variant?.name ? { linkedVariant: variant.name } : {}),
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
    const { linkedVehicle, linkedModel, linkedVariant } = await matchCatalogLinks(
      title,
      labelOverride,
      slug,
      offerType,
    )

    const imageUrl = toAbsoluteUrl(imageSrc)
    const entry = {
      offerType,
      labelOverride,
      cardImage: imageUrl,
      // Same as card for now (no separate detail scrape)
      detailImageUrl: imageUrl,
      ...(linkedVehicle ? { linkedVehicle } : {}),
      ...(linkedModel ? { linkedModel } : {}),
      ...(linkedVariant ? { linkedVariant } : {}),
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
  /** CMS vehicle-model name or slug (trim level, e.g. "Ranger XL" / "xl") */
  linkedModel?: string
  /** CMS vehicle-variant name or slug (configuration) */
  linkedVariant?: string
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
