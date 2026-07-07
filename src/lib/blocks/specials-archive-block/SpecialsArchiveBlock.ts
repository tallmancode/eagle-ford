import type { Block } from 'payload'

export const SpecialsArchiveBlock: Block = {
  slug: 'specials-archive',
  interfaceName: 'SpecialsArchive',
  labels: {
    singular: 'Specials Archive',
    plural: 'Specials Archive',
  },
  admin: {
    group: 'Archives',
    components: {
      Label: '/lib/blocks/specials-archive-block/components/SpecialsArchiveBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/contact-footer-block.jpg',
        alt: 'Contact Footer block - footer strip with address and hours',
      },
    },
  },
  fields: [],
}
