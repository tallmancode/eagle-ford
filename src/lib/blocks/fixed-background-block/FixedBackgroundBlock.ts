import type { Block } from 'payload'
import { blockRefs } from '@/lib/blocks/section-block/blockRefs'

export const FixedBackgroundBlock: Block = {
  slug: 'fixedBackgroundBlock',
  interfaceName: 'FixedBackgroundBlockType',
  labels: {
    singular: 'Fixed Background',
    plural: 'Fixed Backgrounds',
  },
  admin: {
    images: {
      thumbnail: {
        url: '/blocks/fixed-background-block.jpg',
        alt: 'Fixed Background block - full-bleed fixed image with nested content',
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
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              type: 'blocks',
              name: 'content',
              label: false,
              admin: {
                initCollapsed: true,
              },
              blocks: [],
              blockReferences: blockRefs(['fixedBackgroundBlock']),
            },
          ],
        },
        {
          label: 'Layout',
          fields: [
            {
              name: 'overlayOpacity',
              type: 'number',
              label: 'Overlay Opacity',
              defaultValue: 0,
              min: 0,
              max: 100,
              admin: {
                description:
                  'Dark overlay over the background image (0–100). Helps text readability on bright images.',
              },
            },
            {
              name: 'container',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
      ],
    },
  ],
}
