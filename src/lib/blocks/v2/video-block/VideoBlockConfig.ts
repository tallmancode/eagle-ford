import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const VideoV2Block: Block = {
  slug: 'videoV2',
  labels: {
    singular: 'Video (v2)',
    plural: 'Videos (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/video-v2-block-icon.svg',
        alt: 'Video (v2) icon',
      },
      thumbnail: {
        url: '/blocks/video-v2-block-thumbnail.png',
        alt: 'Video (v2) - embedded video player',
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
              label: 'Video URL',
              required: true,
              admin: {
                description:
                  'YouTube, YouTube Shorts, or Vimeo URL (watch, share, or embed link).',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Accessible Title',
              admin: {
                description: 'Title for the video iframe. Defaults to “Video”.',
              },
            },
            {
              name: 'poster',
              type: 'upload',
              relationTo: 'media',
              label: 'Poster Image',
              admin: {
                description:
                  'Optional. Shown until the visitor plays the video (click-to-load). Leave empty to embed immediately.',
              },
            },
            {
              name: 'aspectRatio',
              type: 'select',
              label: 'Aspect Ratio',
              defaultValue: '16/9',
              options: [
                { label: '16:9 (widescreen)', value: '16/9' },
                { label: '4:3', value: '4/3' },
                { label: '1:1', value: '1/1' },
                { label: '9:16 (vertical / Shorts)', value: '9/16' },
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
