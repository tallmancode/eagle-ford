import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { isAuthenticated, isAuthenticatedOrPublished } from '@/lib/utils/accessUtil'
import { revalidateVehicle, revalidateVehicleDelete } from './hooks/revalidateVehicle'

export const VehiclesCollection: CollectionConfig<'vehicles'> = {
  slug: 'vehicles',
  labels: {
    singular: 'Vehicle',
    plural: 'Vehicles',
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAuthenticatedOrPublished,
    update: isAuthenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'startingPrice', 'badge', 'updatedAt'],
    group: 'Vehicles',
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Vehicle Details',
          fields: [
            {
              name: 'name',
              label: 'Vehicle Name',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g. "Next Level Ranger"',
              },
            },
            {
              name: 'badge',
              label: 'Badge',
              type: 'select',
              options: [
                { label: 'Newly Launched', value: 'newly-launched' },
                { label: 'Coming Soon', value: 'coming-soon' },
                { label: 'Limited', value: 'limited' },
              ],
              admin: {
                description: 'Optional marketing badge displayed on listing cards.',
              },
            },
            {
              name: 'category',
              label: 'Category',
              type: 'relationship',
              relationTo: 'vehicle-categories',
              required: true,
            },
            {
              name: 'heroImage',
              label: 'Hero Image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description:
                  'Full-width background image displayed at the top of the vehicle page.',
              },
            },
            {
              name: 'featureImage',
              label: 'Feature Image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Image shown on vehicle listing cards (e.g. a cut-out or top-down shot). Falls back to Hero Image if not set.',
              },
            },
            {
              name: 'features',
              label: 'Features',
              type: 'array',
              admin: {
                description: 'Marketing feature cards shown on the vehicle page.',
              },
              fields: [
                {
                  name: 'featureTitle',
                  label: 'Title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'featureDescription',
                  label: 'Description',
                  type: 'textarea',
                },
                {
                  name: 'featureImage',
                  label: 'Image',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'colours',
              label: 'Available Colours',
              type: 'array',
              fields: [
                {
                  name: 'colourName',
                  label: 'Colour Name',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'e.g. "Frozen White"',
                  },
                },
                {
                  name: 'colourNote',
                  label: 'Availability Note',
                  type: 'text',
                  admin: {
                    description: 'e.g. "Platinum Only" or "Sport & Tremor Only"',
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
            {
              name: 'gallery',
              label: 'Gallery',
              type: 'array',
              fields: [
                {
                  name: 'image',
                  label: 'Image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Pricing',
          fields: [
            {
              name: 'startingPrice',
              label: 'Starting Price (ZAR)',
              type: 'number',
              min: 0,
              admin: {
                description: 'Lowest variant price as a whole number, e.g. 621000 for R 621,000.',
              },
            },
            {
              name: 'priceDisclaimer',
              label: 'Price Disclaimer',
              type: 'text',
              defaultValue: 'Including Optional Service plan and excluding Packs & factory options',
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
        description: 'Lower numbers appear first.',
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
    afterChange: [revalidateVehicle],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateVehicleDelete],
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
