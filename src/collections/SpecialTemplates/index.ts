import type { CollectionConfig } from 'payload'

import { isAnyone, isAuthenticated } from '@/lib/utils/accessUtil'
import {
  revalidateSpecialTemplate,
  revalidateSpecialTemplateDelete,
} from './hooks/revalidateSpecialTemplate'

export const SpecialTemplatesCollection: CollectionConfig<'special-templates'> = {
  slug: 'special-templates',
  labels: {
    singular: 'Special Template',
    plural: 'Special Templates',
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
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      label: 'Template Title',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "Standard Special Layout" or "Vehicle Offer Layout"',
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
    afterChange: [revalidateSpecialTemplate],
    afterDelete: [revalidateSpecialTemplateDelete],
  },
}
