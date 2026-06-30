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
