import type { Block } from 'payload'

export const ContactFooterBlock: Block = {
  slug: 'contact-footer',
  interfaceName: 'ContactFooter',
  labels: {
    singular: 'Contact Footer',
    plural: 'Contact Footers',
  },
  admin: {
    components: {
      Label: '/lib/blocks/contact-footer-block/components/ContactFooterBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/contact-footer-block.jpg',
        alt: 'Contact Footer block - footer strip with address and hours',
      },
    },
  },
  fields: [
    {
      name: 'addressOverride',
      type: 'text',
      label: 'Address Override',
      admin: {
        description: 'Leave blank to use Settings → Contact Information address.',
      },
    },
    {
      name: 'hoursOverride',
      type: 'text',
      label: 'Hours Override',
      admin: {
        description: 'Leave blank to use Settings → Contact Information operating hours.',
      },
    },
    {
      name: 'phoneOverride',
      type: 'text',
      label: 'Phone Override',
      admin: {
        description: 'Leave blank to use Settings → Contact Information phone.',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        const pattern = /^\+?[\d\s\-().]{7,20}$/
        return pattern.test(value) || 'Must be a valid phone number (e.g. +27 11 123 4567)'
      },
    },
  ],
}
