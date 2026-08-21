import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const MapV2Block: Block = {
  slug: 'mapV2',
  labels: {
    singular: 'Map (v2)',
    plural: 'Maps (v2)',
  },
  admin: {
    group: 'Google Maps',
    images: {
      icon: {
        url: '/blocks/map-v2-block-icon.svg',
        alt: 'Map (v2) icon',
      },
      thumbnail: {
        url: '/blocks/map-v2-block-thumbnail.png',
        alt: 'Map (v2) - embedded Google Maps iframe',
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
              name: 'embedUrl',
              type: 'text',
              label: 'Google Maps Embed URL',
              required: true,
              admin: {
                description:
                  'Paste the embed URL from Google Maps: open the location → Share → Embed a map → copy the src URL from the iframe code.',
              },
              validate: (value: string | null | undefined) => {
                if (!value) return 'Embed URL is required'
                if (!value.startsWith('https://www.google.com/maps/embed')) {
                  return 'URL must be a Google Maps embed URL (starts with https://www.google.com/maps/embed)'
                }
                return true
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Map Title',
              admin: {
                description: 'Accessible title for the map iframe. Defaults to "Location map".',
              },
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
