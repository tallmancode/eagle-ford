import type { BlockSlug } from 'payload'
import { elementV2ContentRefs } from '@/lib/blocks/v2/element-block-refs'
import { typographyV2ContentRefs } from '@/lib/blocks/v2/typography-block-refs'

/** Typography + element blocks for Section/Wrapper/Column (v2) nesting. */
export const v2ContentRefs: BlockSlug[] = [...typographyV2ContentRefs, ...elementV2ContentRefs]
