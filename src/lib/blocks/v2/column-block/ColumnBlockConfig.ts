import type { Block } from 'payload'
import { blockRefs } from '@/lib/blocks/section-block/blockRefs'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'
import { v2ContentRefs } from '@/lib/blocks/v2/v2-content-refs'

export const ColumnV2Block: Block = {
  slug: 'columnV2',
  labels: {
    singular: 'Column (v2)',
    plural: 'Columns (v2)',
  },
  admin: {
    group: 'Block Wrappers',
    images: {
      icon: {
        url: '/blocks/column-v2-block-icon.svg',
        alt: 'Column (v2) icon',
      },
      thumbnail: {
        url: '/blocks/column-v2-block-thumbnail.png',
        alt: 'Column (v2) - side-by-side column layout',
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
              blockReferences: [...blockRefs(), ...v2ContentRefs],
            },
          ],
        },
        {
          label: 'Layout',
          fields: [StyleFields({ name: 'styles', label: false })],
        },
      ],
    },
  ],
}
