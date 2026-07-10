import type { Block } from 'payload'
import { LinkField } from '@/lib/fields/link/LinkField'

export const ImageCardsBlock: Block = {
  slug: 'image-cards',
  interfaceName: 'ImageCards',
  labels: {
    singular: 'Image Cards',
    plural: 'Image Cards',
  },
  admin: {
    group: 'Cards',
    components: {
      Label: '/lib/blocks/image-cards-block/components/ImageCardsBlockLabel',
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
      name: 'items',
      type: 'array',
      label: 'Cards',
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
        LinkField({ name: 'imageLink', relationTo: ['pages'], label: 'Image Link' }),
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
        LinkField({ name: 'link', relationTo: ['pages'], label: 'CTA Link' }),
      ],
    },
  ],
}
