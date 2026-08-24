import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const ContactFooterV2Block: Block = {
  slug: 'contactFooterV2',
  labels: {
    singular: 'Contact Footer (v2)',
    plural: 'Contact Footers (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/contact-footer-v2-block-icon.svg',
        alt: 'Contact Footer (v2) icon',
      },
      thumbnail: {
        url: '/blocks/contact-footer-v2-block-thumbnail.png',
        alt: 'Contact Footer (v2) - address, phone and hours strip',
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
              name: 'addressSource',
              type: 'radio',
              label: 'Address',
              defaultValue: 'settings',
              options: [
                { label: 'Use Settings', value: 'settings' },
                { label: 'Override', value: 'override' },
              ],
              admin: { layout: 'horizontal' },
            },
            {
              name: 'addressOverride',
              type: 'text',
              label: 'Address Override',
              admin: {
                condition: (_data, siblingData) => siblingData?.addressSource === 'override',
              },
            },
            {
              name: 'hoursSource',
              type: 'radio',
              label: 'Hours',
              defaultValue: 'settings',
              options: [
                { label: 'Use Settings', value: 'settings' },
                { label: 'Override', value: 'override' },
              ],
              admin: { layout: 'horizontal' },
            },
            {
              name: 'hoursOverride',
              type: 'text',
              label: 'Hours Override',
              admin: {
                condition: (_data, siblingData) => siblingData?.hoursSource === 'override',
              },
            },
            {
              name: 'phoneSource',
              type: 'radio',
              label: 'Phone',
              defaultValue: 'settings',
              options: [
                { label: 'Use Settings', value: 'settings' },
                { label: 'Override', value: 'override' },
              ],
              admin: { layout: 'horizontal' },
            },
            {
              name: 'phoneOverride',
              type: 'text',
              label: 'Phone Override',
              admin: {
                condition: (_data, siblingData) => siblingData?.phoneSource === 'override',
              },
              validate: (value: string | null | undefined) => {
                if (!value) return true
                const pattern = /^\+?[\d\s\-().]{7,20}$/
                return pattern.test(value) || 'Must be a valid phone number (e.g. +27 11 123 4567)'
              },
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
