import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { populatePublishedAt } from '@/lib/hooks/populatePublishedAt'
import { isAuthenticated, isAuthenticatedOrPublished } from '@/lib/utils/accessUtil'
import { generatePreviewPath } from '@/lib/utils/generatePreviewPath'
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
    defaultColumns: ['name', 'category', 'startingPrice', 'badge', 'showInMegaMenu', 'updatedAt'],
    group: 'Vehicles',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'vehicles',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'vehicles',
        req,
      }),
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
              name: 'tagline',
              label: 'Tagline',
              type: 'text',
              admin: {
                description: 'Hero subtitle, e.g. "Built here. Built different."',
              },
            },
            {
              name: 'ctaButtons',
              label: 'CTA Buttons',
              type: 'array',
              admin: {
                description:
                  'Hero call-to-action buttons. "Enquiry" scrolls to the form; "Brochure" links to the brochure PDF.',
              },
              fields: [
                {
                  name: 'label',
                  label: 'Label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'action',
                  label: 'Action',
                  type: 'select',
                  required: true,
                  defaultValue: 'link',
                  options: [
                    { label: 'Scroll to Enquiry Form', value: 'enquiry' },
                    { label: 'Download Brochure', value: 'brochure' },
                    { label: 'Custom Link', value: 'link' },
                  ],
                },
                {
                  name: 'url',
                  label: 'URL',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.action === 'link',
                    description: 'Internal path (e.g. /contact) or external URL.',
                  },
                },
              ],
            },
            {
              name: 'specHighlights',
              label: 'Spec Highlights',
              type: 'array',
              admin: {
                description:
                  'Key stats shown in a horizontal strip, e.g. towing capacity or payload.',
              },
              fields: [
                {
                  name: 'value',
                  label: 'Value',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'e.g. "3500kg"',
                  },
                },
                {
                  name: 'label',
                  label: 'Label',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'e.g. "Towing"',
                  },
                },
              ],
            },
            {
              name: 'engineOptions',
              label: 'Engine Options',
              type: 'array',
              admin: {
                description: 'Available powertrain options displayed as chips.',
              },
              fields: [
                {
                  name: 'name',
                  label: 'Engine Name',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'e.g. "3.0L V6"',
                  },
                },
                {
                  name: 'engineType',
                  label: 'Engine Type',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'e.g. "Turbo Diesel"',
                  },
                },
              ],
            },
            {
              name: 'brochure',
              label: 'Brochure',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'PDF brochure available for download on the vehicle page.',
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
                description:
                  'Marketing feature sections shown on the vehicle page with alternating image and text.',
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
          ],
        },
        {
          label: 'Images',
          fields: [
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
          label: 'Custom Fields',
          fields: [
            {
              name: 'customFields',
              label: 'Custom Fields',
              type: 'array',
              admin: {
                description:
                  'Arbitrary key/value pairs. Reference these by key inside template blocks.',
              },
              fields: [
                {
                  name: 'key',
                  label: 'Key',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Unique identifier, e.g. "warrantyYears".',
                  },
                },
                {
                  name: 'value',
                  label: 'Value',
                  type: 'textarea',
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
            {
              name: 'monthlyPrice',
              label: 'Monthly Price (ZAR)',
              type: 'number',
              min: 0,
              admin: {
                description:
                  'Finance monthly payment as a whole number, e.g. 6799 for R 6,799 p/m.',
              },
            },
            {
              name: 'monthlyPriceNote',
              label: 'Monthly Price Note',
              type: 'text',
              defaultValue: 'When financed. Ts & Cs apply.',
            },
            {
              name: 'paymentOptions',
              label: 'Payment Options',
              type: 'array',
              admin: {
                description: 'Finance and payment option cards shown on the vehicle page.',
              },
              fields: [
                {
                  name: 'title',
                  label: 'Title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                },
                {
                  name: 'ctaLabel',
                  label: 'CTA Label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'ctaUrl',
                  label: 'CTA URL',
                  type: 'text',
                  admin: {
                    description: 'Internal path (e.g. #enquire) or external URL.',
                  },
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
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'When enabled, this vehicle appears in the New vehicles mega menu.',
      },
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
      name: 'template',
      label: 'Page Template',
      type: 'relationship',
      relationTo: 'vehicle-templates',
      admin: {
        position: 'sidebar',
        description: 'Optional. Layout template used to render this vehicle page.',
      },
    },
    {
      name: 'modelTemplate',
      label: 'Model Page Template',
      type: 'relationship',
      relationTo: 'vehicle-model-templates',
      admin: {
        position: 'sidebar',
        description: 'Optional. Layout used for all model detail pages under this vehicle.',
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
