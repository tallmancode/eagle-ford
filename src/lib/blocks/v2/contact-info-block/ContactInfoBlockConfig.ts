import type { Block } from 'payload'
import { LinkField } from '@/lib/fields/link/LinkField'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const ContactInfoV2Block: Block = {
  slug: 'contactInfoV2',
  labels: {
    singular: 'Contact Info (v2)',
    plural: 'Contact Info (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/contact-info-v2-block-icon.svg',
        alt: 'Contact Info (v2) icon',
      },
      thumbnail: {
        url: '/blocks/contact-info-v2-block-thumbnail.png',
        alt: 'Contact Info (v2) - phone, email, address and hours',
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
              name: 'showBorder',
              type: 'checkbox',
              label: 'Show border',
              defaultValue: true,
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
