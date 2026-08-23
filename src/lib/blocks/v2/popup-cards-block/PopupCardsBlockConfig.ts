import type { Block } from 'payload'
import { blockRichTextEditor } from '@/lib/blocks/rich-text-block/blockRichTextEditor'
import { LucideIconField } from '@/lib/fields/lucide-icons'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const PopupCardsV2Block: Block = {
  slug: 'popupCardsV2',
  labels: {
    singular: 'Popup Cards (v2)',
    plural: 'Popup Cards (v2)',
  },
  admin: {
    group: 'Cards',
    images: {
      icon: {
        url: '/blocks/popup-cards-v2-block-icon.svg',
        alt: 'Popup Cards (v2) icon',
      },
      thumbnail: {
        url: '/blocks/popup-cards-v2-block-thumbnail.png',
        alt: 'Popup Cards (v2) - image cards with dialog popups',
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
              type: 'radio',
              label: 'Columns',
              defaultValue: '3',
              options: [
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
              ],
              admin: { layout: 'horizontal' },
            },
            {
              name: 'cards',
              type: 'array',
              label: 'Cards',
              minRows: 1,
              required: true,
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
                    description: 'Leave empty to use the media library alt text.',
                  },
                },
                LucideIconField({ required: false }),
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
                {
                  name: 'buttonLabel',
                  type: 'text',
                  label: 'Button Label',
                  defaultValue: 'Find Out More',
                  required: true,
                },
                {
                  name: 'popupTitle',
                  type: 'text',
                  label: 'Popup Title',
                  required: true,
                },
                {
                  name: 'popupSubtitle',
                  type: 'text',
                  label: 'Popup Subtitle',
                },
                {
                  name: 'popupBody',
                  type: 'richText',
                  label: 'Popup Body',
                  editor: blockRichTextEditor,
                  admin: {
                    description: 'Main popup content. Use headings and lists in the rich text editor.',
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
