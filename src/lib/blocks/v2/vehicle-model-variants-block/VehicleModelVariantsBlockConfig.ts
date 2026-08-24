import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const VehicleModelVariantsV2Block: Block = {
  slug: 'vehicleModelVariantsV2',
  labels: {
    singular: 'Vehicle Model Variants (v2)',
    plural: 'Vehicle Model Variants (v2)',
  },
  admin: {
    group: 'Vehicle Model',
    images: {
      icon: {
        url: '/blocks/vehicle-model-variants-v2-block-icon.svg',
        alt: 'Vehicle Model Variants (v2) icon',
      },
      thumbnail: {
        url: '/blocks/vehicle-model-variants-v2-block-thumbnail.png',
        alt: 'Vehicle Model Variants (v2) - configuration accordion',
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
              name: 'defaultExpanded',
              type: 'checkbox',
              label: 'Default Expanded',
              defaultValue: true,
              admin: {
                description: 'When enabled, the first variant accordion item starts open.',
              },
            },
            {
              name: 'showPrices',
              type: 'checkbox',
              label: 'Show Prices',
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
