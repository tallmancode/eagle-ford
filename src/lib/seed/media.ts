import { toPayloadFile, type SeedImage } from '@/lib/vehicle-seed-images'
import type { Payload, PayloadRequest } from 'payload'

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
    const response = await fetch(url)
    if (!response.ok) return null

    const buffer = Buffer.from(await response.arrayBuffer())
    const pathname = new URL(url).pathname
    const filename = decodeURIComponent(pathname.split('/').pop() ?? 'image.webp')

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
