import { CollectionConfig, slugField } from 'payload'

import { populatePublishedAt } from '@/hooks/populatePublishedAt'
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
    defaultColumns: ['title', 'offerType', 'updatedAt'],
    useAsTitle: 'title',
    group: 'Content',
  },
  defaultSort: 'sortOrder',
  defaultPopulate: {
    offerType: true,
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
            // {
            //   name: 'bestSaving',
            //   label: 'Best Saving (ZAR)',
            //   type: 'number',
            //   min: 0,
            //   admin: {
            //     condition: (_, siblingData) => siblingData?.offerType === 'price-point',
            //     description: 'Saving amount in Rand, e.g. 100100 for R100 100',
            //   },
            // },
            // {
            //   name: 'paymentFrom',
            //   label: 'Payment From (ZAR per month)',
            //   type: 'number',
            //   min: 0,
            //   admin: {
            //     condition: (_, siblingData) => siblingData?.offerType === 'payment',
            //     description: 'Monthly payment in Rand, e.g. 7799 for R7 799*pm',
            //   },
            // },
          ],
        },
        {
          label: 'Content',
          name: 'content',
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
        // {
        //   label: 'Call to Action',
        //   fields: [
        //     {
        //       name: 'ctaLabel',
        //       label: 'Button Label',
        //       type: 'text',
        //       defaultValue: 'View Offer',
        //     },
        //     {
        //       name: 'ctaLink',
        //       label: 'Button Link',
        //       type: 'text',
        //       admin: {
        //         description: 'URL or path for the offer button. Leave blank to use a placeholder.',
        //       },
        //     },
        //   ],
        // },
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
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
