import type { Block } from 'payload'

export const SubheadingBlock: Block = {
  slug: 'subheading',
  interfaceName: 'SubheadingBlockType',
  labels: {
    singular: 'Subheading',
    plural: 'Subheadings',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      label: 'Text',
    },
    {
      name: 'size',
      type: 'select',
      label: 'Size',
      defaultValue: 'h2',
      options: [
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
        { label: 'H4', value: 'h4' },
      ],
    },
  ],
}
