import type { Block } from 'payload'

export const FinanceCalculatorBlock: Block = {
  slug: 'financeCalculatorBlock',
  interfaceName: 'FinanceCalculatorBlockType',
  labels: {
    singular: 'Finance Calculator Block',
    plural: 'Finance Calculator Blocks',
  },
  admin: {
    components: {
      Label: '/lib/blocks/finance-calculator-block/components/FinanceCalculatorBlockLabel',
    },
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      admin: {
        description: 'Optional heading displayed above the calculator.',
      },
    },
    {
      name: 'defaultPurchasePrice',
      type: 'number',
      label: 'Default Purchase Price',
      min: 0,
      admin: {
        description: 'Pre-fills the purchase price field (ZAR).',
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
}
