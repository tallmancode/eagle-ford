import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const VehicleModelColorsV2Block: Block = {
  slug: 'vehicleModelColorsV2',
  labels: {
    singular: 'Vehicle Model Colors (v2)',
    plural: 'Vehicle Model Colors (v2)',
  },
  admin: {
    group: 'Vehicle Model',
    images: {
      icon: {
        url: '/blocks/vehicle-model-colors-v2-block-icon.svg',
        alt: 'Vehicle Model Colors (v2) icon',
      },
      thumbnail: {
        url: '/blocks/vehicle-model-colors-v2-block-thumbnail.png',
        alt: 'Vehicle Model Colors (v2) - trim colour swatch picker',
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
                description: 'Optional heading. Leave empty to use "{Model} Colours".',
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
