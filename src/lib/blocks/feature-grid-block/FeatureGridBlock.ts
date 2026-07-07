import type { Block } from 'payload'
import { LucideIconField } from '@/lib/fields/lucide-icons'

export const FeatureGridBlock: Block = {
  slug: 'feature-grid',
  interfaceName: 'FeatureGrid',
  labels: {
    singular: 'Feature Grid',
    plural: 'Feature Grids',
  },
  admin: {
    components: {
      Label: '/lib/blocks/feature-grid-block/components/FeatureGridBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/feature-grid-block.jpg',
        alt: 'Feature Grid block - icon and label grid',
      },
    },
  },
  fields: [
    {
      name: 'columns',
      type: 'radio',
      label: 'Columns',
      defaultValue: '2',
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
      ],
      admin: {
        layout: 'horizontal',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Items',
      minRows: 1,
      required: true,
      fields: [
        LucideIconField(),
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
      ],
    },
  ],
}
