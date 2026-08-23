import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const VehicleHeroV2Block: Block = {
  slug: 'vehicleHeroV2',
  labels: {
    singular: 'Vehicle Hero (v2)',
    plural: 'Vehicle Heroes (v2)',
  },
  admin: {
    group: 'Vehicle',
    images: {
      icon: {
        url: '/blocks/vehicle-hero-v2-block-icon.svg',
        alt: 'Vehicle Hero (v2) icon',
      },
      thumbnail: {
        url: '/blocks/vehicle-hero-v2-block-thumbnail.png',
        alt: 'Vehicle Hero (v2) - full-bleed vehicle hero with price and CTAs',
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
            {
              name: 'showBadge',
              type: 'checkbox',
              label: 'Show Badge',
              defaultValue: true,
            },
            {
              name: 'showBrochure',
              type: 'checkbox',
              label: 'Show Brochure',
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
