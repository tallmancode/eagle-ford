import { DEFAULT_OG_DESCRIPTION } from '@/constants/site'
import { extractPageContent } from '@/lib/ai-seo/extractPageContent'

type PageLike = {
  title?: unknown
  excerpt?: unknown
  section?: unknown
}

export function fallbackSeoTitle(doc: PageLike | null | undefined): string {
  return typeof doc?.title === 'string' && doc.title.trim() ? doc.title.trim() : ''
}

export function fallbackSeoDescription(doc: PageLike | null | undefined): string {
  const excerpt = typeof doc?.excerpt === 'string' ? doc.excerpt.trim() : ''
  if (excerpt) return excerpt.slice(0, 150)

  const extracted = extractPageContent(doc, 400).text
  const withoutMeta = extracted
    .replace(/^Page title:.*$/m, '')
    .replace(/^Slug:.*$/m, '')
    .replace(/^\[[^\]]+\]$/gm, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (withoutMeta.length >= 80) {
    return withoutMeta.length > 150 ? `${withoutMeta.slice(0, 147).trim()}…` : withoutMeta
  }

  return DEFAULT_OG_DESCRIPTION
}
