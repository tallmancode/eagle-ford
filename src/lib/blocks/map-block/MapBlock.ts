import type { Block } from 'payload'

export const MapBlock: Block = {
  slug: 'map',
  interfaceName: 'Map',
  labels: {
    singular: 'Map',
    plural: 'Maps',
  },
  admin: {
    group: 'Google Maps',
    components: {
      Label: '/lib/blocks/map-block/components/MapBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/map-block.jpg',
        alt: 'Map block - embedded Google Maps iframe',
      },
    },
  },
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
}
