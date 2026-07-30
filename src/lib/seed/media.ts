import { toPayloadFile, type SeedImage } from '@/lib/vehicle-seed-images'
import type { Payload, PayloadRequest } from 'payload'
import sharp from 'sharp'

export type ImageImportStats = {
  imagesUploaded: number
  imagesMissing: number
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

async function normalizeSeedImageBuffer(
  buffer: Buffer,
  contentType: string | null,
): Promise<Buffer> {
  const type = contentType?.toLowerCase() ?? ''

  // Brochures and other non-images also flow through fetchRemoteImage — leave them alone.
  if (type && !type.startsWith('image/') && !type.includes('octet-stream')) {
    return buffer
  }

  try {
    const format = type.includes('avif') ? 'avif' : (await sharp(buffer).metadata()).format
    if (format !== 'avif') return buffer

    // Seed image filenames are always .webp; convert AVIF so Payload mime checks match.
    return sharp(buffer).webp().toBuffer()
  } catch {
    return buffer
  }
}

export async function findSeedMediaId(
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

export async function fetchRemoteImage(url: string): Promise<SeedImage | null> {
  try {
    const parsed = new URL(url)
    const response = await fetch(url, {
      headers: {
        // Some OEM CDNs (e.g. ford.co.za) reject bare fetches without a browser UA/Referer.
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: `${parsed.origin}/`,
        // Prefer formats the Media collection historically allowed; some CDNs still return AVIF.
        Accept: 'image/webp,image/png,image/jpeg,image/*,*/*;q=0.8',
      },
    })
    if (!response.ok) return null

    const rawBuffer = Buffer.from(await response.arrayBuffer())
    const buffer = await normalizeSeedImageBuffer(rawBuffer, response.headers.get('content-type'))
    const filename = decodeURIComponent(parsed.pathname.split('/').pop() ?? 'image.webp')

    return { buffer, filename }
  } catch {
    return null
  }
}

export async function uploadSeedImage(
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
