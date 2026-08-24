import type { Block } from 'payload'
import { ColorField } from '@/lib/blocks/v2/fields/color'
import { LucideIconField } from '@/lib/fields/lucide-icons'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const IconV2Block: Block = {
  slug: 'iconV2',
  labels: {
    singular: 'Icon (v2)',
    plural: 'Icons (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/icon-v2-block-icon.svg',
        alt: 'Icon (v2) icon',
      },
      thumbnail: {
        url: '/blocks/icon-v2-block-thumbnail.png',
        alt: 'Icon (v2) - Lucide icon with optional label',
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
            LucideIconField({ required: true }),
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              admin: {
                description: 'Optional text shown next to the icon.',
              },
            },
            {
              name: 'size',
              type: 'select',
              label: 'Icon Size',
              defaultValue: 'md',
              options: [
                { label: 'Small', value: 'sm' },
                { label: 'Medium', value: 'md' },
                { label: 'Large', value: 'lg' },
                { label: 'XL', value: 'xl' },
              ],
            },
            ColorField({
              name: 'color',
              label: 'Color',
              defaultToken: 'primary',
              allowInherit: true,
              description: 'Inherit uses the surrounding text color.',
            }),
            {
              name: 'align',
              type: 'select',
              label: 'Alignment',
              defaultValue: 'left',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
            },
            {
              name: 'enableLink',
              type: 'checkbox',
              label: 'Make icon a link',
              defaultValue: false,
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              admin: {
                description: 'e.g. tel:0104400510, mailto:info@example.com, /contact',
                condition: (_data, siblingData) => siblingData?.enableLink === true,
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open in new tab',
              defaultValue: false,
              admin: {
                condition: (_data, siblingData) => siblingData?.enableLink === true,
              },
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
