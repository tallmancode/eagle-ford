import type { Block } from 'payload'
import { LucideIconField } from '@/lib/fields/lucide-icons'
import { LinkField } from '@/lib/fields/link/LinkField'
import { ColorField } from '@/lib/blocks/v2/fields/color'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const FeatureRowsV2Block: Block = {
  slug: 'featureRowsV2',
  labels: {
    singular: 'Feature Rows (v2)',
    plural: 'Feature Rows (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/feature-rows-v2-block-icon.svg',
        alt: 'Feature Rows (v2) icon',
      },
      thumbnail: {
        url: '/blocks/feature-rows-v2-block-thumbnail.png',
        alt: 'Feature Rows (v2) - numbered icon rows with optional links',
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
              name: 'rows',
              type: 'array',
              label: 'Rows',
              minRows: 1,
              required: true,
              admin: {
                description:
                  'Each row shows an icon, title, description, and an optional link button.',
              },
              fields: [
                LucideIconField(),
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  required: true,
                },
                LinkField({
                  name: 'link',
                  relationTo: ['pages'],
                  includeLabel: false,
                  label: 'Link (optional)',
                }),
              ],
            },
          ],
        },
        {
          label: 'Appearance',
          description: 'Colours for row text and icons. Leave empty to use the site defaults.',
          fields: [
            ColorField({
              name: 'titleColor',
              label: 'Title color',
              defaultToken: 'foreground',
              description: 'Colour of each row title.',
            }),
            ColorField({
              name: 'descriptionColor',
              label: 'Description color',
              defaultToken: 'muted',
              description: 'Colour of each row description.',
            }),
            ColorField({
              name: 'iconColor',
              label: 'Icon & number color',
              defaultToken: 'secondary',
              description: 'Colour of the row icon, icon border, and number.',
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
