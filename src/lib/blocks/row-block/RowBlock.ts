import type { Block } from 'payload'
import { blockRefs } from '@/lib/blocks/section-block/blockRefs'
import { LayoutField } from '@/lib/fields/layout-field'
import { AccessibilityFields } from '@/lib/fields/accessibility/AccessibilityFields'
import { BackgroundColorField } from '@/lib/fields/background-color/backgroundColorField'

export const RowBlock: Block = {
  slug: 'row',
  interfaceName: 'Row',
  labels: {
    singular: 'Row',
    plural: 'Rows',
  },
  admin: {
    group: 'Block Wrappers',
    components: {
      Label: '/lib/blocks/row-block/components/RowBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/row-block.jpg',
        alt: 'Row block - horizontal layout for blocks such as CTA buttons',
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
              blockReferences: blockRefs(['row', 'section', 'sectionInner']),
            },
          ],
        },
        {
          label: 'Layout',
          fields: [
            BackgroundColorField(),
            {
              name: 'container',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'align',
              type: 'select',
              label: 'Horizontal Alignment',
              defaultValue: 'left',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
            },
            {
              name: 'verticalAlign',
              type: 'select',
              label: 'Vertical Alignment',
              defaultValue: 'center',
              options: [
                { label: 'Top', value: 'top' },
                { label: 'Center', value: 'center' },
                { label: 'Bottom', value: 'bottom' },
              ],
            },
            {
              name: 'gap',
              type: 'select',
              label: 'Gap',
              defaultValue: 'md',
              options: [
                { label: 'Small', value: 'sm' },
                { label: 'Medium', value: 'md' },
                { label: 'Large', value: 'lg' },
              ],
            },
            {
              name: 'wrap',
              type: 'checkbox',
              label: 'Wrap',
              defaultValue: true,
              admin: {
                description: 'Allow items to wrap onto the next line on smaller screens.',
              },
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
