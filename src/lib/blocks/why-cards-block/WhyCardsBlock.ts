import type { Block } from 'payload'
import { LucideIconField } from '@/lib/fields/lucide-icons'

export const WhyCardsBlock: Block = {
  slug: 'why-cards',
  interfaceName: 'WhyCards',
  labels: {
    singular: 'Why Cards',
    plural: 'Why Cards',
  },
  admin: {
    group: 'Cards',
    components: {
      Label: '/lib/blocks/why-cards-block/components/WhyCardsBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/why-cards-block.jpg',
        alt: 'Why Cards block - grid of icon cards with titles and descriptions',
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
        { label: '4', value: '4' },
      ],
      admin: {
        layout: 'horizontal',
      },
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
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
