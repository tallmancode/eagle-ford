import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const VehicleColorsV2Block: Block = {
  slug: 'vehicleColorsV2',
  labels: {
    singular: 'Vehicle Colors (v2)',
    plural: 'Vehicle Colors (v2)',
  },
  admin: {
    group: 'Vehicle',
    images: {
      icon: {
        url: '/blocks/vehicle-colors-v2-block-icon.svg',
        alt: 'Vehicle Colors (v2) icon',
      },
      thumbnail: {
        url: '/blocks/vehicle-colors-v2-block-thumbnail.png',
        alt: 'Vehicle Colors (v2) - colour swatch picker',
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
                description: 'Optional heading. Leave empty to use "{Vehicle} Colours".',
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
