import type { Block } from 'payload'

export const FeatureListBlock: Block = {
  slug: 'feature-list',
  labels: {
    singular: 'Feature List',
    plural: 'Feature Lists',
  },
  admin: {
    components: {
      Label: '/lib/blocks/feature-list-block/components/FeatureListBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/feature-list-block.jpg',
        alt: 'Feature List block - checklist rows with titles and descriptions',
      },
    },
  },
  fields: [
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      minRows: 1,
      required: true,
      fields: [
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
