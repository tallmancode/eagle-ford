import type { Block } from 'payload'
import { headingOptions } from '@/lib/blocks/heading-block/headingOptions'
import { standardHeadingConfig } from '@/lib/blocks/heading-block/templates/standard-heading/config'
import { dashHeadingConfig } from '@/lib/blocks/heading-block/templates/dash-heading/config'
import { separatorHeadingConfig } from '@/lib/blocks/heading-block/templates/seperator-heading/config'
import { swipeHeadingConfig } from '@/lib/blocks/heading-block/templates/swipe-heading/config'

export const HeadingBlock: Block = {
  slug: 'heading',
  labels: {
    singular: 'Heading',
    plural: 'Headings',
  },
  admin: {
    group: 'Text',
    components: {
      Label: '/lib/blocks/heading-block/components/HeadingBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/heading-block-thumbnail.png',
        alt: 'Heading block - eyebrow tag, heading and subheading',
      },
    },
  },
  fields: [
    {
      type: 'select',
      name: 'template',
      label: 'Template',
      options: headingOptions,
      required: true,
    },
    standardHeadingConfig,
    dashHeadingConfig,
    separatorHeadingConfig,
    swipeHeadingConfig,
  ],
}
