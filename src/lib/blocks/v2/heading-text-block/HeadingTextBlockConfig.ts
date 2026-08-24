import type { Block } from 'payload'
import { headingMarkupDescription } from '@/lib/blocks/heading-block/utils/headingMarkupDescription'
import { ColorField } from '@/lib/blocks/v2/fields/color'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const HeadingTextV2Block: Block = {
  slug: 'headingTextV2',
  labels: {
    singular: 'Heading Text (v2)',
    plural: 'Heading Text (v2)',
  },
  admin: {
    group: 'Typography',
    components: {
      Label: '/lib/blocks/v2/components/BlockTextLabel#BlockTextLabel',
    },
    images: {
      icon: {
        url: '/blocks/heading-text-v2-block-icon.svg',
        alt: 'Heading Text (v2) icon',
      },
      thumbnail: {
        url: '/blocks/heading-text-v2-block-thumbnail.png',
        alt: 'Heading Text (v2) - main heading line',
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
              type: 'text',
              label: 'Heading',
              required: true,
              admin: {
                description: headingMarkupDescription,
              },
            },
            {
              name: 'headingTag',
              type: 'select',
              label: 'Heading Tag',
              defaultValue: 'h2',
              options: [
                { label: 'H1', value: 'h1' },
                { label: 'H2', value: 'h2' },
                { label: 'H3', value: 'h3' },
                { label: 'H4', value: 'h4' },
              ],
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
            ColorField({ name: 'color', label: 'Color', defaultToken: 'primary' }),
            {
              name: 'fontWeight',
              type: 'select',
              label: 'Font Weight',
              defaultValue: 'bold',
              options: [
                { label: 'Normal', value: 'normal' },
                { label: 'Medium', value: 'medium' },
                { label: 'Semibold', value: 'semibold' },
                { label: 'Bold', value: 'bold' },
                { label: 'Extrabold', value: 'extrabold' },
              ],
            },
            {
              name: 'uppercase',
              type: 'checkbox',
              label: 'Uppercase',
              defaultValue: true,
            },
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
