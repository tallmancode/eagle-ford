import type { Block } from 'payload'

export const VehicleCatalogBlock: Block = {
  slug: 'vehicle-catalog',
  interfaceName: 'VehicleCatalogBlock',
  labels: {
    singular: 'Vehicle Catalog',
    plural: 'Vehicle Catalog',
  },
  admin: {
    group: 'Tabbed Content',
    components: {
      Label: '/lib/blocks/vehicle-catalog-block/components/VehicleCatalogBlockLabel',
    },
  },
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
}
