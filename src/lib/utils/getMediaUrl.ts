import { getClientSideURL } from '@/lib/utils/getClientSideURL'

const MEDIA_FILE_PATH_PREFIX = '/api/media/file/'

/**
 * Payload may return absolute media URLs when serverURL is set. Next.js Image
 * works best with same-origin relative paths (localPatterns) rather than
 * absolute localhost URLs that require strict remotePatterns matching.
 */
const toRelativeMediaPath = (url: string): string | null => {
  if (url.startsWith(MEDIA_FILE_PATH_PREFIX)) {
    return url
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return null
  }

  try {
    const { pathname } = new URL(url)

    if (pathname.startsWith(MEDIA_FILE_PATH_PREFIX)) {
      return pathname
    }
  } catch {
    return null
  }

  return null
}

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  // Remove existing query parameters from URL (Next.js Image Optimization handles caching)
  const cleanUrl = url.split('?')[0]

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  const relativeMediaPath = toRelativeMediaPath(cleanUrl)

  if (relativeMediaPath) {
    return relativeMediaPath
  }

  // External absolute URL — return as-is
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl
  }

  // Relative path — return as-is so the same string is produced on both
  // server and client. Prepending getClientSideURL() causes a hydration
  // mismatch because canUseDOM differs between SSR and the browser.
  if (cleanUrl.startsWith('/')) {
    return cleanUrl
  }

  // Fallback for protocol-relative or unusual formats
  const baseUrl = getClientSideURL()
  return `${baseUrl}${cleanUrl}`
}
