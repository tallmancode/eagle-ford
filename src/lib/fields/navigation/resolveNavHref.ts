import type { NavLinks } from '@/payload-types'
import { getPagePath } from '@/lib/utils/getPagePath'

type NavLink = NonNullable<NavLinks>[number]
type NavLinkChild = NonNullable<NonNullable<NavLink['children']>[number]>
type NavLinkReference = NavLink['reference']

export const resolveNavHref = ({
  linkType,
  reference,
  url,
}: {
  linkType?: 'reference' | 'custom' | null
  reference?: NavLinkReference
  url?: string | null
}) => {
  if (linkType === 'custom' && url) return url

  if (linkType === 'reference' && typeof reference?.value === 'object' && reference.value.slug) {
    if (reference.relationTo === 'pages') {
      return getPagePath(reference.value)
    }

    if (reference.relationTo === 'blog') {
      return `/blog/${reference.value.slug}`
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
  const isCustom =
    item.type === 'custom' || (item.type === 'dropdown' && item.parentLinkType === 'custom')

  if (!isCustom) return '_self'

  if ('target' in item && item.target) return item.target

  return '_blank'
}
