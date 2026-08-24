import type { Block } from 'payload'
import { blockRefs } from '@/lib/blocks/section-block/blockRefs'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'
import { v2ContentRefs } from '@/lib/blocks/v2/v2-content-refs'

export const WrapperV2Block: Block = {
  slug: 'wrapperV2',
  labels: {
    singular: 'Wrapper (v2)',
    plural: 'Wrappers (v2)',
  },
  admin: {
    group: 'Block Wrappers',
    images: {
      icon: {
        url: '/blocks/wrapper-v2-block-icon.svg',
        alt: 'Wrapper (v2) icon',
      },
      thumbnail: {
        url: '/blocks/wrapper-v2-block-thumbnail.png',
        alt: 'Wrapper (v2) - nested layout container',
      },
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              type: 'blocks',
              name: 'content',
              label: false,
              admin: {
                initCollapsed: true,
              },
              blocks: [],
              blockReferences: [...blockRefs(), 'columnV2', ...v2ContentRefs],
            },
          ],
        },
        {
          label: 'Layout',
          fields: [
            StyleFields({
              name: 'styles',
              label: false,
              block: 'wrapperBlock',
              include: [
                'padding',
                'margin',
                'inset',
                'gap',
                'display',
                'position',
                'container',
                'backgroundColor',
                'overflow',
                'visibility',
              ],
            }),
          ],
        },
      ],
    },
  ],
}
