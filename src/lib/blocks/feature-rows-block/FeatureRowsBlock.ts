import type { Block } from 'payload'
import { LucideIconField } from '@/lib/fields/lucide-icons'
import { LinkField } from '@/lib/fields/link/LinkField'

export const FeatureRowsBlock: Block = {
  slug: 'feature-rows',
  interfaceName: 'FeatureRows',
  labels: {
    singular: 'Feature Rows',
    plural: 'Feature Rows',
  },
  admin: {
    components: {
      Label: '/lib/blocks/feature-rows-block/components/FeatureRowsBlockLabel',
    },
  },
  fields: [
    {
      name: 'rows',
      type: 'array',
      label: 'Rows',
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
        LinkField({ name: 'link', relationTo: ['pages'], includeLabel: false }),
      ],
    },
  ],
}
