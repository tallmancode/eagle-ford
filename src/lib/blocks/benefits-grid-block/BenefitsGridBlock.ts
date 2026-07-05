import type { Block } from 'payload'
import { LinkField } from '@/lib/fields/link/LinkField'

export const BenefitsGridBlock: Block = {
  slug: 'benefits-grid',
  interfaceName: 'BenefitsGrid',
  labels: {
    singular: 'Benefits Grid',
    plural: 'Benefits Grids',
  },
  admin: {
    components: {
      Label: '/lib/blocks/benefits-grid-block/components/BenefitsGridBlockLabel',
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
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
          required: true,
        },
        {
          name: 'imageAlt',
          type: 'text',
          label: 'Image Alt Text',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.image),
            description:
              'Override the alt text from the media library. Leave empty to use the media alt text.',
          },
        },
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
        LinkField({ name: 'link', relationTo: ['pages'] }),
      ],
    },
  ],
}
