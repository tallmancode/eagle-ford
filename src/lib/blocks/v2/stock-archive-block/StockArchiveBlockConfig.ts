import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const StockArchiveV2Block: Block = {
  slug: 'stockArchiveV2',
  labels: {
    singular: 'Stock Archive (v2)',
    plural: 'Stock Archives (v2)',
  },
  admin: {
    group: 'Archives',
    images: {
      icon: {
        url: '/blocks/stock-archive-v2-block-icon.svg',
        alt: 'Stock Archive (v2) icon',
      },
      thumbnail: {
        url: '/blocks/stock-archive-v2-block-thumbnail.png',
        alt: 'Stock Archive (v2) - live stock listing with filters',
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
              type: 'select',
              name: 'conditionFilter',
              label: 'Condition Filter',
              defaultValue: 'all',
              options: [
                { label: 'All', value: 'all' },
                { label: 'New', value: 'new' },
                { label: 'Pre-owned', value: 'pre-owned' },
              ],
            },
            {
              type: 'number',
              name: 'limit',
              label: 'Vehicles per Page',
              defaultValue: 12,
              min: 1,
              max: 100,
            },
            {
              type: 'checkbox',
              name: 'showPagination',
              label: 'Show Pagination',
              defaultValue: true,
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
