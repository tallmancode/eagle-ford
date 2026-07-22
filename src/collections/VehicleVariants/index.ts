import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { populatePublishedAt } from '@/lib/hooks/populatePublishedAt'
import { validateScopedSlugUniqueness } from '@/lib/hooks/validateScopedSlugUniqueness'
import { isAuthenticated, isAuthenticatedOrPublished } from '@/lib/utils/accessUtil'
import {
  revalidateVehicleVariant,
  revalidateVehicleVariantDelete,
} from './hooks/revalidateVehicleVariant'

export const VehicleVariantsCollection: CollectionConfig<'vehicle-variants'> = {
  slug: 'vehicle-variants',
  indexes: [{ unique: true, fields: ['model', 'slug'] }],
  labels: {
    singular: 'Vehicle Variant',
    plural: 'Vehicle Variants',
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAuthenticatedOrPublished,
    update: isAuthenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'model', 'price', 'updatedAt'],
    group: 'Vehicles',
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Variant Details',
          fields: [
            {
              name: 'name',
              label: 'Variant Name',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g. "2.0 SiT Double Cab XL 4x2 6MT"',
              },
            },
            {
              name: 'model',
              label: 'Model / Trim',
              type: 'relationship',
              relationTo: 'vehicle-models',
              required: true,
              admin: {
                description: 'Parent trim/series this configuration belongs to.',
              },
            },
            {
              name: 'price',
              label: 'Retail Price (ZAR)',
              type: 'number',
              required: true,
              min: 0,
              admin: {
                description: 'Specific price for this configuration, e.g. 621000 for R 621,000.',
              },
            },
            {
              name: 'heroImage',
              label: 'Hero Image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Optional hero for this variant. Falls back to the parent model or vehicle images.',
              },
            },
            {
              name: 'featureImage',
              label: 'Feature Image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Card/listing image for this variant.',
              },
            },
            {
              name: 'highlights',
              label: 'Highlights',
              type: 'array',
              admin: {
                description:
                  'Key feature bullet points shown in the variant list on the model page.',
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
                  'Colour options for this variant. Leave empty to inherit from the parent model or vehicle.',
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
                description: 'Optional variant-specific copy shown in the in-page variant list.',
              },
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
        description: 'Lower numbers appear first within a model.',
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
    slugField({ fieldToUse: 'name', disableUnique: true }),
  ],
  hooks: {
    beforeValidate: [
      validateScopedSlugUniqueness({
        collection: 'vehicle-variants',
        entityLabel: 'variant',
        parentField: 'model',
        parentLabel: 'model',
      }),
    ],
    afterChange: [revalidateVehicleVariant],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateVehicleVariantDelete],
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
