import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { isAnyone, isAuthenticated } from '@/lib/utils/accessUtil'

export const SpecialCategories: CollectionConfig = {
  slug: 'special-categories',
  labels: {
    singular: 'Special Category',
    plural: 'Special Categories',
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
    group: 'Content',
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
