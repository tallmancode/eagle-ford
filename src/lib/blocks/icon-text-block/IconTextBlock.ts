import type { Block } from 'payload'
import { LucideIconField } from '@/lib/fields/lucide-icons'

export const IconTextBlock: Block = {
  slug: 'icon-text',
  labels: {
    singular: 'Icon Text',
    plural: 'Icon Texts',
  },
  admin: {
    components: {
      Label: '/lib/blocks/icon-text-block/components/IconTextBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/icon-text-block.jpg',
        alt: 'Icon Text block - inline icon with label',
      },
    },
  },
  fields: [
    LucideIconField(),
    {
      name: 'text',
      type: 'text',
      label: 'Text',
      required: true,
    },
    {
      name: 'color',
      type: 'select',
      label: 'Text Color',
      defaultValue: 'default',
      options: [
        { label: 'Default (inherit)', value: 'default' },
        { label: 'Primary', value: 'primary' },
        { label: 'Neutral', value: 'neutral' },
        { label: 'Success', value: 'success' },
        { label: 'Danger', value: 'danger' },
        { label: 'Warning', value: 'warning' },
        { label: 'White', value: 'white' },
      ],
    },
    {
      name: 'enableLink',
      type: 'checkbox',
      label: 'Make text a link',
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
}
