import { Block, BlockSlug } from 'payload'

const allBlockRefs: BlockSlug[] = [
  'heading',
  'hero',
  'rich-text',
  'feature-list',
  'formBlock',
  'contact-info',
  'icon-text',
  'cta-button',
  'back-button',
  'why-cards',
  'map',
  'team-grid',
  'image-block',
  'cta-cards',
  'statsBlock',
  'hours-tabs',
  'faq',
  'contact-footer',
  'feature-grid',
  'benefits',
  'benefits-grid',
  'popup-cards',
  'financeCalculatorBlock',
  'specials-archive',
  'partners',
]

/** Nested block slugs for section content. Pass `exclude` to prevent circular blockReferences (stack overflow in admin). */
export const blockRefs = (exclude: BlockSlug[] = []): (Block | BlockSlug)[] => {
  if (exclude.length === 0) return allBlockRefs
  const excluded = new Set(exclude)
  return allBlockRefs.filter((slug) => !excluded.has(slug))
}
