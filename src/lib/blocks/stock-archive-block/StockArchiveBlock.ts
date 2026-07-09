import type { Block } from 'payload'

export const StockArchiveBlock: Block = {
  slug: 'stock-archive',
  interfaceName: 'StockArchive',
  labels: {
    singular: 'Stock Archive',
    plural: 'Stock Archive',
  },
  admin: {
    group: 'Archives',
    components: {
      Label: '/lib/blocks/stock-archive-block/components/StockArchiveBlockLabel',
    },
  },
  fields: [
    {
      type: 'text',
      name: 'heading',
      label: 'Heading',
      defaultValue: 'Our Showroom',
    },
    {
      type: 'select',
      name: 'conditionFilter',
      label: 'Condition Filter',
      defaultValue: 'all',
      options: [
        { label: 'All', value: 'all' },
        { label: 'New', value: 'new' },
        { label: 'Pre-owned', value: 'pre-owned' },
      ],
    },
    {
      type: 'number',
      name: 'limit',
      label: 'Vehicles per Page',
      defaultValue: 12,
      min: 1,
      max: 100,
    },
    {
      type: 'checkbox',
      name: 'showPagination',
      label: 'Show Pagination',
      defaultValue: true,
    },
    {
      type: 'text',
      name: 'enquireUrl',
      label: 'Enquire URL',
      defaultValue: '/contact',
      admin: {
        description: 'Internal path (e.g. /contact), tel:, or mailto: link for card CTA buttons.',
      },
    },
  ],
}
