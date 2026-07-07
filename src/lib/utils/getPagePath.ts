export function getPagePath(page: { slug?: string | null }): string {
  if (!page.slug || page.slug === 'home') return '/'
  return `/${page.slug}`
}
