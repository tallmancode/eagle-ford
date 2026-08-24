import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const VehicleSpecialCategoriesV2Block: Block = {
  slug: 'vehicleSpecialCategoriesV2',
  labels: {
    singular: 'Vehicle Special Categories (v2)',
    plural: 'Vehicle Special Categories (v2)',
  },
  admin: {
    group: 'Vehicle',
    images: {
      icon: {
        url: '/blocks/vehicle-special-categories-v2-block-icon.svg',
        alt: 'Vehicle Special Categories (v2) icon',
      },
      thumbnail: {
        url: '/blocks/vehicle-special-categories-v2-block-thumbnail.png',
        alt: 'Vehicle Special Categories (v2) - specials archive for this vehicle',
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
                description: 'Optional heading displayed above the specials list.',
              },
            },
            {
              name: 'emptyStateCopy',
              type: 'text',
              label: 'Empty State Copy',
              admin: {
                description: 'Shown when this vehicle has no matching special categories.',
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
