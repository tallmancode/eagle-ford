import type { Block } from 'payload'

export const VehicleFaqBlock: Block = {
  slug: 'vehicle-faq',
  interfaceName: 'VehicleFaqBlock',
  labels: {
    singular: 'Vehicle FAQ',
    plural: 'Vehicle FAQs',
  },
  admin: {
    group: 'Vehicle',
  },
  fields: [],
}
