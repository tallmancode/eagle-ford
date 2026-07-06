import type { Block } from 'payload'

export const PartnersBlock: Block = {
  slug: 'partners',
  interfaceName: 'Partners',
  labels: {
    singular: 'Partners',
    plural: 'Partners',
  },
  admin: {
    group: 'Cards',
    components: {
      Label: '/lib/blocks/partners-block/components/PartnersBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/partners-block.jpg',
        alt: 'Partners block - row of logo cards',
      },
    },
  },
  fields: [
    {
      name: 'partners',
      type: 'array',
      label: 'Partners',
      minRows: 1,
      maxRows: 5,
      required: true,
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo',
          required: true,
        },
        {
          name: 'imageAlt',
          type: 'text',
          label: 'Image Alt Text',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.logo),
            description:
              'Override the alt text from the media library. Leave empty to use the media alt text.',
          },
        },
      ],
    },
  ],
}
