/**
 * Extracts plain text from document content for use as AI prompt context.
 * Handles Pages, Blog, Projects collections with nested block structures.
 * Truncates to ~2000 chars for token limits.
 */

const MAX_CONTENT_LENGTH = 2000

/** Extract text from Lexical editor JSON (root.children structure) */
function extractLexicalText(node: Record<string, unknown>): string {
  const parts: string[] = []

  function traverse(n: Record<string, unknown>): void {
    if (typeof n.text === 'string') {
      parts.push(n.text)
    }
    const children = n.children
    if (Array.isArray(children)) {
      for (const child of children) {
        if (child && typeof child === 'object') {
          traverse(child as Record<string, unknown>)
        }
      }
    }
  }

  traverse(node)
  return parts.join(' ')
}

/** Extract text from a single block based on blockType */
function extractBlockText(block: Record<string, unknown>): string {
  const blockType = block.blockType as string | undefined
  if (!blockType) return ''

  switch (blockType) {
    case 'hero': {
      const dict = block.dictionaryHeroContent as Record<string, unknown> | undefined
      const search = block.searchHeroContent as Record<string, unknown> | undefined
      const parts: string[] = []
      if (dict) {
        if (typeof dict.mainHeading === 'string') parts.push(dict.mainHeading)
        if (typeof dict.subHeading === 'string') parts.push(dict.subHeading)
        if (typeof dict.exampleText === 'string') parts.push(dict.exampleText)
        const defs = dict.definitions
        if (Array.isArray(defs)) {
          for (const d of defs) {
            if (
              d &&
              typeof d === 'object' &&
              typeof (d as Record<string, unknown>).text === 'string'
            ) {
              parts.push((d as Record<string, unknown>).text as string)
            }
          }
        }
      }
      if (search) {
        if (typeof search.mainHeading === 'string') parts.push(search.mainHeading)
        if (typeof search.subtitle === 'string') parts.push(search.subtitle)
        if (typeof search.description === 'string') parts.push(search.description)
      }
      return parts.join(' ')
    }
    case 'showcase': {
      const parts: string[] = []
      if (typeof block.mainHeading === 'string') parts.push(block.mainHeading)
      if (typeof block.subHeading === 'string') parts.push(block.subHeading)
      return parts.join(' ')
    }
    case 'rich-text': {
      const content = block.content as Record<string, unknown> | undefined
      const root = content?.root as Record<string, unknown> | undefined
      return root ? extractLexicalText(root) : ''
    }
    case 'copy-block': {
      const parts: string[] = []
      if (typeof block.heading === 'string') parts.push(block.heading)
      const text = block.text as Record<string, unknown> | undefined
      const root = text?.root as Record<string, unknown> | undefined
      if (root) parts.push(extractLexicalText(root))
      return parts.join(' ')
    }
    case 'media':
      return typeof block.alt === 'string' ? block.alt : ''
    case 'row': {
      const content = block.content as Record<string, unknown>[] | undefined
      if (!Array.isArray(content)) return ''
      return content
        .map((c) => (c ? extractBlockText(c) : ''))
        .filter(Boolean)
        .join(' ')
    }
    case 'marqueeBlock': {
      const images = block.marqueeImages as Array<{ title?: string }> | undefined
      if (!Array.isArray(images)) return ''
      return images
        .map((i) => i?.title)
        .filter(Boolean)
        .join(' ')
    }
    case 'project-archive':
    case 'blog-archive':
      return ''
    default:
      return ''
  }
}

/** Extract text from content.section blocks (Section has nested content) */
function extractSectionBlocks(sections: unknown[]): string {
  const parts: string[] = []
  for (const section of sections) {
    if (!section || typeof section !== 'object') continue
    const s = section as Record<string, unknown>
    const content = s.content
    if (Array.isArray(content)) {
      for (const block of content) {
        if (block && typeof block === 'object') {
          const text = extractBlockText(block as Record<string, unknown>)
          if (text) parts.push(text)
        }
      }
    }
  }
  return parts.join('\n')
}

/** Configuration for content paths per collection */
const COLLECTION_CONTENT_PATHS: Record<string, string[]> = {
  pages: ['content', 'section'],
  blog: ['content', 'section'],
  projects: ['content', 'section'],
}

/**
 * Extract plain text from a document for use as AI prompt context.
 * Used by AI SEO generation to build a prompt from page content.
 *
 * @param doc - The document data (partial/unsaved is ok)
 * @param collectionSlug - Collection slug (pages, blog, projects)
 * @returns Concatenated plain text, truncated to MAX_CONTENT_LENGTH
 */
export function extractContentFromDoc(
  doc: Record<string, unknown>,
  collectionSlug: string,
): string {
  const parts: string[] = []

  // Title
  if (typeof doc.title === 'string' && doc.title.trim()) {
    parts.push(doc.title.trim())
  }

  // Excerpt (blog, projects)
  if (typeof doc.excerpt === 'string' && doc.excerpt.trim()) {
    parts.push(doc.excerpt.trim())
  }

  // Content blocks
  const contentPath = COLLECTION_CONTENT_PATHS[collectionSlug]
  if (contentPath) {
    let current: unknown = doc
    for (const key of contentPath) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key]
      } else {
        current = undefined
        break
      }
    }
    if (Array.isArray(current) && current.length > 0) {
      parts.push(extractSectionBlocks(current))
    }
  }

  const combined = parts.filter(Boolean).join('\n\n').trim()
  if (!combined) return ''
  if (combined.length <= MAX_CONTENT_LENGTH) return combined
  return combined.slice(0, MAX_CONTENT_LENGTH) + '...'
}
