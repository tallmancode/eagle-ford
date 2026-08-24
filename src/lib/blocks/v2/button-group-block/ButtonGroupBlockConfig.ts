import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const ButtonGroupV2Block: Block = {
  slug: 'buttonGroupV2',
  labels: {
    singular: 'Button Group (v2)',
    plural: 'Button Groups (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/button-group-v2-block-icon.svg',
        alt: 'Button Group (v2) icon',
      },
      thumbnail: {
        url: '/blocks/button-group-v2-block-thumbnail.png',
        alt: 'Button Group (v2) - buttons side by side',
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
              label: 'Buttons',
              admin: {
                initCollapsed: true,
                description: 'Add two or more Button blocks. They sit in a row and wrap on small screens.',
              },
              minRows: 1,
              blocks: [],
              blockReferences: ['buttonV2'],
            },
          ],
        },
        {
          label: 'Layout',
          fields: [
            StyleFields({
              name: 'styles',
              label: false,
              include: ['padding', 'margin', 'gap', 'display', 'visibility'],
            }),
          ],
        },
      ],
    },
  ],
}
