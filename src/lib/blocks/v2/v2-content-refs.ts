import type { BlockSlug } from 'payload'
import { elementV2ContentRefs } from '@/lib/blocks/v2/element-block-refs'
import { typographyV2ContentRefs } from '@/lib/blocks/v2/typography-block-refs'
import { allVehicleV2ContentRefs } from '@/lib/blocks/v2/vehicle-block-refs'

/** Typography + element + vehicle blocks for Section/Wrapper/Column (v2) nesting. */
export const v2ContentRefs: BlockSlug[] = [
  ...typographyV2ContentRefs,
  ...elementV2ContentRefs,
  ...allVehicleV2ContentRefs,
]
