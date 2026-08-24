import type { Block } from 'payload'
import { ColorField } from '@/lib/blocks/v2/fields/color'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const VehicleTabsV2Block: Block = {
  slug: 'vehicleTabsV2',
  labels: {
    singular: 'Vehicle Tabs (v2)',
    plural: 'Vehicle Tabs (v2)',
  },
  admin: {
    group: 'Tabbed Content',
    images: {
      icon: {
        url: '/blocks/vehicle-tabs-v2-block-icon.svg',
        alt: 'Vehicle Tabs (v2) icon',
      },
      thumbnail: {
        url: '/blocks/vehicle-tabs-v2-block-thumbnail.png',
        alt: 'Vehicle Tabs (v2) - category tabs with vehicle cards',
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
            ColorField({
              name: 'cardBackgroundColor',
              label: 'Card Background',
              description:
                'Background colour for each vehicle card. Leave empty to use the default card colour.',
            }),
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
