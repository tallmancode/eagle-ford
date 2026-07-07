import type { Block } from 'payload'

export const TeamGridBlock: Block = {
  slug: 'team-grid',
  interfaceName: 'TeamGrid',
  labels: {
    singular: 'Team Grid',
    plural: 'Team Grids',
  },
  admin: {
    components: {
      Label: '/lib/blocks/team-grid-block/components/TeamGridBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/team-grid-block.jpg',
        alt: 'Team Grid block - photo grid with staff headshots and names',
      },
    },
  },
  fields: [
    {
      name: 'members',
      type: 'array',
      label: 'Team Members',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Photo',
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: 'Video URL',
          admin: {
            description: 'YouTube embed or Shorts URL. Leave empty for non-clickable cards.',
          },
        },
      ],
    },
  ],
}
