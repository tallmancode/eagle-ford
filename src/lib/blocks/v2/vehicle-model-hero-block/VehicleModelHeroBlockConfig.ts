import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const VehicleModelHeroV2Block: Block = {
  slug: 'vehicleModelHeroV2',
  labels: {
    singular: 'Vehicle Model Hero (v2)',
    plural: 'Vehicle Model Heroes (v2)',
  },
  admin: {
    group: 'Vehicle Model',
    images: {
      icon: {
        url: '/blocks/vehicle-model-hero-v2-block-icon.svg',
        alt: 'Vehicle Model Hero (v2) icon',
      },
      thumbnail: {
        url: '/blocks/vehicle-model-hero-v2-block-thumbnail.png',
        alt: 'Vehicle Model Hero (v2) - trim hero with starting price',
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
              name: 'showPrice',
              type: 'checkbox',
              label: 'Show Price',
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
