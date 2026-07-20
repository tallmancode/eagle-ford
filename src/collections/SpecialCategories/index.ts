import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { isAnyone, isAuthenticated } from '@/lib/utils/accessUtil'
import {
  revalidateSpecialCategory,
  revalidateSpecialCategoryDelete,
} from './hooks/revalidateSpecialCategory'

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
    defaultColumns: ['title', 'slug', 'sortOrder', 'updatedAt'],
    group: 'Content',
  },
  defaultSort: 'sortOrder',
  hooks: {
    afterChange: [revalidateSpecialCategory],
    afterDelete: [revalidateSpecialCategoryDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'featureImage',
      label: 'Feature Image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Image shown on specials archive category cards.',
      },
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
    {
      name: 'template',
      label: 'Page Template',
      type: 'relationship',
      relationTo: 'special-templates',
      admin: {
        position: 'sidebar',
        description:
          'Optional. Default layout for specials in this category. Individual specials can override this.',
      },
    },
    {
      name: 'enquiryForm',
      label: 'Enquiry Form',
      type: 'relationship',
      relationTo: 'forms',
      admin: {
        position: 'sidebar',
        description:
          'Optional. Default enquire form for specials in this category. Individual specials can override this.',
      },
    },
    slugField(),
  ],
}
