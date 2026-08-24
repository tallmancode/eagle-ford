import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const TeamGridV2Block: Block = {
  slug: 'teamGridV2',
  labels: {
    singular: 'Team Grid (v2)',
    plural: 'Team Grids (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/team-grid-v2-block-icon.svg',
        alt: 'Team Grid (v2) icon',
      },
      thumbnail: {
        url: '/blocks/team-grid-v2-block-thumbnail.png',
        alt: 'Team Grid (v2) - staff photo grid',
      },
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'columns',
              type: 'select',
              label: 'Columns',
              defaultValue: '4',
              options: [
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
              ],
            },
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
        },
        {
          label: 'Layout',
          fields: [StyleFields({ name: 'styles', label: false })],
        },
      ],
    },
  ],
}
