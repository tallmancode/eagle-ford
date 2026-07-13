import type { CollectionConfig } from 'payload'

import { isAnyone, isAuthenticated } from '@/lib/utils/accessUtil'
import {
  revalidateVehicleTemplate,
  revalidateVehicleTemplateDelete,
} from './hooks/revalidateVehicleTemplate'

export const VehicleTemplatesCollection: CollectionConfig<'vehicle-templates'> = {
  slug: 'vehicle-templates',
  labels: {
    singular: 'Vehicle Template',
    plural: 'Vehicle Templates',
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
        description: 'e.g. "Standard Vehicle Layout" or "Commercial Vehicle Layout"',
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
    afterChange: [revalidateVehicleTemplate],
    afterDelete: [revalidateVehicleTemplateDelete],
  },
}
