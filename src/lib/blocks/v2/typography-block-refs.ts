import type { BlockSlug } from 'payload'

/** Atomic typography blocks that compose Heading (v2). */
export const typographyAtomicV2Refs: BlockSlug[] = [
  'eyebrowV2',
  'headingTextV2',
  'subheadingV2',
]

/** Atomic + composed typography — mount inside Section/Wrapper/Column (v2). */
export const typographyV2ContentRefs: BlockSlug[] = [
  'headingV2',
  ...typographyAtomicV2Refs,
  'richTextV2',
]
