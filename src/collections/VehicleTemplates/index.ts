import type { CollectionConfig } from 'payload'

import { isAnyone, isAuthenticatedNotCallCenter } from '@/lib/utils/accessUtil'
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
    create: isAuthenticatedNotCallCenter,
    delete: isAuthenticatedNotCallCenter,
    read: isAnyone,
    update: isAuthenticatedNotCallCenter,
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
      blockReferences: ['section', 'sectionV2'],
    },
  ],
  hooks: {
    afterChange: [revalidateVehicleTemplate],
    afterDelete: [revalidateVehicleTemplateDelete],
  },
}
