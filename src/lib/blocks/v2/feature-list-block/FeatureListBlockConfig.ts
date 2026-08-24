import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const FeatureListV2Block: Block = {
  slug: 'featureListV2',
  labels: {
    singular: 'Feature List (v2)',
    plural: 'Feature Lists (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/feature-list-v2-block-icon.svg',
        alt: 'Feature List (v2) icon',
      },
      thumbnail: {
        url: '/blocks/feature-list-v2-block-thumbnail.png',
        alt: 'Feature List (v2) - checklist of titles and descriptions',
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
              name: 'showCheckIcon',
              type: 'checkbox',
              label: 'Show check icons',
              defaultValue: true,
            },
            {
              name: 'features',
              type: 'array',
              label: 'Features',
              minRows: 1,
              required: true,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
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
