import type { Block } from 'payload'
import { LucideIconField } from '@/lib/fields/lucide-icons'

export const BenefitsBlock: Block = {
  slug: 'benefits',
  interfaceName: 'Benefits',
  labels: {
    singular: 'Benefits',
    plural: 'Benefits',
  },
  admin: {
    components: {
      Label: '/lib/blocks/benefits-block/components/BenefitsBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/benefits-block.jpg',
        alt: 'Benefits block - icon, title and description grid',
      },
    },
  },
  fields: [
    {
      name: 'columns',
      type: 'radio',
      label: 'Columns',
      defaultValue: '3',
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
}
