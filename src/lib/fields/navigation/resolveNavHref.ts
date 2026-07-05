import type { Media, NavLinks } from '@/payload-types'
import { getPagePath } from '@/lib/utils/getPagePath'
import { getMediaUrl } from '@/lib/utils/getMediaUrl'

type NavLink = NonNullable<NavLinks>[number]
type NavLinkChild = NonNullable<NonNullable<NavLink['children']>[number]>
type NavLinkReference = NavLink['reference']

export const resolveNavHref = ({
  linkType,
  reference,
  url,
  document,
}: {
  linkType?: 'reference' | 'custom' | 'upload' | null
  reference?: NavLinkReference
  url?: string | null
  document?: string | Media | null
}) => {
  if (linkType === 'custom' && url) return url

  if (linkType === 'upload') {
    if (typeof document === 'object' && document?.url) {
      return getMediaUrl(document.url)
    }
    return '#'
  }

  if (linkType === 'reference' && typeof reference?.value === 'object' && reference.value.slug) {
    if (reference.relationTo === 'pages') {
      return getPagePath(reference.value)
    }

    if (reference.relationTo === 'blogs') {
      return `/blogs/${reference.value.slug}`
    }
  }

  if (url) return url

  return '/'
}

export const generateNavHref = (item: NavLink | NavLinkChild) => {
  if (item.type === 'dropdown') return '/'

  return resolveNavHref({
    linkType: item.type,
    reference: 'reference' in item ? item.reference : undefined,
    url: item.url,
    document: 'document' in item ? item.document : undefined,
  })
}

export const getDropdownParentHref = (item: NavLink) => {
  if (item.type !== 'dropdown' || !item.parentLinkType || item.parentLinkType === 'none') {
    return null
  }

  return resolveNavHref({
    linkType: item.parentLinkType,
    reference: item.reference,
    url: item.url,
  })
}

export const getNavLinkTarget = (item: NavLink | NavLinkChild) => {
  if (item.type === 'upload') return '_blank'

  const isCustom =
    item.type === 'custom' || (item.type === 'dropdown' && item.parentLinkType === 'custom')

  if (!isCustom) return '_self'

  if ('target' in item && item.target) return item.target

  return '_blank'
}
