import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const VehicleModelSiblingsV2Block: Block = {
  slug: 'vehicleModelSiblingsV2',
  labels: {
    singular: 'Vehicle Model Siblings (v2)',
    plural: 'Vehicle Model Siblings (v2)',
  },
  admin: {
    group: 'Vehicle Model',
    images: {
      icon: {
        url: '/blocks/vehicle-model-siblings-v2-block-icon.svg',
        alt: 'Vehicle Model Siblings (v2) icon',
      },
      thumbnail: {
        url: '/blocks/vehicle-model-siblings-v2-block-thumbnail.png',
        alt: 'Vehicle Model Siblings (v2) - related trim cards',
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
                description: 'Optional heading. Leave empty to use "{Vehicle} Trims".',
              },
            },
            {
              name: 'pageSize',
              type: 'number',
              label: 'Page Size',
              defaultValue: 3,
              min: 1,
              admin: {
                description: 'Number of sibling models shown per page.',
              },
            },
            {
              name: 'includeCurrent',
              type: 'checkbox',
              label: 'Include Current Model',
              defaultValue: false,
              admin: {
                description: 'When enabled, the current model appears in the siblings list.',
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
