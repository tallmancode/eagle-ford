import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const ImageV2Block: Block = {
  slug: 'imageV2',
  labels: {
    singular: 'Image (v2)',
    plural: 'Images (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/image-v2-block-icon.svg',
        alt: 'Image (v2) icon',
      },
      thumbnail: {
        url: '/blocks/image-v2-block-thumbnail.png',
        alt: 'Image (v2) - media with optional caption and link',
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
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Image',
              required: true,
            },
            {
              name: 'alt',
              type: 'text',
              label: 'Alt Text',
              admin: {
                description:
                  'Override the alt text from the media library. Leave empty to use the media alt text.',
              },
            },
            {
              name: 'caption',
              type: 'text',
              label: 'Caption',
              admin: {
                description: 'Optional caption shown below the image.',
              },
            },
            {
              name: 'linkUrl',
              type: 'text',
              label: 'Link URL',
              admin: {
                description: 'Optional. Makes the image clickable (e.g. /contact or https://…).',
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open link in new tab',
              defaultValue: false,
              admin: {
                condition: (_data, siblingData) => Boolean(siblingData?.linkUrl),
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'cornerRadius',
                  type: 'select',
                  label: 'Corner Radius',
                  defaultValue: '2xl',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Small', value: 'sm' },
                    { label: 'Medium', value: 'md' },
                    { label: 'Large', value: 'lg' },
                    { label: 'XL', value: 'xl' },
                    { label: '2XL', value: '2xl' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'aspectRatio',
                  type: 'select',
                  label: 'Aspect Ratio',
                  defaultValue: '4/3',
                  options: [
                    { label: 'Auto (natural dimensions)', value: 'auto' },
                    { label: '1:1', value: '1/1' },
                    { label: '4:3', value: '4/3' },
                    { label: '3:2', value: '3/2' },
                    { label: '16:9', value: '16/9' },
                    { label: '21:9', value: '21/9' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'shadow',
                  type: 'select',
                  label: 'Shadow',
                  defaultValue: 'lg',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Small', value: 'sm' },
                    { label: 'Medium', value: 'md' },
                    { label: 'Large', value: 'lg' },
                  ],
                  admin: { width: '33%' },
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
