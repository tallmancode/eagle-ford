import type { Page } from '@/payload-types'

export function getPagePath(page: Pick<Page, 'breadcrumbs'> & { slug?: string | null }): string {
  if (!page.slug || page.slug === 'home') return '/'

  const breadcrumbs = page.breadcrumbs
  const last = breadcrumbs?.[breadcrumbs.length - 1]

  if (last?.url) {
    return last.url === '/home' ? '/' : last.url
  }

  return `/${page.slug}`
}
