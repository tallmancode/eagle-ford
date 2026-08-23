import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const VehicleModelHighlightsV2Block: Block = {
  slug: 'vehicleModelHighlightsV2',
  labels: {
    singular: 'Vehicle Model Highlights (v2)',
    plural: 'Vehicle Model Highlights (v2)',
  },
  admin: {
    group: 'Vehicle Model',
    images: {
      icon: {
        url: '/blocks/vehicle-model-highlights-v2-block-icon.svg',
        alt: 'Vehicle Model Highlights (v2) icon',
      },
      thumbnail: {
        url: '/blocks/vehicle-model-highlights-v2-block-thumbnail.png',
        alt: 'Vehicle Model Highlights (v2) - trim overview highlights',
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
              name: 'heading',
              type: 'text',
              label: 'Heading',
              admin: {
                description: 'Optional heading. Leave empty to use "Overview".',
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
