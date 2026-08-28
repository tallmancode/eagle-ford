import type { Block } from 'payload'
import { ColorField } from '@/lib/blocks/v2/fields/color'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const AutoLoanCalculatorV2Block: Block = {
  slug: 'autoLoanCalculatorV2',
  labels: {
    singular: 'Auto Loan Calculator (v2)',
    plural: 'Auto Loan Calculators (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/auto-loan-calculator-v2-block-icon.svg',
        alt: 'Auto Loan Calculator (v2) icon',
      },
      thumbnail: {
        url: '/blocks/auto-loan-calculator-v2-block-thumbnail.png',
        alt: 'Auto Loan Calculator (v2) - split image and loan form',
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
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Side image',
              required: true,
              admin: {
                description: 'Lifestyle image on the left of the calculator panel.',
              },
            },
            {
              name: 'imageAlt',
              type: 'text',
              label: 'Image alt text',
            },
            {
              name: 'heading',
              type: 'text',
              label: 'Heading',
              required: true,
              defaultValue: 'Auto Loan Calculator',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              defaultValue:
                'Use this car payment calculator to estimate monthly payments on your next new or used auto loan.',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'defaultPrice',
                  type: 'number',
                  label: 'Default price (ZAR)',
                  min: 0,
                  defaultValue: 350000,
                  admin: { width: '50%' },
                },
                {
                  name: 'defaultInterestRate',
                  type: 'number',
                  label: 'Default interest rate (%)',
                  min: 0,
                  defaultValue: 11.75,
                  admin: {
                    width: '50%',
                    description: 'Annual interest rate. Leave empty to use Settings when available.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'defaultTermYears',
                  type: 'number',
                  label: 'Default loan term (years)',
                  min: 1,
                  max: 10,
                  defaultValue: 5,
                  admin: { width: '50%' },
                },
                {
                  name: 'defaultDownPayment',
                  type: 'number',
                  label: 'Default down payment (ZAR)',
                  min: 0,
                  defaultValue: 35000,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'calculateLabel',
              type: 'text',
              label: 'Calculate button label',
              defaultValue: 'Calculate',
            },
            {
              name: 'disclaimer',
              type: 'textarea',
              label: 'Disclaimer',
              admin: {
                description: 'Shown under the estimated monthly repayment.',
              },
            },
            {
              name: 'mediaSide',
              type: 'select',
              label: 'Image side',
              defaultValue: 'left',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
            },
          ],
        },
        {
          label: 'Appearance',
          fields: [
            ColorField({
              name: 'panelColor',
              label: 'Form panel background',
              defaultToken: 'foreground',
            }),
            ColorField({
              name: 'buttonColor',
              label: 'Calculate button color',
              defaultToken: 'primary',
            }),
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
