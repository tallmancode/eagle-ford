import type { Block } from 'payload'
import { blockRichTextEditor } from '@/lib/blocks/rich-text-block/blockRichTextEditor'
import { LucideIconField } from '@/lib/fields/lucide-icons'

const popupSectionStyleOptions = [
  { label: 'Text', value: 'text' },
  { label: 'Check List', value: 'checkList' },
  { label: 'Numbered List', value: 'numberedList' },
  { label: 'Rich Text', value: 'richText' },
]

export const PopupCardsBlock: Block = {
  slug: 'popup-cards',
  interfaceName: 'PopupCards',
  labels: {
    singular: 'Popup Cards',
    plural: 'Popup Cards',
  },
  admin: {
    group: 'Cards',
    components: {
      Label: '/lib/blocks/popup-cards-block/components/PopupCardsBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/popup-cards-block.jpg',
        alt: 'Popup Cards block - image cards with dialog popups',
      },
    },
  },
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
      admin: {
        layout: 'horizontal',
      },
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
            description:
              'Override the alt text from the media library. Leave empty to use the media alt text.',
          },
        },
        LucideIconField(),
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
          name: 'popupIntro',
          type: 'textarea',
          label: 'Popup Intro',
          admin: {
            description: 'Optional paragraph shown before popup sections.',
          },
        },
        {
          name: 'popupSections',
          type: 'array',
          label: 'Popup Sections',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Section Label',
            },
            {
              name: 'style',
              type: 'select',
              label: 'Style',
              defaultValue: 'text',
              required: true,
              options: popupSectionStyleOptions,
            },
            {
              name: 'text',
              type: 'textarea',
              label: 'Text',
              admin: {
                condition: (_, siblingData) => siblingData?.style === 'text',
              },
            },
            {
              name: 'items',
              type: 'array',
              label: 'List Items',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  label: 'Item',
                  required: true,
                },
              ],
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.style === 'checkList' || siblingData?.style === 'numberedList',
              },
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Content',
              editor: blockRichTextEditor,
              admin: {
                condition: (_, siblingData) => siblingData?.style === 'richText',
              },
            },
            {
              name: 'showDivider',
              type: 'checkbox',
              label: 'Show Divider',
              defaultValue: false,
              admin: {
                description: 'Adds a top border before this section.',
              },
            },
          ],
        },
      ],
    },
  ],
}
