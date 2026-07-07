import type { Block } from 'payload'
import { BackgroundColorField } from '@/lib/fields/background-color/backgroundColorField'
import { LinkField } from '@/lib/fields/link/LinkField'

export const ContactInfoBlock: Block = {
  slug: 'contact-info',
  labels: {
    singular: 'Contact Info',
    plural: 'Contact Info',
  },
  admin: {
    images: {
      thumbnail: {
        url: '/blocks/contact-info-block.jpg',
        alt: 'Contact Info block - card with phone, email, address and directions',
      },
    },
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Get in Touch',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      label: 'Email Address',
      required: true,
    },
    {
      name: 'addressLine1',
      type: 'text',
      label: 'Address Line 1',
      required: true,
    },
    {
      name: 'addressLine2',
      type: 'text',
      label: 'Address Line 2',
    },
    {
      name: 'businessHours',
      type: 'array',
      label: 'Business Hours',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Day / Range',
          required: true,
        },
        {
          name: 'hours',
          type: 'text',
          label: 'Hours',
          required: true,
        },
      ],
    },
    {
      name: 'ctaButtons',
      type: 'array',
      label: 'CTA Buttons',
      maxRows: 2,
      fields: [LinkField({ name: 'link', relationTo: ['pages'], label: 'Button' })],
    },
    {
      type: 'collapsible',
      label: 'Style',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          ...BackgroundColorField(),
          defaultValue: 'card',
        },
        {
          name: 'border',
          type: 'select',
          label: 'Border',
          defaultValue: 'default',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Default', value: 'default' },
          ],
        },
      ],
    },
  ],
}
