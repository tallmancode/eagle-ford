import type { GroupField } from 'payload'
import { headingMarkupDescription } from '@/lib/blocks/heading-block/utils/headingMarkupDescription'
import { LinkField } from '@/lib/fields/link/LinkField'

export const waveHeroConfig: GroupField = {
  type: 'group',
  label: 'Wave Hero Content',
  name: 'waveHero',
  interfaceName: 'WaveHero',
  admin: {
    condition: (_data, siblingData, { blockData }) => {
      const template = blockData?.template ?? siblingData?.template
      return template === 'wave'
    },
  },
  fields: [
    {
      name: 'slides',
      type: 'array',
      label: 'Slides',
      minRows: 1,
      maxRows: 8,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Background Image',
          admin: {
            description: 'Recommended: 1920×1080px, WebP or JPEG.',
          },
        },
        {
          name: 'overlayColor',
          type: 'select',
          label: 'Overlay Color',
          defaultValue: 'secondary',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Dark', value: 'dark' },
            { label: 'Danger', value: 'danger' },
          ],
          admin: {
            description: 'Tint over the background image. Choose None to disable.',
          },
        },
        {
          name: 'overlayOpacity',
          type: 'number',
          label: 'Overlay Opacity',
          defaultValue: 30,
          min: 0,
          max: 100,
          admin: {
            condition: (_data, siblingData) => siblingData?.overlayColor !== 'none',
            description: 'Overlay strength (0–100). Set to 0 for no overlay.',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
          admin: {
            description: headingMarkupDescription,
          },
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Supporting line',
          admin: {
            description: headingMarkupDescription,
          },
        },
        LinkField({
          name: 'primaryLink',
          relationTo: ['pages'],
          label: 'Primary CTA',
        }),
      ],
    },
    {
      name: 'showWave',
      type: 'checkbox',
      label: 'Show Wave',
      defaultValue: true,
    },
    {
      name: 'autoPlay',
      type: 'checkbox',
      label: 'Auto-play',
      defaultValue: true,
    },
    {
      name: 'autoPlayInterval',
      type: 'number',
      label: 'Auto-play Interval (ms)',
      defaultValue: 5000,
      min: 2000,
      max: 15000,
      admin: {
        condition: (_data, siblingData) => siblingData?.autoPlay !== false,
        description: 'Time in milliseconds between slide transitions.',
        step: 500,
      },
    },
  ],
}
