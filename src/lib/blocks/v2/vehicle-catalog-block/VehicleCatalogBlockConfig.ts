import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const VehicleCatalogV2Block: Block = {
  slug: 'vehicleCatalogV2',
  labels: {
    singular: 'Vehicle Catalog (v2)',
    plural: 'Vehicle Catalogs (v2)',
  },
  admin: {
    group: 'Tabbed Content',
    images: {
      icon: {
        url: '/blocks/vehicle-catalog-v2-block-icon.svg',
        alt: 'Vehicle Catalog (v2) icon',
      },
      thumbnail: {
        url: '/blocks/vehicle-catalog-v2-block-thumbnail.png',
        alt: 'Vehicle Catalog (v2) - tabbed vehicle range listing',
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
                description: 'Optional heading displayed above the tabs (e.g. "All Vehicles")',
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
