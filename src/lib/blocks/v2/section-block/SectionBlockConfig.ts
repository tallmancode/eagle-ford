import type { Block } from 'payload'
import { blockRefs } from '@/lib/blocks/section-block/blockRefs'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'
import { v2ContentRefs } from '@/lib/blocks/v2/v2-content-refs'

export const SectionV2Block: Block = {
  slug: 'sectionV2',
  labels: {
    singular: 'Section (v2)',
    plural: 'Sections (v2)',
  },
  admin: {
    group: 'Block Wrappers',
    images: {
      icon: {
        url: '/blocks/section-v2-block-icon.svg',
        alt: 'Section (v2) icon',
      },
      thumbnail: {
        url: '/blocks/section-v2-block-thumbnail.png',
        alt: 'Section (v2) - full-width layout container',
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
              blockReferences: [...blockRefs(), 'wrapperV2', ...v2ContentRefs],
            },
          ],
        },
        {
          label: 'Layout',
          fields: [StyleFields({ name: 'styles', label: false, block: 'sectionBlock' })],
        },
      ],
    },
  ],
}
