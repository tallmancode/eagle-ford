import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { isAuthenticated, isAuthenticatedOrPublished } from '@/lib/utils/accessUtil'
import {
  revalidateVehicleModel,
  revalidateVehicleModelDelete,
} from './hooks/revalidateVehicleModel'

export const VehicleModelsCollection: CollectionConfig<'vehicle-models'> = {
  slug: 'vehicle-models',
  labels: {
    singular: 'Vehicle Model',
    plural: 'Vehicle Models',
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAuthenticatedOrPublished,
    update: isAuthenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'vehicle', 'price', 'updatedAt'],
    group: 'Vehicles',
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Model Details',
          fields: [
            {
              name: 'name',
              label: 'Model Name',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g. "2.0 SiT Double Cab XL 4x2 6MT"',
              },
            },
            {
              name: 'vehicle',
              label: 'Vehicle Family',
              type: 'relationship',
              relationTo: 'vehicles',
              required: true,
              admin: {
                description: 'The parent vehicle this model belongs to.',
              },
            },
            {
              name: 'price',
              label: 'Retail Price (ZAR)',
              type: 'number',
              required: true,
              min: 0,
              admin: {
                description: 'Specific price for this model variant, e.g. 621000 for R 621,000.',
              },
            },
            {
              name: 'highlights',
              label: 'Highlights',
              type: 'array',
              admin: {
                description: 'Key feature bullet points shown on the model overview page.',
              },
              fields: [
                {
                  name: 'highlight',
                  label: 'Highlight',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'colours',
              label: 'Available Colours',
              type: 'array',
              admin: {
                description:
                  'Colour options for this specific model. Leave empty to inherit from the parent vehicle.',
              },
              fields: [
                {
                  name: 'colourName',
                  label: 'Colour Name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'colourNote',
                  label: 'Availability Note',
                  type: 'text',
                  admin: {
                    description: 'e.g. "Platinum Only"',
                  },
                },
                {
                  name: 'colourSwatch',
                  label: 'Colour Swatch Image',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },
        {
          label: 'Content',
          name: 'content',
          fields: [
            {
              name: 'description',
              label: 'Description',
              type: 'richText',
              admin: {
                description: 'Model-specific marketing copy shown on the variant detail page.',
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
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              label: 'Meta Title',
              type: 'text',
            },
            {
              name: 'metaDescription',
              label: 'Meta Description',
              type: 'textarea',
            },
            {
              name: 'metaImage',
              label: 'Meta Image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
    {
      name: 'sortOrder',
      label: 'Sort Order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first within a vehicle family.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
    slugField({ fieldToUse: 'name' }),
  ],
  hooks: {
    afterChange: [revalidateVehicleModel],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateVehicleModelDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
