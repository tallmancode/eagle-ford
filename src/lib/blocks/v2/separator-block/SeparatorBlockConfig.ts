import type { Block } from 'payload'
import { ColorField } from '@/lib/blocks/v2/fields/color'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const SeparatorV2Block: Block = {
  slug: 'separatorV2',
  labels: {
    singular: 'Separator (v2)',
    plural: 'Separators (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/separator-v2-block-icon.svg',
        alt: 'Separator (v2) icon',
      },
      thumbnail: {
        url: '/blocks/separator-v2-block-thumbnail.png',
        alt: 'Separator (v2) - horizontal visual divider',
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
              type: 'row',
              fields: [
                {
                  name: 'variant',
                  type: 'select',
                  label: 'Style',
                  defaultValue: 'solid',
                  options: [
                    { label: 'Solid', value: 'solid' },
                    { label: 'Dashed', value: 'dashed' },
                    { label: 'Dotted', value: 'dotted' },
                  ],
                  admin: {
                    width: '50%',
                    description: 'Line style for the divider.',
                  },
                },
                {
                  name: 'thickness',
                  type: 'select',
                  label: 'Thickness',
                  defaultValue: 'thin',
                  options: [
                    { label: 'Hairline', value: 'hairline' },
                    { label: 'Thin', value: 'thin' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Thick', value: 'thick' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            ColorField({ name: 'color', label: 'Color', defaultToken: 'border' }),
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
