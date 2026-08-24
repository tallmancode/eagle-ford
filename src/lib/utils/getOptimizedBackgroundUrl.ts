import type { Media } from '@/payload-types'
import { getOptimalMediaSize } from '@/lib/utils/getOptimalMediaSize'

/** Full-bleed CSS backgrounds do not need ultrawide 3440px sources. */
const BACKGROUND_MAX_WIDTH = 1920
const BACKGROUND_REQUEST_WIDTH = 1920
const BACKGROUND_QUALITY = 65

/**
 * Builds a Next.js `/_next/image` URL suitable for CSS `background-image`.
 * Caps the Payload derivative and optimizer width so fixed-bg sections do not
 * download original uploads (often 3–4k / 200KB+).
 */
export function getOptimizedBackgroundUrl(
  media: Media | null | undefined,
  options?: { maxWidth?: number; width?: number; quality?: number },
): string | null {
  if (!media) return null

  const maxWidth = options?.maxWidth ?? BACKGROUND_MAX_WIDTH
  const requestWidth = options?.width ?? BACKGROUND_REQUEST_WIDTH
  const quality = options?.quality ?? BACKGROUND_QUALITY

  const optimal = getOptimalMediaSize(media, maxWidth)
  if (!optimal?.url) return null

  return `/_next/image?url=${encodeURIComponent(optimal.url)}&w=${requestWidth}&q=${quality}`
}
