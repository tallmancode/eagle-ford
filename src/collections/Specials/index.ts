import { CollectionConfig, slugField } from 'payload'

import { populatePublishedAt } from '@/lib/hooks/populatePublishedAt'
import { isAuthenticated, isAuthenticatedOrPublished } from '@/lib/utils/accessUtil'
import { OFFER_TYPES } from '@/lib/specials/constants'
import { revalidateSpecial, revalidateSpecialDelete } from './hooks/revalidateSpecial'

export const SpecialsCollection: CollectionConfig<'specials'> = {
  slug: 'specials',
  labels: {
    singular: 'Special',
    plural: 'Specials',
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAuthenticatedOrPublished,
    update: isAuthenticated,
  },
  admin: {
    defaultColumns: ['title', 'category', 'offerType', 'updatedAt', 'vehicle', 'vehicleModel'],
    useAsTitle: 'title',
    group: 'Content',
  },
  defaultSort: 'sortOrder',
  defaultPopulate: {
    offerType: true,
    category: true,
    vehicle: true,
    vehicleModel: true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Offer Details',
          fields: [
            {
              name: 'offerType',
              label: 'Offer Type',
              type: 'select',
              required: true,
              defaultValue: 'price-point',
              options: [...OFFER_TYPES],
            },
            {
              name: 'category',
              label: 'Category',
              type: 'relationship',
              relationTo: 'special-categories',
              required: true,
              admin: {
                description:
                  'Groups this special under a campaign or theme (e.g. Truck Month, Holiday).',
              },
            },
            {
              name: 'title',
              label: 'Badge Label Override',
              type: 'text',
              admin: {
                width: '50%',
                description: 'Optional. Defaults to the offer type label if left blank.',
              },
            },
            {
              name: 'subTitle',
              label: 'Badge Label Override',
              type: 'text',
              admin: {
                width: '50%',
                description: 'Optional. Defaults to the offer type label if left blank.',
              },
            },
            {
              name: 'cardImage',
              label: 'Card Image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'vehicle',
              label: 'Linked Vehicle',
              type: 'relationship',
              relationTo: 'vehicles',
              admin: {
                description:
                  'Optional. Links this special to a vehicle family page. Leave blank for service or non-vehicle offers.',
              },
            },
            {
              name: 'vehicleModel',
              label: 'Linked Model / Variant',
              type: 'relationship',
              relationTo: 'vehicle-models',
              filterOptions: ({ siblingData }) => {
                const data = siblingData as { vehicle?: string | { id?: string } | null }
                if (data?.vehicle) {
                  return {
                    vehicle: {
                      equals: typeof data.vehicle === 'object' ? data.vehicle.id : data.vehicle,
                    },
                  }
                }
                return true
              },
              admin: {
                description:
                  'Optional. Links this special to a specific model variant. Leave blank when not applicable.',
              },
            },
          ],
        },
        {
          label: 'Pricing',
          fields: [
            {
              name: 'pricingLabel',
              label: 'The label to appear in front of the price eg. Save Upto',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.offerType === 'service',
                description: 'Cash price in Rand, e.g. 489900 for R489 900',
              },
            },
            {
              name: 'specialOffer',
              label: 'Special Offer Price (ZAR)',
              type: 'number',
              min: 0,
              admin: {
                condition: (_, siblingData) =>
                  ['price-point', 'service'].includes(siblingData?.offerType),
                description: 'Cash price in Rand, e.g. 489900 for R489 900',
              },
            },
            {
              name: 'bestSaving',
              label: 'Best Saving (ZAR)',
              type: 'number',
              min: 0,
              admin: {
                condition: (_, siblingData) => siblingData?.offerType === 'price-point',
                description: 'Saving amount in Rand, e.g. 100100 for R100 100',
              },
            },
            {
              name: 'paymentFrom',
              label: 'Payment From (ZAR per month)',
              type: 'number',
              min: 0,
              admin: {
                condition: (_, siblingData) => siblingData?.offerType === 'payment',
                description: 'Monthly payment in Rand, e.g. 7799 for R7 799*pm',
              },
            },
          ],
        },
        {
          name: 'content',
          label: 'Content',
          fields: [
            {
              name: 'section',
              label: false,
              type: 'blocks',
              blocks: [],
              blockReferences: ['section'],
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
        description: 'Lower numbers appear first within a section.',
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
          'Optional. Overrides the category template when this special is selected. If blank, the category template is used.',
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
          'Optional. Overrides the category enquire form when this special is selected. If blank, the category form is used.',
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
    slugField({ fieldToUse: 'title' }),
  ],
  hooks: {
    afterChange: [revalidateSpecial],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateSpecialDelete],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
