import { Block, BlockSlug } from 'payload'

const allBlockRefs: BlockSlug[] = ['heading', 'hero', 'rich-text']

/** Nested block slugs for section content. Pass `exclude` to prevent circular blockReferences (stack overflow in admin). */
export const blockRefs = (exclude: BlockSlug[] = []): (Block | BlockSlug)[] => {
  if (exclude.length === 0) return allBlockRefs
  const excluded = new Set(exclude)
  return allBlockRefs.filter((slug) => !excluded.has(slug))
}
