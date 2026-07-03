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
  },
  fields: [],
}
