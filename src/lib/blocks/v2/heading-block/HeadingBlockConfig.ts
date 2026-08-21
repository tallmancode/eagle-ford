import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'
import { typographyAtomicV2Refs } from '@/lib/blocks/v2/typography-block-refs'

export const HeadingV2Block: Block = {
  slug: 'headingV2',
  labels: {
    singular: 'Heading (v2)',
    plural: 'Headings (v2)',
  },
  admin: {
    group: 'Typography',
    components: {
      Label: '/lib/blocks/v2/heading-block/components/HeadingV2BlockLabel#HeadingV2BlockLabel',
    },
    images: {
      icon: {
        url: '/blocks/heading-v2-block-icon.svg',
        alt: 'Heading (v2) icon',
      },
      thumbnail: {
        url: '/blocks/heading-v2-block-thumbnail.png',
        alt: 'Heading (v2) - eyebrow, heading and subheading composition',
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
              type: 'blocks',
              name: 'content',
              label: false,
              admin: {
                initCollapsed: true,
                description:
                  'Stack Eyebrow, Heading Text, and Subheading blocks in any order. Use the individual Typography blocks outside this composition when you need them alone.',
              },
              blocks: [],
              blockReferences: typographyAtomicV2Refs,
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
