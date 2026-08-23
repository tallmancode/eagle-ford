import type { CollectionConfig } from 'payload'

import { isAuthenticated, isAuthenticatedOrPublished } from '@/lib/utils/accessUtil'
import { generateSpecialTemplatePreviewPath } from '@/lib/utils/generateSpecialTemplatePreviewPath'
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
    read: isAuthenticatedOrPublished,
    update: isAuthenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'updatedAt'],
    group: 'Content',
    livePreview: {
      url: ({ data, req }) => generateSpecialTemplatePreviewPath({ data, req }),
    },
    preview: (data, { req }) => generateSpecialTemplatePreviewPath({ data, req }),
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
      name: 'previewCategory',
      label: 'Preview category',
      type: 'relationship',
      relationTo: 'special-categories',
      admin: {
        position: 'sidebar',
        description:
          'Category shown in Better Editor / live preview. Leave empty to use the first category (by sort order).',
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
    afterChange: [revalidateSpecialTemplate],
    afterDelete: [revalidateSpecialTemplateDelete],
  },
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
