import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const ReviewsV2Block: Block = {
  slug: 'reviewsV2',
  labels: {
    singular: 'Reviews (v2)',
    plural: 'Reviews (v2)',
  },
  admin: {
    group: 'Cards',
    images: {
      icon: {
        url: '/blocks/reviews-v2-block-icon.svg',
        alt: 'Reviews (v2) icon',
      },
      thumbnail: {
        url: '/blocks/reviews-v2-block-thumbnail.png',
        alt: 'Reviews (v2) - Google reviews carousel',
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
              name: 'source',
              type: 'select',
              label: 'Review Source',
              defaultValue: 'sample',
              options: [
                { label: 'Sample Google reviews', value: 'sample' },
              ],
              admin: {
                description:
                  'Sample data ships with the site. A CMS reviews collection can be wired later.',
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
