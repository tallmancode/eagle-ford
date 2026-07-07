import type { Block } from 'payload'
import { blockRefs } from '@/lib/blocks/section-block/blockRefs'
import { LayoutField } from '@/lib/fields/layout-field'
import { AccessibilityFields } from '@/lib/fields/accessibility/AccessibilityFields'
import { BackgroundColorField } from '@/lib/fields/background-color/backgroundColorField'
import { SectionBackgroundStyleField } from '@/lib/blocks/section-block/sectionBackgroundStyleField'

/**
 * Flat section wrapper for nested layouts. Only this block may contain Row blocks.
 * Does not allow 'section' or 'sectionInner' to prevent circular blockReferences.
 */
export const SectionInnerBlock: Block = {
  slug: 'sectionInner',
  labels: {
    singular: 'Section (Inner)',
    plural: 'Sections (Inner)',
  },
  admin: {
    group: 'Block Wrappers',
    components: {
      Label: '/lib/blocks/section-block/components/SectionBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/section-inner-block-thumbnail.png',
        alt: 'Section Inner block - nested section wrapper for row layouts',
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
              },
              blocks: [],
              blockReferences: ['row', ...blockRefs(['section', 'sectionInner'])],
            },
          ],
        },
        {
          label: 'Layout',
          fields: [
            BackgroundColorField(),
            SectionBackgroundStyleField(),
            {
              name: 'container',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'verticalAlign',
              type: 'select',
              label: 'Vertical Alignment',
              defaultValue: 'top',
              admin: {
                description:
                  'Aligns content vertically within the block. Most effective when used inside a Row block.',
              },
              options: [
                { label: 'Top', value: 'top' },
                { label: 'Center', value: 'center' },
                { label: 'Bottom', value: 'bottom' },
              ],
            },
            LayoutField({ name: 'layout', label: false }),
          ],
        },
        {
          label: 'Accessibility',
          name: 'accessibility',
          fields: AccessibilityFields({ landmarkDefault: '' }),
        },
      ],
    },
  ],
}
