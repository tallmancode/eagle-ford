import type { Block } from 'payload'
import { ColorField } from '@/lib/blocks/v2/fields/color'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const EyebrowV2Block: Block = {
  slug: 'eyebrowV2',
  labels: {
    singular: 'Eyebrow (v2)',
    plural: 'Eyebrows (v2)',
  },
  admin: {
    group: 'Typography',
    components: {
      Label: '/lib/blocks/v2/eyebrow-block/components/EyebrowV2BlockLabel#EyebrowV2BlockLabel',
    },
    images: {
      icon: {
        url: '/blocks/eyebrow-v2-block-icon.svg',
        alt: 'Eyebrow (v2) icon',
      },
      thumbnail: {
        url: '/blocks/eyebrow-v2-block-thumbnail.png',
        alt: 'Eyebrow (v2) - small tag label above a heading',
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
              name: 'label',
              type: 'text',
              label: 'Label',
              required: true,
            },
            {
              name: 'style',
              type: 'select',
              label: 'Style',
              defaultValue: 'filled',
              options: [
                { label: 'Filled', value: 'filled' },
                { label: 'Outline', value: 'outline' },
                { label: 'None', value: 'none' },
              ],
            },
            ColorField({ name: 'color', label: 'Color', defaultToken: 'primary' }),
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
