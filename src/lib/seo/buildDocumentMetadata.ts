import type { Metadata } from 'next'

import { getDefaultRobots } from '@/constants/crawlerPolicy'
import { formatPageTitle } from '@/constants/site'
import { mergeOpenGraph } from '@/lib/utils/mergeOpenGraph'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'

function toAbsoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }
  const base = getServerSideURL().replace(/\/$/, '')
  return `${base}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`
}

export type DocumentMetadataInput = {
  /** Page title without site suffix (formatPageTitle applied). */
  title: string
  description?: string | null
  /** Site-relative path including leading slash, e.g. `/about-us`. */
  path: string
  /** Absolute or site-relative image URL. */
  imageUrl?: string | null
  robots?: Metadata['robots']
}

/**
 * Shared metadata builder for CMS and dynamic pages: title, description,
 * canonical, Open Graph, and Twitter card.
 */
export function buildDocumentMetadata(input: DocumentMetadataInput): Metadata {
  const title = formatPageTitle(input.title)
  const description = input.description?.trim() || undefined
  const path = input.path.startsWith('/') ? input.path : `/${input.path}`
  const canonical = toAbsoluteUrl(path)
  const image = input.imageUrl ? toAbsoluteUrl(input.imageUrl) : undefined

  return {
    title,
    description,
    robots: input.robots ?? getDefaultRobots(),
    alternates: {
      canonical,
    },
    openGraph: mergeOpenGraph({
      title,
      description: description || '',
      url: path,
      images: image ? [{ url: image }] : undefined,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export function resolveMediaOgUrl(
  media:
    | {
        url?: string | null
        sizes?: { og?: { url?: string | null } | null } | null
      }
    | null
    | undefined,
): string | undefined {
  if (!media) return undefined
  const og = media.sizes?.og?.url
  if (og) return og
  return media.url ?? undefined
}
