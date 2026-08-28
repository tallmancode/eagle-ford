import type { Block } from 'payload'
import { LucideIconField } from '@/lib/fields/lucide-icons'
import { LinkField } from '@/lib/fields/link/LinkField'
import { ColorField } from '@/lib/blocks/v2/fields/color'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const FeatureV2Block: Block = {
  slug: 'featureV2',
  labels: {
    singular: 'Feature (v2)',
    plural: 'Features (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/feature-v2-block-icon.svg',
        alt: 'Feature (v2) icon',
      },
      thumbnail: {
        url: '/blocks/feature-v2-block-thumbnail.png',
        alt: 'Feature (v2) - intro column with 2×2 feature cards',
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
              name: 'showAccentBar',
              type: 'checkbox',
              label: 'Show accent bar',
              defaultValue: true,
              admin: {
                description: 'Short coloured bar above the heading.',
              },
            },
            {
              name: 'heading',
              type: 'textarea',
              label: 'Heading',
              required: true,
              defaultValue: 'Featured Products',
              admin: {
                description: 'Large heading on the left. Use a line break for two lines.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              admin: {
                description: 'Supporting copy under the heading.',
              },
            },
            {
              type: 'group',
              name: 'link',
              label: 'Learn more link',
              admin: {
                description: 'Optional text link under the description.',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Link label',
                  defaultValue: 'Learn More',
                },
                LinkField({
                  name: 'href',
                  relationTo: ['pages'],
                  includeLabel: false,
                  label: 'Link',
                }),
              ],
            },
            {
              name: 'features',
              type: 'array',
              label: 'Feature cards',
              minRows: 1,
              maxRows: 8,
              labels: {
                singular: 'Feature',
                plural: 'Features',
              },
              admin: {
                description: 'Cards shown in a 2-column grid on the right (typically 4).',
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
              ],
            },
          ],
        },
        {
          label: 'Appearance',
          description: 'Colours. Leave empty to use Ford brand defaults.',
          fields: [
            ColorField({
              name: 'accentColor',
              label: 'Accent color',
              defaultToken: 'danger',
              description: 'Accent bar and icon circle background.',
            }),
            ColorField({
              name: 'headingColor',
              label: 'Heading color',
              defaultToken: 'foreground',
            }),
            ColorField({
              name: 'descriptionColor',
              label: 'Description color',
              defaultToken: 'muted',
            }),
            ColorField({
              name: 'linkColor',
              label: 'Link color',
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
