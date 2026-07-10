import AdmZip from 'adm-zip'
import path from 'path'
import type { File } from 'payload'

export type SeedImage = {
  buffer: Buffer
  filename: string
}

const SEED_IMAGES_DIR = path.join(process.cwd(), 'src/assets/Media/seed-images')

const ZIP_FILES = {
  hero: 'all-vehicle-hero-images.zip',
  feature: 'all-vehicle-card-hero-images.zip',
  gallery: 'all-vehicle-gallery-images.zip',
  colour: 'all-vehicle-colour-images.zip',
  model: 'vehicle-model-images.zip',
} as const

const zipCache = new Map<string, AdmZip>()

function getZip(name: keyof typeof ZIP_FILES): AdmZip {
  const key = ZIP_FILES[name]
  let zip = zipCache.get(key)
  if (!zip) {
    zip = new AdmZip(path.join(SEED_IMAGES_DIR, key))
    zipCache.set(key, zip)
  }
  return zip
}

function normalizePath(entryPath: string): string {
  return entryPath.replace(/\\/g, '/')
}

function readEntry(entry: AdmZip.IZipEntry): SeedImage {
  return {
    buffer: entry.getData(),
    filename: path.basename(normalizePath(entry.entryName)),
  }
}

function findEntry(zip: AdmZip, matcher: (normalizedPath: string) => boolean): SeedImage | null {
  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue
    const normalized = normalizePath(entry.entryName)
    if (matcher(normalized)) {
      return readEntry(entry)
    }
  }
  return null
}

function normalizeColourKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/gray/g, 'grey')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function colourFilenameVariants(colourName: string): string[] {
  const hyphenated = colourName.replace(/\s+/g, '-')
  const variants = new Set([
    hyphenated,
    hyphenated.replace(/Grey/gi, 'Gray'),
    hyphenated.replace(/Gray/gi, 'Grey'),
  ])
  return [...variants]
}

function modelSlugAliases(modelSlug: string): string[] {
  const aliases = new Set([modelSlug])
  const withHyphenAt = modelSlug.replace(/(\d)(at)$/, '$1-$2')
  if (withHyphenAt !== modelSlug) aliases.add(withHyphenAt)
  return [...aliases]
}

function gallerySortKey(filename: string): number {
  const match = filename.match(/img_(\d+)/i)
  return match ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER
}

export function getVehicleHero(vehicleSlug: string): SeedImage | null {
  const zip = getZip('hero')
  return findEntry(
    zip,
    (entryPath) => entryPath.toLowerCase() === `${vehicleSlug}/banner.webp`.toLowerCase(),
  )
}

export function getVehicleFeatureImage(vehicleSlug: string): SeedImage | null {
  const zip = getZip('feature')
  return findEntry(
    zip,
    (entryPath) => entryPath.toLowerCase() === `${vehicleSlug}-hero.webp`.toLowerCase(),
  )
}

export function getVehicleGallery(vehicleSlug: string): SeedImage[] {
  const zip = getZip('gallery')
  const prefix = `${vehicleSlug}/`.toLowerCase()

  const images = zip
    .getEntries()
    .filter((entry) => {
      if (entry.isDirectory) return false
      const normalized = normalizePath(entry.entryName).toLowerCase()
      return normalized.startsWith(prefix) && /img_\d+\.webp$/i.test(normalized)
    })
    .map((entry) => readEntry(entry))
    .sort((a, b) => gallerySortKey(a.filename) - gallerySortKey(b.filename))

  return images
}

export function getColourSwatch(vehicleSlug: string, colourName: string): SeedImage | null {
  const zip = getZip('colour')
  const prefix = `${vehicleSlug}/`.toLowerCase()
  const targetKeys = new Set([
    normalizeColourKey(colourName),
    ...colourFilenameVariants(colourName).map((variant) => normalizeColourKey(variant)),
  ])

  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue
    const normalized = normalizePath(entry.entryName)
    if (!normalized.toLowerCase().startsWith(prefix)) continue

    const basename = path.basename(normalized, path.extname(normalized))
    const entryKey = normalizeColourKey(basename)
    if (targetKeys.has(entryKey)) {
      return readEntry(entry)
    }
  }

  return null
}

export function getModelHeroImage(vehicleSlug: string, modelSlug: string): SeedImage | null {
  const zip = getZip('model')

  for (const slug of modelSlugAliases(modelSlug)) {
    const candidates = [
      `vehicle-model-images/${vehicleSlug}/${slug}.webp`,
      `${vehicleSlug}/${slug}.webp`,
    ]

    for (const candidate of candidates) {
      const image = findEntry(
        zip,
        (entryPath) => entryPath.toLowerCase() === candidate.toLowerCase(),
      )
      if (image) return image
    }
  }

  return null
}

function slugifyForFilename(value: string): string {
  return value
    .toLowerCase()
    .replace(/gray/g, 'grey')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function buildSeedMediaFilename(vehicleSlug: string, role: string, suffix: string): string {
  return `${vehicleSlug}-${role}-${slugifyForFilename(suffix)}.webp`
}

export function toPayloadFile(image: SeedImage, filename?: string): File {
  const name = filename ?? image.filename
  const ext = path.extname(name).slice(1).toLowerCase()
  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
  }

  return {
    name,
    data: image.buffer,
    mimetype: mimeMap[ext] ?? 'image/webp',
    size: image.buffer.byteLength,
  }
}
