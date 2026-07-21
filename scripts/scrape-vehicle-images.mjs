/**
 * Eagle Ford — Vehicle Image Scraper
 *
 * Fetches all vehicle and variant pages from eagleford.co.za,
 * extracts image URLs, and downloads them into:
 *   public/images/vehicles/{vehicle-slug}/
 *     hero.{ext}
 *     gallery-1.{ext}  gallery-2.{ext}  ...
 *     colours/          (colour swatch images)
 *     variants/{variant-slug}/
 *       swatch-{colour}.{ext}
 *
 * Usage:  node scripts/scrape-vehicle-images.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUTPUT_DIR = path.join(ROOT, 'public', 'images', 'vehicles')

const USER_AGENT = 'Mozilla/5.0 (compatible; EagleFordScraper/1.0)'
const BASE = 'https://www.eagleford.co.za'

// ---------------------------------------------------------------------------
// All pages to scrape
// ---------------------------------------------------------------------------

const VEHICLES = [
  {
    slug: 'next-level-ranger',
    url: `${BASE}/new/next-level-ranger/`,
    variantSlugs: [
      '2.0-sit-double-cab-xl-4x2-6mt',
      '2.0-sit-double-cab-xlt-4x2-10at',
      '2.3l-double-cab-sport-4x2-10at',
      '2.3l-double-cab-wildtrak-4x2-10at',
      '3.0l-v6-double-cab-tremor-4x4-10at',
      '3.0l-v6-double-cab-wildtrak-4x4-10at',
      '3.0l-v6-double-cab-platinum-4x4-10at',
      '3.0l-v6-tt-double-cab-raptor-4x4-10at',
    ],
  },
  {
    slug: 'ranger-super-cab',
    url: `${BASE}/new/ranger-super-cab/`,
    variantSlugs: [
      'ranger-2.0-sit-supercab-xl-auto',
      'ranger-2.0-sit-supercab-xlt',
      'ford-ranger-2.0-biturbo-supercab-wildtrak-4x4',
    ],
  },
  {
    slug: 'ranger-single-cab',
    url: `${BASE}/new/ranger-single-cab/`,
    variantSlugs: [
      'ranger-2.0-sit-single-cab-xl-4x2-auto',
      '2.0-sit-single-cab-xl-4x4-manual',
      'ranger-2.0-sit-supercab-xl-4x4',
    ],
  },
  {
    slug: 'ranger-sport',
    url: `${BASE}/new/ranger-sport/`,
    variantSlugs: [
      '2.3l-double-cab-sport-4x2-10at',
      '2.3l-super-cab-sport-4x2-10at',
      '3.0l-v6td-double-cab-sport-4x4-10at',
      '3.0td-v6-super-cab-sport-4x4-10at',
    ],
  },
  {
    slug: 'ranger-platinum',
    url: `${BASE}/new/ranger-platinum/`,
    variantSlugs: [
      '3.0td-v6-ranger-double-cab-platinum-4x4-10at',
      '3.0l-v6-double-cab-platinum-4x4-10at',
    ],
  },
  {
    slug: 'ranger-tremor',
    url: `${BASE}/new/ranger-tremor/`,
    variantSlugs: ['ford-ranger-tremor', '3.0l-v6-double-cab-tremor-4x4-10at'],
  },
  {
    slug: 'ranger-raptor',
    url: `${BASE}/new/ranger-raptor/`,
    variantSlugs: ['ranger-3.0t-v6-double-cab-raptor-4wd', '3.0l-v6-tt-double-cab-raptor-4x4-10at'],
  },
  {
    slug: 'ranger-wildtrak',
    url: `${BASE}/new/ranger-wildtrak/`,
    variantSlugs: [
      '2.0-biturbo-double-cab-wildtrak-4x2-10at',
      '2.0-biturbo-double-cab-wildtrak-4x4-10at',
      '2.3l-double-cab-wildtrak-4x2-10at',
      '3.0td-v6-double-cab-wildtrak-4x4-10at',
      '3.0l-v6-double-cab-wildtrak-4x4-10at',
    ],
  },
  {
    slug: 'ranger-wildtrak-x',
    url: `${BASE}/new/ranger-wildtrak-x/`,
    variantSlugs: ['2.0-biturbo-double-cab-wildtrak-x-4wd-10at'],
  },
  {
    slug: 'ranger-xl',
    url: `${BASE}/new/ranger-xl/`,
    variantSlugs: [
      'ranger-2.0l-sit-sc-xl-4x2-10at',
      'ranger-2.0l-sit-sc-xl-4x4-10at',
      'ranger-2.0l-sit-sc-xl-4x4-6mt',
      'ranger-2.0l-sit-sup-xl-4x2-10at',
      'ranger-2.0l-sit-sup-xl-4x4-10at',
    ],
  },
  {
    slug: 'ranger-xlt',
    url: `${BASE}/new/ranger-xlt/`,
    variantSlugs: [
      '2.0-sit-double-cab-xlt-4x2-10at',
      '2.0-sit-double-cab-xlt-4x4-10at',
      '2.0-sit-super-cab-xlt-4x2-10at',
      '2.0-sit-super-cab-xlt-4x4-10at',
    ],
  },
  {
    slug: 'next-level-everest',
    url: `${BASE}/new/next-level-everest/`,
    variantSlugs: [
      '2.0-sit-active-4x2-10at',
      '2.0-sit-active-4x4-10at',
      '3.0-v6-sport-4x4-10at',
      '3.0-v6-wildtrak-4x4-10at',
      '3.0-v6-platinum-4x4-10at',
    ],
  },
  {
    slug: 'new-level-territory',
    url: `${BASE}/new/new-level-territory/`,
    variantSlugs: ['territory-1.8t-ambiente', 'territory-1.8t-trend', '1.8t-titanium'],
  },
  {
    slug: 'mustang-gt',
    url: `${BASE}/new/mustang-gt/`,
    variantSlugs: ['mustang-5.0l-v8-gt-fastback-10at'],
  },
  {
    slug: 'mustang-dark-horse',
    url: `${BASE}/new/mustang-dark-horse/`,
    variantSlugs: ['mustang-5.0l-v8-dark-horse-10at'],
  },
  {
    slug: 'new-tourneo-custom',
    url: `${BASE}/new/new-tourneo-custom/`,
    variantSlugs: ['tourneo-trend', 'tourneo-sport', 'tourneo-titanium-x'],
  },
  {
    slug: 'new-transit-custom',
    url: `${BASE}/new/new-transit-custom/`,
    variantSlugs: ['transit-custom-2.0l-lwb-van-base-6mt'],
  },
  {
    slug: 'transit-van',
    url: `${BASE}/new/transit-van/`,
    variantSlugs: ['2.2-tdci-elwb-ambiente-6mt'],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function ext(url) {
  const match = url.split('?')[0].match(/\.(\w+)$/)
  return match ? match[1].toLowerCase() : 'jpg'
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

async function fetchHtml(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) {
      console.warn(`  ⚠  ${res.status} ${url}`)
      return null
    }
    return await res.text()
  } catch (err) {
    console.warn(`  ⚠  Failed to fetch ${url}: ${err.message}`)
    return null
  }
}

async function downloadImage(url, dest) {
  if (fs.existsSync(dest)) {
    console.log(`     already exists, skipping: ${path.basename(dest)}`)
    return true
  }
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) {
      console.warn(`  ⚠  ${res.status} downloading ${url}`)
      return false
    }
    const buf = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(dest, buf)
    console.log(`     ✓ ${path.relative(ROOT, dest)}`)
    return true
  } catch (err) {
    console.warn(`  ⚠  Error downloading ${url}: ${err.message}`)
    return false
  }
}

function extractImages(html, label) {
  if (!html) return []

  // All absolute eagleford image URLs
  const re = /src="(https?:\/\/(?:www\.)?eagleford\.co\.za[^"]+\.(?:jpg|jpeg|png|webp|gif))"/gi
  const all = [...html.matchAll(re)]
    .map((m) => m[1])
    .filter(
      (u) =>
        !u.includes('logo') &&
        !u.includes('icon') &&
        !u.includes('arrow') &&
        !u.includes('favicon') &&
        !u.includes('suzuki') &&
        !u.includes('whatsapp') &&
        !u.includes('flag') &&
        !u.includes('social'),
    )
    .filter((u, i, arr) => arr.indexOf(u) === i) // deduplicate

  // Also capture data-src (lazy-loaded images)
  const lazy =
    /data-src="(https?:\/\/(?:www\.)?eagleford\.co\.za[^"]+\.(?:jpg|jpeg|png|webp|gif))"/gi
  const lazyAll = [...html.matchAll(lazy)]
    .map((m) => m[1])
    .filter((u, i, arr) => arr.indexOf(u) === i)

  const combined = [...new Set([...all, ...lazyAll])]
  console.log(`  Found ${combined.length} image(s) on ${label}`)
  return combined
}

function extractColourSwatches(html) {
  if (!html) return []
  // <img ... alt="Something Colour" ... src="...">  (any order of attributes)
  const re =
    /<img(?=[^>]*alt="([^"]*(?:Colour|colour)[^"]*)")(?=[^>]*src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))")(?:[^>]*)>/gi
  const results = []
  for (const m of html.matchAll(re)) {
    results.push({ label: m[1].replace(/\s*Colour\s*/i, '').trim(), src: m[2] })
  }
  // Also try reversed attribute order
  const re2 =
    /<img(?=[^>]*src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))")(?=[^>]*alt="([^"]*(?:Colour|colour)[^"]*)")(?:[^>]*)>/gi
  for (const m of html.matchAll(re2)) {
    if (!results.find((r) => r.src === m[1])) {
      results.push({ label: m[2].replace(/\s*Colour\s*/i, '').trim(), src: m[1] })
    }
  }
  return results
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  ensureDir(OUTPUT_DIR)
  console.log(`\nOutput directory: ${OUTPUT_DIR}\n`)

  let totalDownloaded = 0
  let totalFailed = 0

  for (const vehicle of VEHICLES) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`Vehicle: ${vehicle.slug}`)
    console.log('='.repeat(60))

    const vehicleDir = path.join(OUTPUT_DIR, vehicle.slug)
    ensureDir(vehicleDir)

    // ── Vehicle page ─────────────────────────────────────────────────────────
    const html = await fetchHtml(vehicle.url)
    const images = extractImages(html, vehicle.url)

    // Hero — first image
    if (images[0]) {
      const ok = await downloadImage(images[0], path.join(vehicleDir, `hero.${ext(images[0])}`))
      ok ? totalDownloaded++ : totalFailed++
    }

    // Gallery — remaining images
    if (images.length > 1) {
      const galleryDir = path.join(vehicleDir, 'gallery')
      ensureDir(galleryDir)
      for (let i = 1; i < images.length; i++) {
        const ok = await downloadImage(
          images[i],
          path.join(galleryDir, `gallery-${i}.${ext(images[i])}`),
        )
        ok ? totalDownloaded++ : totalFailed++
      }
    }

    // Colour swatches from vehicle page
    const swatches = extractColourSwatches(html)
    if (swatches.length > 0) {
      const coloursDir = path.join(vehicleDir, 'colours')
      ensureDir(coloursDir)
      console.log(`  Colour swatches found: ${swatches.length}`)
      for (const swatch of swatches) {
        const filename = `${slugify(swatch.label)}.${ext(swatch.src)}`
        const ok = await downloadImage(swatch.src, path.join(coloursDir, filename))
        ok ? totalDownloaded++ : totalFailed++
      }
    }

    // ── Variant pages ─────────────────────────────────────────────────────────
    for (const variantSlug of vehicle.variantSlugs) {
      const variantUrl = `${vehicle.url}${variantSlug}/`
      console.log(`\n  Variant: ${variantSlug}`)

      const variantHtml = await fetchHtml(variantUrl)
      if (!variantHtml) {
        console.warn(`  Skipped (no HTML)`)
        continue
      }

      const variantDir = path.join(vehicleDir, 'variants', variantSlug)
      const variantImages = extractImages(variantHtml, variantUrl)
      const variantSwatches = extractColourSwatches(variantHtml)

      // Variant hero (if different from vehicle hero)
      if (variantImages[0] && variantImages[0] !== images[0]) {
        ensureDir(variantDir)
        const ok = await downloadImage(
          variantImages[0],
          path.join(variantDir, `hero.${ext(variantImages[0])}`),
        )
        ok ? totalDownloaded++ : totalFailed++
      }

      // Variant colour swatches
      if (variantSwatches.length > 0) {
        const swatchDir = path.join(variantDir, 'colours')
        ensureDir(swatchDir)
        console.log(`    Colour swatches found: ${variantSwatches.length}`)
        for (const swatch of variantSwatches) {
          const filename = `${slugify(swatch.label)}.${ext(swatch.src)}`
          const ok = await downloadImage(swatch.src, path.join(swatchDir, filename))
          ok ? totalDownloaded++ : totalFailed++
        }
      }
    }
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`Done!`)
  console.log(`  Downloaded : ${totalDownloaded}`)
  console.log(`  Failed     : ${totalFailed}`)
  console.log(`  Saved to   : ${OUTPUT_DIR}`)
  console.log('='.repeat(60))
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
