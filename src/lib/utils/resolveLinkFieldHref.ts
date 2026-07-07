import type { Page } from '@/payload-types'
import { getPagePath } from '@/lib/utils/getPagePath'

type ResolvedLink = {
  href: string
  openInNewTab: boolean
}

export const resolveLinkFieldHref = (
  link:
    | {
        type?: ('reference' | 'custom') | null
        newTab?: boolean | null
        reference?: {
          relationTo: 'pages'
          value: string | Page
        } | null
        url?: string | null
      }
    | null
    | undefined,
): ResolvedLink | null => {
  if (!link) return null

  const openInNewTab = Boolean(link.newTab)

  if (link.type === 'custom' && link.url) {
    return { href: link.url, openInNewTab }
  }

  if (link.type === 'reference' && link.reference) {
    const { relationTo, value } = link.reference

    if (typeof value === 'object' && value !== null) {
      if (relationTo === 'pages') {
        const page = value as Page
        if (!page.slug) return null
        return { href: getPagePath(page), openInNewTab }
      }
    }
  }

  return null
}
