import type { Block } from 'payload'
import { headingMarkupDescription } from '@/lib/blocks/heading-block/utils/headingMarkupDescription'
import { ColorField } from '@/lib/blocks/v2/fields/color'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const SubheadingV2Block: Block = {
  slug: 'subheadingV2',
  labels: {
    singular: 'Subheading (v2)',
    plural: 'Subheadings (v2)',
  },
  admin: {
    group: 'Typography',
    components: {
      Label: '/lib/blocks/v2/components/BlockTextLabel#BlockTextLabel',
    },
    images: {
      icon: {
        url: '/blocks/subheading-v2-block-icon.svg',
        alt: 'Subheading (v2) icon',
      },
      thumbnail: {
        url: '/blocks/subheading-v2-block-thumbnail.png',
        alt: 'Subheading (v2) - supporting text below a heading',
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
              name: 'text',
              type: 'textarea',
              label: 'Subheading',
              required: true,
              admin: {
                description: headingMarkupDescription,
              },
            },
            {
              name: 'size',
              type: 'select',
              label: 'Size',
              defaultValue: 'lg',
              options: [
                { label: 'Small', value: 'sm' },
                { label: 'Medium', value: 'md' },
                { label: 'Large', value: 'lg' },
                { label: 'XL', value: 'xl' },
              ],
            },
            {
              name: 'alignment',
              type: 'select',
              label: 'Alignment',
              defaultValue: 'center',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
            },
            ColorField({ name: 'color', label: 'Color', defaultToken: 'muted' }),
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
