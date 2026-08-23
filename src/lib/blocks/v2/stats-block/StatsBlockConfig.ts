import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const StatsV2Block: Block = {
  slug: 'statsV2',
  labels: {
    singular: 'Stats (v2)',
    plural: 'Stats (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/stats-v2-block-icon.svg',
        alt: 'Stats (v2) icon',
      },
      thumbnail: {
        url: '/blocks/stats-v2-block-thumbnail.png',
        alt: 'Stats (v2) - large numbers with labels',
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
              name: 'valueSize',
              type: 'select',
              label: 'Value Size',
              defaultValue: 'lg',
              options: [
                { label: 'Medium', value: 'md' },
                { label: 'Large', value: 'lg' },
                { label: 'XL', value: 'xl' },
              ],
            },
            {
              name: 'stats',
              type: 'array',
              label: 'Stats',
              minRows: 1,
              required: true,
              fields: [
                {
                  name: 'value',
                  type: 'text',
                  label: 'Value',
                  required: true,
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Label',
                  required: true,
                },
              ],
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
