import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const VehicleFeaturesV2Block: Block = {
  slug: 'vehicleFeaturesV2',
  labels: {
    singular: 'Vehicle Features (v2)',
    plural: 'Vehicle Features (v2)',
  },
  admin: {
    group: 'Vehicle',
    images: {
      icon: {
        url: '/blocks/vehicle-features-v2-block-icon.svg',
        alt: 'Vehicle Features (v2) icon',
      },
      thumbnail: {
        url: '/blocks/vehicle-features-v2-block-thumbnail.png',
        alt: 'Vehicle Features (v2) - alternating feature sections',
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
              name: 'maxFeatures',
              type: 'number',
              label: 'Max Features',
              min: 1,
              admin: {
                description: 'Optional limit on how many features to show. Leave empty to show all.',
              },
            },
            {
              name: 'showCallCta',
              type: 'checkbox',
              label: 'Show Call CTA',
              defaultValue: true,
              admin: {
                description: 'When enabled, shows a Call Now button using the sales phone from Settings.',
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
