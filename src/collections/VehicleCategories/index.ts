import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { isAnyone, isAuthenticated } from '@/lib/utils/accessUtil'

export const VehicleCategories: CollectionConfig = {
  slug: 'vehicle-categories',
  labels: {
    singular: 'Vehicle Category',
    plural: 'Vehicle Categories',
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAnyone,
    update: isAuthenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'sortOrder'],
    group: 'Vehicles',
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
    slugField(),
  ],
}
