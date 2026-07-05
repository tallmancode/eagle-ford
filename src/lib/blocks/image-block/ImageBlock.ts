import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'image-block',
  interfaceName: 'ImageBlock',
  labels: {
    singular: 'Image',
    plural: 'Images',
  },
  admin: {
    components: {
      Label: '/lib/blocks/image-block/components/ImageBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/image-block.jpg',
        alt: 'Image block - single photo with rounded corners and shadow',
      },
    },
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      required: true,
      admin: {},
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
      type: 'collapsible',
      label: 'Style',
      admin: {
        initCollapsed: false,
      },
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
        },
      ],
    },
  ],
}
