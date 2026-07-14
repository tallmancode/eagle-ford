/**
 * Scrapes eagleford.co.za/specials and writes src/lib/specials-seed/specials-data.ts
 * Run: node scripts/generate-specials-data.mjs
 */
import { writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LIVE_SITE_BASE = 'https://www.eagleford.co.za'
const LISTING_URL = `${LIVE_SITE_BASE}/specials/`
const OUT_FILE = join(__dirname, '../src/lib/specials-seed/specials-data.ts')

function toAbsoluteUrl(path) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${LIVE_SITE_BASE}${path.startsWith('/') ? path : `/${path}`}`
}

function extractSlug(href) {
  // Keep the live numeric offer id so duplicate model names stay unique.
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
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
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

function parseZarAmount(text) {
  const match = text.match(/R\s*([\d\s,]+)/i)
  if (!match) return null
  const amount = Number.parseInt(match[1].replace(/[\s,]/g, ''), 10)
  return Number.isFinite(amount) ? amount : null
}

function parsePricing(listing, bodyHtml) {
  const bodyText = stripHtml(bodyHtml)
  const hidden = listing.hiddenOfferTypeLabel.toLowerCase()
  const pricingLines = listing.pricingLines

  if (hidden.includes('price point') || pricingLines.some((l) => /special offer/i.test(l))) {
    const offerLine = pricingLines.find((l) => /special offer/i.test(l)) ?? pricingLines[0]
    const amount = offerLine ? parseZarAmount(offerLine) : null
    return {
      offerType: 'price-point',
      pricingLabel: 'Special Offer',
      specialOffer: amount ?? undefined,
    }
  }

  if (hidden.includes('payment') || pricingLines.some((l) => /from\s+r/i.test(l))) {
    const paymentLine = pricingLines.find((l) => /from\s+r/i.test(l)) ?? pricingLines[0]
    const amount = paymentLine ? parseZarAmount(paymentLine) : null
    return {
      offerType: 'payment',
      pricingLabel: 'From',
      specialOffer: amount ?? undefined,
    }
  }

  if (listing.category === 'service' || /save\s+r/i.test(bodyText)) {
    const saveMatch = bodyText.match(/save\s+r\s*([\d\s,]+)/i)
    const amount = saveMatch ? parseZarAmount(`R${saveMatch[1]}`) : null
    return {
      offerType: 'service',
      pricingLabel: amount ? 'Save' : undefined,
      specialOffer: amount ?? undefined,
    }
  }

  return { offerType: 'enquiry' }
}

function extractDetailBodyHtml(html) {
  const startMarker = '<p class="text-lg font-[FordRegular]">'
  const start = html.indexOf(startMarker)
  if (start === -1) return ''
  const after = html.slice(start + startMarker.length)
  const contactIdx = after.search(/<h2[^>]*\bid=["']contact["']/i)
  if (contactIdx === -1) return ''
  let chunk = after.slice(0, contactIdx)
  chunk = chunk.replace(/<\/p>\s*(?:<\/div>\s*|<div[\s\S]*)+$/i, '')
  return chunk.trim()
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function fetchText(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
  return response.text()
}

function serializeValue(value, indent = 0) {
  const pad = '  '.repeat(indent)
  const next = indent + 1
  const nextPad = '  '.repeat(next)

  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'string') {
    return JSON.stringify(value)
  }
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

async function main() {
  console.log('Fetching listing...')
  const listingHtml = await fetchText(LISTING_URL)

  const positions = new Map()
  const jsonLdMatch = listingHtml.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i,
  )
  if (jsonLdMatch) {
    const data = JSON.parse(jsonLdMatch[1])
    for (const item of data.itemListElement ?? []) {
      if (item.url && item.position != null) {
        positions.set(item.url.replace(/\/$/, ''), item.position)
      }
    }
  }

  const cardRegex =
    /<div class="offer-card[\s\S]*?data-category="([^"]*)"[\s\S]*?<a href="([^"]+)"[\s\S]*?<img src="([^"]+)"[\s\S]*?<h3 class="text-xl[\s\S]*?>([\s\S]*?)<\/h3>[\s\S]*?<p class="text-base[\s\S]*?>([\s\S]*?)<\/p>[\s\S]*?<h3 class="text-sm text-primary min-h-6 mb-1 sub-cat-name hidden">([\s\S]*?)<\/h3>[\s\S]*?<div class="flex flex-col w-full h-16">([\s\S]*?)<\/div>[\s\S]*?<span class="btn-primary[\s\S]*?>([\s\S]*?)<\/span>/gi

  const listings = []
  let match
  while ((match = cardRegex.exec(listingHtml)) !== null) {
    const [
      ,
      category,
      href,
      imageSrc,
      titleHtml,
      subtitleHtml,
      hiddenType,
      pricingDiv,
      buttonLabel,
    ] = match
    const detailUrl = toAbsoluteUrl(href)
    listings.push({
      slug: extractSlug(href),
      title: extractTitleFromHeading(titleHtml),
      subTitle: stripHtml(subtitleHtml),
      cardImageUrl: toAbsoluteUrl(imageSrc),
      category,
      hiddenOfferTypeLabel: stripHtml(hiddenType),
      pricingLines: [...pricingDiv.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)]
        .map((m) => stripHtml(m[1]))
        .filter(Boolean),
      buttonLabel: stripHtml(buttonLabel),
      detailUrl,
      sortOrder: positions.get(detailUrl.replace(/\/$/, '')) ?? 999,
    })
  }

  console.log(`Found ${listings.length} cards. Fetching details...`)

  const specials = []
  for (const [index, listing] of listings.entries()) {
    process.stdout.write(`[${index + 1}/${listings.length}] ${listing.slug}... `)
    try {
      const detailHtml = await fetchText(listing.detailUrl)
      const imageMatch =
        detailHtml.match(
          /<div class="offer-form-container">[\s\S]*?<img[^>]*src="([^"]+)"[^>]*class="md:p-14"/i,
        ) ??
        detailHtml.match(
          /<div class="offer-form-container">[\s\S]*?<img[^>]*class="md:p-14"[^>]*src="([^"]+)"/i,
        ) ??
        detailHtml.match(
          /<div class="offer-form-container">[\s\S]*?<img[^>]*src="(\/specials\/[^"]+)"/i,
        )

      const bodyHtml = extractDetailBodyHtml(detailHtml)
      const strongMatch = bodyHtml.match(/<strong>([\s\S]*?)<\/strong>/i)
      const contentSubheading = strongMatch ? stripHtml(strongMatch[1]) : null
      const pricing = parsePricing(listing, bodyHtml)
      const detailImageUrl = imageMatch ? toAbsoluteUrl(imageMatch[1]) : listing.cardImageUrl

      const entry = {
        slug: listing.slug,
        title: listing.title,
        subTitle: listing.subTitle,
        offerType: pricing.offerType,
        sortOrder: listing.sortOrder,
        cardImageUrl: listing.cardImageUrl,
        detailImageUrl,
        contentSubheading: contentSubheading ?? listing.subTitle,
        bodyHtml,
      }
      if (pricing.pricingLabel) entry.pricingLabel = pricing.pricingLabel
      if (pricing.specialOffer != null) entry.specialOffer = pricing.specialOffer

      specials.push(entry)
      console.log('ok')
    } catch (err) {
      console.log(`FAIL: ${err.message}`)
    }
    await sleep(150)
  }

  specials.sort((a, b) => a.sortOrder - b.sortOrder)

  const file = `import type { OfferType } from '@/lib/specials/constants'

/**
 * Static seed data for specials import.
 * Generated from https://www.eagleford.co.za/specials/ via scripts/generate-specials-data.mjs
 * Then enrich catalog links: node scripts/enrich-specials-catalog-links.mjs
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

export const SPECIALS_SEED_DATA: SpecialSeedEntry[] = ${serializeValue(specials)}
`

  writeFileSync(OUT_FILE, file, 'utf8')
  console.log(`\nWrote ${specials.length} specials to ${OUT_FILE}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
