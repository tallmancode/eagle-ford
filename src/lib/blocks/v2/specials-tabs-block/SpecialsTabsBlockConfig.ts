import type { Block } from 'payload'
import { ColorField } from '@/lib/blocks/v2/fields/color'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const SpecialsTabsV2Block: Block = {
  slug: 'specialsTabsV2',
  labels: {
    singular: 'Specials Tabs (v2)',
    plural: 'Specials Tabs (v2)',
  },
  admin: {
    group: 'Specials',
    images: {
      icon: {
        url: '/blocks/specials-tabs-v2-block-icon.svg',
        alt: 'Specials Tabs (v2) icon',
      },
      thumbnail: {
        url: '/blocks/specials-tabs-v2-block-thumbnail.png',
        alt: 'Specials Tabs (v2) - category offers with enquire form',
      },
    },
  },
  fields: [
    {
      name: 'showOfferDetails',
      type: 'checkbox',
      label: 'Show offer details',
      defaultValue: true,
      admin: {
        description:
          'Offer Details tab on the selected special (or the offer body on service specials). Save the template to refresh the preview.',
      },
    },
    {
      name: 'showKeyFeatures',
      type: 'checkbox',
      label: 'Show key features',
      defaultValue: true,
      admin: {
        description:
          'Key Features tab (not used for service specials). Save the template to refresh the preview.',
      },
    },
    {
      name: 'showFinanceCalculator',
      type: 'checkbox',
      label: 'Show finance calculator',
      defaultValue: true,
      admin: {
        description:
          'Finance Calculator tab on price-point specials (not used for service specials). Save the template to refresh the preview.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          description:
            'Shows the specials for the current category (tabs, pricing, enquire form). On specials category pages and in Special Template preview, data comes from the category automatically.',
          fields: [
            {
              name: 'showCategoryTitle',
              type: 'checkbox',
              label: 'Show category title',
              defaultValue: true,
              admin: {
                description: 'Renders the category name above the specials tabs.',
              },
            },
          ],
        },
        {
          label: 'Appearance',
          description: 'Colours for the specials list tabs. Leave empty to use the site defaults.',
          fields: [
            ColorField({
              name: 'activeTabBackground',
              label: 'Active tab background',
              description: 'Background of the selected special in the list (desktop and mobile).',
            }),
            ColorField({
              name: 'activeTabText',
              label: 'Active tab text',
              description: 'Title colour of the selected special.',
            }),
            ColorField({
              name: 'inactiveTabBackground',
              label: 'Inactive tab background',
              description: 'Background of specials that are not selected.',
            }),
            ColorField({
              name: 'inactiveTabText',
              label: 'Inactive tab text',
              description: 'Title colour of specials that are not selected.',
            }),
            ColorField({
              name: 'activeTabAccent',
              label: 'Active accent',
              description: 'Left border accent on the selected special.',
            }),
            ColorField({
              name: 'badgeBackground',
              label: 'Offer badge background',
              description: 'Background of the offer-type pill (e.g. Price Point Specials).',
            }),
            ColorField({
              name: 'badgeText',
              label: 'Offer badge text',
              description: 'Text colour of the offer-type pill.',
            }),
            ColorField({
              name: 'categoryTitleColor',
              label: 'Category title',
              description: 'Colour of the category heading above the tabs (when shown).',
            }),
            ColorField({
              name: 'pricingColor',
              label: 'Pricing highlight',
              description: 'Colour for special offer / payment amounts.',
            }),
            ColorField({
              name: 'mutedTextColor',
              label: 'Muted / label text',
              description: 'Colour for “Specials” headers, pricing labels, and helper copy.',
            }),
          ],
        },
        {
          label: 'Layout',
          fields: [StyleFields({ name: 'styles', label: false })],
        },
      ],
    },
  ],
}
