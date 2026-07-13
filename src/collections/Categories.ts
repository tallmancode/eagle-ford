import type { CollectionConfig } from 'payload'

import { isAnyone, isAuthenticated } from '@/lib/utils/accessUtil'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAnyone,
    update: isAuthenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}
