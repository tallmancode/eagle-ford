import type { Block, JSONField } from 'payload'
import { ColorField } from '@/lib/blocks/v2/fields/color'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'
import { typographyAtomicV2Refs } from '@/lib/blocks/v2/typography-block-refs'
import { LinkField } from '@/lib/fields/link/LinkField'

function hiddenColorField(
  options: Parameters<typeof ColorField>[0],
): JSONField {
  const field = ColorField(options)
  return {
    ...field,
    admin: {
      ...field.admin,
      hidden: true,
    },
  }
}

export const OverlapMediaStoryV2Block: Block = {
  slug: 'overlapMediaStoryV2',
  labels: {
    singular: 'Overlap Media Story (v2)',
    plural: 'Overlap Media Stories (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/overlap-media-story-v2-block-icon.svg',
        alt: 'Overlap Media Story (v2) icon',
      },
      thumbnail: {
        url: '/blocks/overlap-media-story-v2-block-thumbnail.png',
        alt: 'Overlap Media Story (v2) - layered images with accent shape and copy',
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
              name: 'primaryImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Primary Image',
              required: true,
              admin: {
                description: 'Large landscape image on the collage side.',
              },
            },
            {
              name: 'primaryAlt',
              type: 'text',
              label: 'Primary Alt Text',
              admin: {
                description:
                  'Override the alt text from the media library. Leave empty to use the media alt text.',
              },
            },
            {
              name: 'secondaryImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Secondary Image',
              required: true,
              admin: {
                description: 'Square image that overlaps the top of the primary image.',
              },
            },
            {
              name: 'secondaryAlt',
              type: 'text',
              label: 'Secondary Alt Text',
              admin: {
                description:
                  'Override the alt text from the media library. Leave empty to use the media alt text.',
              },
            },
            ColorField({
              name: 'accentColor',
              label: 'Accent Shape Color',
              defaultToken: 'warning',
            }),
            {
              type: 'blocks',
              name: 'content',
              label: 'Copy',
              admin: {
                initCollapsed: true,
                description:
                  'Add Heading, Button, Button Group, Heading Text, Subheading, Rich Text, or Spacer blocks for the copy column. Use Button Group to place buttons side by side.',
              },
              blocks: [],
              // Do not include wrapperV2/columnV2/sectionV2 — those already nest this
              // block, and a cycle overflows Payload on init.
              blockReferences: [
                'headingV2',
                'buttonV2',
                'buttonGroupV2',
                ...typographyAtomicV2Refs,
                'richTextV2',
                'spacerV2',
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'textAlign',
                  type: 'select',
                  label: 'Text Alignment',
                  defaultValue: 'left',
                  options: [
                    { label: 'Left', value: 'left' },
                    { label: 'Right', value: 'right' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'contentSide',
                  type: 'select',
                  label: 'Copy Side',
                  defaultValue: 'right',
                  options: [
                    { label: 'Right (images left)', value: 'right' },
                    { label: 'Left (images right)', value: 'left' },
                  ],
                  admin: {
                    width: '50%',
                    description: 'Which side the nested copy blocks appear on.',
                  },
                },
              ],
            },
            {
              name: 'heading',
              type: 'textarea',
              label: 'Heading',
              admin: { hidden: true },
            },
            hiddenColorField({
              name: 'headingColor',
              label: 'Heading Color',
              defaultToken: 'foreground',
            }),
            {
              name: 'body',
              type: 'textarea',
              label: 'Body',
              admin: { hidden: true },
            },
            hiddenColorField({
              name: 'bodyColor',
              label: 'Body Color',
              defaultToken: 'muted',
            }),
            {
              type: 'group',
              name: 'cta',
              label: 'Call to Action (optional)',
              admin: { hidden: true },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Button Label',
                },
                LinkField({
                  name: 'link',
                  relationTo: ['pages'],
                  includeLabel: false,
                  label: 'Link',
                }),
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
