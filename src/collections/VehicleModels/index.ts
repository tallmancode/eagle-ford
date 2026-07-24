import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { populatePublishedAt } from '@/lib/hooks/populatePublishedAt'
import { validateScopedSlugUniqueness } from '@/lib/hooks/validateScopedSlugUniqueness'
import { isAuthenticated, isAuthenticatedOrPublished } from '@/lib/utils/accessUtil'
import { generatePreviewPath } from '@/lib/utils/generatePreviewPath'
import {
  revalidateVehicleModel,
  revalidateVehicleModelDelete,
} from './hooks/revalidateVehicleModel'

export const VehicleModelsCollection: CollectionConfig<'vehicle-models'> = {
  slug: 'vehicle-models',
  indexes: [{ unique: true, fields: ['vehicle', 'slug'] }],
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
    defaultColumns: ['name', 'vehicle', 'showInMegaMenu', 'updatedAt'],
    group: 'Vehicles',
    livePreview: {
      url: async ({ data, req }) => {
        if (!data?.slug || !data?.vehicle) return null

        let vehicleSlug: string | undefined
        if (typeof data.vehicle === 'object' && data.vehicle !== null && 'slug' in data.vehicle) {
          vehicleSlug = data.vehicle.slug as string | undefined
        } else {
          const vehicleId =
            typeof data.vehicle === 'object' ? data.vehicle.id : (data.vehicle as string)
          if (vehicleId) {
            const vehicle = await req.payload.findByID({
              collection: 'vehicles',
              id: vehicleId,
              depth: 0,
              overrideAccess: false,
              select: { slug: true },
            })
            vehicleSlug = vehicle?.slug ?? undefined
          }
        }

        if (!vehicleSlug) return null

        return generatePreviewPath({
          slug: `${vehicleSlug}/${data.slug}`,
          collection: 'vehicle-models',
          req,
        })
      },
    },
    preview: async (data, { req }) => {
      if (!data?.slug || !data?.vehicle) return null

      let vehicleSlug: string | undefined
      if (typeof data.vehicle === 'object' && data.vehicle !== null && 'slug' in data.vehicle) {
        vehicleSlug = data.vehicle.slug as string | undefined
      } else {
        const vehicleId =
          typeof data.vehicle === 'object' && data.vehicle !== null && 'id' in data.vehicle
            ? String(data.vehicle.id)
            : (data.vehicle as string)
        if (vehicleId) {
          const vehicle = await req.payload.findByID({
            collection: 'vehicles',
            id: vehicleId,
            depth: 0,
            overrideAccess: false,
            select: { slug: true },
          })
          vehicleSlug = vehicle?.slug ?? undefined
        }
      }

      if (!vehicleSlug) return null

      return generatePreviewPath({
        slug: `${vehicleSlug}/${data.slug as string}`,
        collection: 'vehicle-models',
        req,
      })
    },
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
                description: 'Trim or series name, e.g. "Ranger Sport" or "Wildtrak".',
              },
            },
            {
              name: 'vehicle',
              label: 'Vehicle Family',
              type: 'relationship',
              relationTo: 'vehicles',
              required: true,
              admin: {
                description: 'Parent vehicle family this trim belongs to.',
              },
            },
            {
              name: 'tagline',
              label: 'Tagline',
              type: 'text',
              admin: {
                description: 'Optional hero subtitle for this trim page.',
              },
            },
            {
              name: 'heroImage',
              label: 'Hero Image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Full-width hero for this trim. Falls back to the parent vehicle hero image if not set.',
              },
            },
            {
              name: 'featureImage',
              label: 'Feature Image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Card/listing image for this trim. Falls back to model hero, then parent vehicle images.',
              },
            },
          ],
        },
        {
          label: 'Features',
          fields: [
            {
              name: 'features',
              label: 'Features',
              type: 'array',
              admin: {
                description: 'Marketing feature sections shown on the model page.',
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
          ],
        },
        {
          label: 'Colours',
          fields: [
            {
              name: 'colours',
              label: 'Available Colours',
              type: 'array',
              admin: {
                description:
                  'Colour options for this trim. Leave empty to inherit from the parent vehicle.',
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
          label: 'Images',
          fields: [
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
          label: 'FAQ',
          fields: [
            {
              name: 'faqs',
              label: 'FAQs',
              type: 'array',
              fields: [
                {
                  name: 'question',
                  label: 'Question',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'answer',
                  label: 'Answer',
                  type: 'textarea',
                  required: true,
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
                description: 'Trim-specific marketing copy shown on the model page.',
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
      name: 'showInMegaMenu',
      label: 'Show in Mega Menu',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'When enabled, this trim appears in the mega menu alongside any vehicle families that also have Show in Mega Menu enabled.',
      },
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
      name: 'template',
      label: 'Page Template',
      type: 'relationship',
      relationTo: 'vehicle-model-templates',
      admin: {
        position: 'sidebar',
        description: 'Optional. Layout template used to render this model page.',
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
        collection: 'vehicle-models',
        entityLabel: 'model',
        parentField: 'vehicle',
        parentLabel: 'vehicle',
      }),
    ],
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
