import type { Block } from 'payload'
import { LinkField } from '@/lib/fields/link/LinkField'
import { ColorField } from '@/lib/blocks/v2/fields/color'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const CtaStatsV2Block: Block = {
  slug: 'ctaStatsV2',
  labels: {
    singular: 'CTA Stats (v2)',
    plural: 'CTA Stats (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/cta-stats-v2-block-icon.svg',
        alt: 'CTA Stats (v2) icon',
      },
      thumbnail: {
        url: '/blocks/cta-stats-v2-block-thumbnail.png',
        alt: 'CTA Stats (v2) - copy, image, and stacked stats',
      },
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heading',
              type: 'textarea',
              label: 'Heading',
              required: true,
              defaultValue: 'Subscribe For Latest Newsletter',
              admin: {
                description: 'Left-column heading. Use a line break for two lines.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
            },
            {
              type: 'group',
              name: 'cta',
              label: 'Call to action',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Button label',
                  defaultValue: 'Learn more!',
                },
                LinkField({
                  name: 'link',
                  relationTo: ['pages'],
                  includeLabel: false,
                  label: 'Link',
                }),
              ],
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Centre image',
              required: true,
              admin: {
                description: 'Tall portrait image in the middle column.',
              },
            },
            {
              name: 'imageAlt',
              type: 'text',
              label: 'Image alt text',
            },
            {
              name: 'stats',
              type: 'array',
              label: 'Stats',
              minRows: 1,
              maxRows: 6,
              required: true,
              admin: {
                description: 'Large numbers stacked in the right column (typically 3).',
              },
              fields: [
                {
                  name: 'value',
                  type: 'text',
                  label: 'Value',
                  required: true,
                },
                {
                  name: 'label',
                  type: 'textarea',
                  label: 'Label',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Appearance',
          fields: [
            ColorField({
              name: 'headingColor',
              label: 'Heading color',
              defaultToken: 'foreground',
            }),
            ColorField({
              name: 'statValueColor',
              label: 'Stat value color',
              defaultToken: 'foreground',
            }),
            ColorField({
              name: 'buttonColor',
              label: 'Button background',
              defaultToken: 'primary',
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
