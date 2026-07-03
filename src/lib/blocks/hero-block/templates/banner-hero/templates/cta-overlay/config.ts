import type { GroupField } from 'payload'

const buttonIconOptions = [
  { label: 'None', value: 'none' },
  { label: 'Phone', value: 'phone' },
  { label: 'Mail', value: 'mail' },
  { label: 'Map Pin', value: 'map-pin' },
  { label: 'Clock', value: 'clock' },
  { label: 'Arrow Right', value: 'arrow-right' },
]

const buttonFields: GroupField['fields'] = [
  {
    name: 'label',
    type: 'text',
    label: 'Label',
  },
  {
    name: 'href',
    type: 'text',
    label: 'Link (href)',
    admin: {
      description: 'e.g. tel:0105971555 or mailto:service@eagleford.co.za or /contact',
    },
  },
  {
    name: 'icon',
    type: 'select',
    label: 'Icon',
    defaultValue: 'none',
    options: buttonIconOptions,
  },
]

export const ctaOverlayBannerConfig: GroupField = {
  type: 'group',
  label: 'CTA Overlay Banner Content',
  name: 'ctaOverlayContent',
  interfaceName: 'CtaOverlayBanner',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.bannerTemplate === 'cta-overlay'),
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Banner Image',
      admin: {
        description: 'Recommended: wide format (e.g. 1920×600px), WebP or JPEG.',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow Text',
      admin: {
        description:
          'Small uppercase label above the heading (e.g. "Eagle Ford — Service Centre").',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
    },
    {
      name: 'primaryButton',
      type: 'group',
      label: 'Primary Button',
      fields: buttonFields,
    },
    {
      name: 'secondaryButton',
      type: 'group',
      label: 'Secondary Button',
      fields: buttonFields,
    },
  ],
}
