import type { Block } from 'payload'

export const VehicleTabsBlock: Block = {
  slug: 'vehicle-tabs',
  interfaceName: 'VehicleTabsBlock',
  labels: {
    singular: 'Vehicle Tabs',
    plural: 'Vehicle Tabs',
  },
  admin: {
    group: 'Tabbed Content',
    components: {
      Label: '/lib/blocks/vehicle-tabs-block/components/VehicleTabsBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/vehicle-tabs-block.jpg',
        alt: 'Vehicle Tabs block - category tabs with vehicle cards',
      },
    },
  },
  fields: [],
}
