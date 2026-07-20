import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/lib/utils/getMediaUrl'

/** Aspect-preserving Payload sizes, ordered smallest → largest. Skip square/og (cropped). */
const SIZE_KEYS = ['thumbnail', 'small', 'medium', 'large', 'xlarge'] as const

type SizeKey = (typeof SIZE_KEYS)[number]

export type OptimalMediaSize = {
  url: string
  width: number
  height: number
}

type SizeVariant = NonNullable<Media['sizes']>[SizeKey]

function isUsableVariant(
  variant: SizeVariant | undefined,
): variant is SizeVariant & { url: string; width: number; height: number } {
  return Boolean(
    variant?.url &&
    typeof variant.width === 'number' &&
    variant.width > 0 &&
    typeof variant.height === 'number' &&
    variant.height > 0,
  )
}

/**
 * Picks the smallest Payload-generated size that covers `targetWidth` CSS pixels.
 * Falls back to the largest available derivative, then the original upload.
 */
export function getOptimalMediaSize(
  media: Media,
  targetWidth: number = 1920,
): OptimalMediaSize | null {
  const cacheTag = media.updatedAt
  const sizes = media.sizes

  if (sizes) {
    let largest: OptimalMediaSize | null = null

    for (const key of SIZE_KEYS) {
      const variant = sizes[key]
      if (!isUsableVariant(variant)) continue

      const candidate: OptimalMediaSize = {
        url: getMediaUrl(variant.url, cacheTag),
        width: variant.width,
        height: variant.height,
      }

      largest = candidate

      if (variant.width >= targetWidth) {
        return candidate
      }
    }

    if (largest) return largest
  }

  if (
    media.url &&
    typeof media.width === 'number' &&
    media.width > 0 &&
    typeof media.height === 'number' &&
    media.height > 0
  ) {
    return {
      url: getMediaUrl(media.url, cacheTag),
      width: media.width,
      height: media.height,
    }
  }

  if (media.url) {
    return {
      url: getMediaUrl(media.url, cacheTag),
      width: media.width ?? targetWidth,
      height: media.height ?? Math.round(targetWidth * 0.5625),
    }
  }

  return null
}
