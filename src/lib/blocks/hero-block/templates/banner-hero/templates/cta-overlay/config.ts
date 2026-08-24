import type { GroupField } from 'payload'
import { ColorField } from '@/lib/blocks/v2/fields/color'

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
    ColorField({
      name: 'eyebrowColor',
      label: 'Eyebrow Text Color',
      description: 'Leave empty to keep the default soft white eyebrow colour.',
    }),
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
    },
    ColorField({
      name: 'headingColor',
      label: 'Heading Color',
      description: 'Leave empty to keep the default white heading colour.',
    }),
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
    },
    ColorField({
      name: 'subheadingColor',
      label: 'Subheading Color',
      description: 'Leave empty to keep the default soft white subheading colour.',
    }),
    ColorField({
      name: 'overlayColor',
      label: 'Overlay Color',
      description:
        'Tint colour over the banner image. Leave empty (with Overlay Opacity empty) to keep the default left-to-right dark gradient.',
    }),
    {
      name: 'overlayOpacity',
      type: 'number',
      label: 'Overlay Opacity',
      min: 0,
      max: 100,
      admin: {
        description:
          'How strong the overlay is, from 0 (transparent) to 100 (solid). When Overlay Color is set and this is empty, defaults to 60. Setting either overlay field replaces the default gradient with a flat tint.',
      },
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
