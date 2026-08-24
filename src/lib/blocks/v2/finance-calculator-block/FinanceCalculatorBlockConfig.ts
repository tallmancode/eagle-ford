import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const FinanceCalculatorV2Block: Block = {
  slug: 'financeCalculatorV2',
  labels: {
    singular: 'Finance Calculator (v2)',
    plural: 'Finance Calculators (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/finance-calculator-v2-block-icon.svg',
        alt: 'Finance Calculator (v2) icon',
      },
      thumbnail: {
        url: '/blocks/finance-calculator-v2-block-thumbnail.png',
        alt: 'Finance Calculator (v2) - loan calculator',
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
              name: 'defaultPurchasePrice',
              type: 'number',
              label: 'Default Purchase Price',
              min: 0,
              admin: {
                description: 'Pre-fills the purchase price field (ZAR). Rates come from Settings.',
              },
            },
            {
              name: 'disclaimer',
              type: 'textarea',
              label: 'Disclaimer',
              admin: {
                description: 'Optional legal or estimate disclaimer shown below the results.',
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
