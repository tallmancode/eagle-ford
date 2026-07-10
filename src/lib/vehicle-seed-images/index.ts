import path from 'path'
import type { File } from 'payload'

export type SeedImage = {
  buffer: Buffer
  filename: string
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
    pdf: 'application/pdf',
  }

  return {
    name,
    data: image.buffer,
    mimetype: mimeMap[ext] ?? 'application/octet-stream',
    size: image.buffer.byteLength,
  }
}
