import type { Block } from 'payload'
import { blockRefs } from '@/lib/blocks/section-block/blockRefs'
import { LayoutField } from '@/lib/fields/layout-field'
import { AccessibilityFields } from '@/lib/fields/accessibility/AccessibilityFields'
import { BackgroundColorField } from '@/lib/fields/background-color/backgroundColorField'
import { SectionBackgroundStyleField } from '@/lib/blocks/section-block/sectionBackgroundStyleField'

export const SectionBlock: Block = {
  slug: 'section',
  labels: {
    singular: 'Section',
    plural: 'Sections',
  },
  admin: {
    components: {
      Label: '/lib/blocks/section-block/components/SectionBlockLabel',
    },
    images: {
      thumbnail: '/blocks/section-block.jpg',
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
              blockReferences: ['sectionInner', ...blockRefs()],
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
              defaultValue: true,
            },
            {
              name: 'gridCols',
              type: 'radio',
              label: 'Grid Columns',
              defaultValue: '1',
              options: [
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
              ],
              admin: {
                layout: 'horizontal',
              },
            },
            {
              name: 'showDivider',
              type: 'checkbox',
              label: 'Show Divider',
              defaultValue: false,
              admin: {
                description: 'Adds a vertical divider between columns.',
                condition: (data) => Boolean(data?.gridCols && data.gridCols !== '1'),
              },
            },
            {
              name: 'dividerColor',
              type: 'select',
              label: 'Divider Color',
              defaultValue: 'primary',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Neutral', value: 'neutral' },
              ],
              admin: {
                condition: (data) =>
                  Boolean(data?.gridCols && data.gridCols !== '1' && data?.showDivider === true),
              },
            },
            LayoutField({ name: 'layout', label: false }),
          ],
        },
        {
          label: 'Accessibility',
          name: 'accessibility',
          fields: AccessibilityFields(),
        },
      ],
    },
  ],
}
