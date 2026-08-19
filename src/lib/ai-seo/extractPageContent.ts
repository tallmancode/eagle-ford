import { extractPlainTextFromRichText } from '@/lib/blocks/form-block/utils/extractPlainTextFromRichText'

export const MAX_PAGE_CONTENT_CHARS = 12_000

const SKIP_KEYS = new Set([
  'id',
  '_id',
  'blockName',
  'backgroundColor',
  'background',
  'sectionBackgroundStyle',
  'gridCols',
  'container',
  'showDivider',
  'overlayHeader',
  'url',
  'filename',
  'mimeType',
  'width',
  'height',
  'filesize',
  'sizes',
  'focalX',
  'focalY',
  'prefix',
  'thumbnailURL',
  'createdAt',
  'updatedAt',
  '_status',
  'generateSlug',
  'publishedAt',
  'layout',
  'spacing',
  'visibility',
  'padding',
  'margin',
  'betterEditorId',
  'color',
  'textColor',
  'accentColor',
  'headingAccent',
  'meta',
  'image',
  'mobileImage',
  'icon',
  'logo',
  'media',
])

type PageLike = {
  title?: unknown
  slug?: unknown
  section?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isLexical(value: unknown): value is { root: { children?: unknown[] } } {
  return isRecord(value) && isRecord(value.root) && Array.isArray(value.root.children)
}

function isHexColor(value: string): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value.trim())
}

function isMostlyNoise(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return true
  if (isHexColor(trimmed)) return true
  if (/^https?:\/\//i.test(trimmed)) return true
  if (/^[0-9a-f]{24}$/i.test(trimmed)) return true
  return false
}

function walk(value: unknown, lines: string[], depth = 0): void {
  if (value == null || depth > 12) return

  if (typeof value === 'string') {
    if (!isMostlyNoise(value)) lines.push(value.trim())
    return
  }

  if (typeof value === 'number' || typeof value === 'boolean') return

  if (Array.isArray(value)) {
    for (const item of value) walk(item, lines, depth + 1)
    return
  }

  if (!isRecord(value)) return

  if (isLexical(value)) {
    const text = extractPlainTextFromRichText(
      value as { root: { children?: { text?: string }[] } },
      Number.MAX_SAFE_INTEGER,
    )
    if (text) lines.push(text)
    return
  }

  const blockType = typeof value.blockType === 'string' ? value.blockType : null
  if (blockType) {
    lines.push(`[${blockType}]`)
  }

  for (const [key, nested] of Object.entries(value)) {
    if (key === 'blockType' || SKIP_KEYS.has(key)) continue
    walk(nested, lines, depth + 1)
  }
}

export type ExtractedPageContent = {
  text: string
  truncated: boolean
}

/**
 * Flatten Better Editor / section-block page data into a compact text brief for SEO generation.
 */
export function extractPageContent(
  doc: PageLike | null | undefined,
  maxChars = MAX_PAGE_CONTENT_CHARS,
): ExtractedPageContent {
  const lines: string[] = []

  const title = typeof doc?.title === 'string' ? doc.title.trim() : ''
  const slug = typeof doc?.slug === 'string' ? doc.slug.trim() : ''

  if (title) lines.push(`Page title: ${title}`)
  if (slug) lines.push(`Slug: ${slug}`)

  walk(doc?.section, lines)

  const joined = lines
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')

  if (joined.length <= maxChars) {
    return { text: joined, truncated: false }
  }

  return {
    text: `${joined.slice(0, maxChars).trim()}\n\n[Content truncated for length]`,
    truncated: true,
  }
}
