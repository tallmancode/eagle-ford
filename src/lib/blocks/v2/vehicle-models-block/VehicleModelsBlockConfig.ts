import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const VehicleModelsV2Block: Block = {
  slug: 'vehicleModelsV2',
  labels: {
    singular: 'Vehicle Models (v2)',
    plural: 'Vehicle Models (v2)',
  },
  admin: {
    group: 'Vehicle',
    images: {
      icon: {
        url: '/blocks/vehicle-models-v2-block-icon.svg',
        alt: 'Vehicle Models (v2) icon',
      },
      thumbnail: {
        url: '/blocks/vehicle-models-v2-block-thumbnail.png',
        alt: 'Vehicle Models (v2) - model list with pricing',
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
                description: 'Optional heading above the models list. Leave empty to use the vehicle name.',
              },
            },
            {
              name: 'layout',
              type: 'select',
              label: 'Layout',
              defaultValue: 'accordion',
              options: [
                { label: 'Grid', value: 'grid' },
                { label: 'Accordion', value: 'accordion' },
              ],
              admin: {
                description: 'Stored for future use. The UI currently supports both layouts.',
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
