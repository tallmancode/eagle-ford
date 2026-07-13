import type { CollectionConfig } from 'payload'

import { isAnyone, isAuthenticated } from '@/lib/utils/accessUtil'
import {
  revalidateVehicleModelTemplate,
  revalidateVehicleModelTemplateDelete,
} from './hooks/revalidateVehicleModelTemplate'

export const VehicleModelTemplatesCollection: CollectionConfig<'vehicle-model-templates'> = {
  slug: 'vehicle-model-templates',
  labels: {
    singular: 'Vehicle Model Template',
    plural: 'Vehicle Model Templates',
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAnyone,
    update: isAuthenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
    group: 'Vehicles',
  },
  fields: [
    {
      name: 'title',
      label: 'Template Title',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "Standard Model Layout" or "Commercial Model Layout"',
      },
    },
    {
      name: 'section',
      label: false,
      type: 'blocks',
      blocks: [],
      blockReferences: ['section'],
    },
  ],
  hooks: {
    afterChange: [revalidateVehicleModelTemplate],
    afterDelete: [revalidateVehicleModelTemplateDelete],
  },
}
