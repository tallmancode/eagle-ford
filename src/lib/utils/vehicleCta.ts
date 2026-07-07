import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/lib/utils/getMediaUrl'

export function getBrochureUrl(brochure: string | Media | null | undefined): string | null {
  if (!brochure || typeof brochure === 'string') return null
  if (!brochure.url) return null
  return getMediaUrl(brochure.url, brochure.updatedAt)
}

type CtaAction = 'enquiry' | 'brochure' | 'link' | null | undefined

export function resolveCtaUrl(
  action: CtaAction,
  options: { url?: string | null; brochureUrl?: string | null },
): string {
  switch (action) {
    case 'enquiry':
      return '#enquire'
    case 'brochure':
      return options.brochureUrl ?? '#'
    case 'link':
      return options.url ?? '#'
    default:
      return '#'
  }
}

export function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}
