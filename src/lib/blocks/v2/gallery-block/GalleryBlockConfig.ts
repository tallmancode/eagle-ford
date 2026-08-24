import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const GalleryV2Block: Block = {
  slug: 'galleryV2',
  labels: {
    singular: 'Gallery (v2)',
    plural: 'Galleries (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/gallery-v2-block-icon.svg',
        alt: 'Gallery (v2) icon',
      },
      thumbnail: {
        url: '/blocks/gallery-v2-block-thumbnail.png',
        alt: 'Gallery (v2) - image grid with lightbox',
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
              name: 'images',
              type: 'array',
              label: 'Images',
              minRows: 1,
              required: true,
              admin: {
                description: 'Clicking an image opens it in a lightbox.',
              },
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
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Caption',
                },
              ],
            },
            {
              name: 'columns',
              type: 'select',
              label: 'Columns',
              defaultValue: '3',
              options: [
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
              ],
              admin: {
                description: 'Number of columns on large screens. Smaller screens stack automatically.',
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
