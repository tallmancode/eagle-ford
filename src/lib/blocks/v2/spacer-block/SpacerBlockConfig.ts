import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const SpacerV2Block: Block = {
  slug: 'spacerV2',
  labels: {
    singular: 'Spacer (v2)',
    plural: 'Spacers (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/spacer-v2-block-icon.svg',
        alt: 'Spacer (v2) icon',
      },
      thumbnail: {
        url: '/blocks/spacer-v2-block-thumbnail.png',
        alt: 'Spacer (v2) - empty vertical space',
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
              name: 'height',
              type: 'select',
              label: 'Height',
              defaultValue: 'md',
              options: [
                { label: 'XS (0.5rem)', value: 'xs' },
                { label: 'Small (1rem)', value: 'sm' },
                { label: 'Medium (2rem)', value: 'md' },
                { label: 'Large (3rem)', value: 'lg' },
                { label: 'XL (4rem)', value: 'xl' },
                { label: '2XL (6rem)', value: '2xl' },
              ],
              admin: {
                description:
                  'Quick vertical space. Use the Layout tab for finer padding/margin control. This is empty space — not a visible divider.',
              },
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
