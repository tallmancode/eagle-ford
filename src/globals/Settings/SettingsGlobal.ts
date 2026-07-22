import type { GlobalConfig } from 'payload'
import { revalidateGlobalSettings } from '@/globals/Settings/hooks/revalidateGlobalSettings'
import {
  DEFAULT_DEPOSIT_AMOUNT,
  DEFAULT_INTEREST_RATE_NUMBER,
  DEFAULT_PAYMENT_TERM,
  MAX_BALLOON_PERCENT,
  REPAYMENT_PERIOD_OPTIONS,
} from '@/lib/blocks/finance-calculator-block/financeCalculatorOptions'
import { isAdmin } from '@/lib/utils/accessUtil'
import AddressField from '@/lib/fields/address-field/AddressField'

export const SettingsGlobal: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
    update: isAdmin,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact Information',
          name: 'contactInfo',
          interfaceName: 'ContactInfo',
          fields: [
            {
              name: 'email',
              label: 'Email Address',
              type: 'text',
              validate: (value: string | null | undefined) => {
                if (!value) return true
                const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                return (
                  pattern.test(value) || 'Must be a valid email address (e.g. info@example.com)'
                )
              },
            },
            {
              name: 'phone',
              label: 'Phone Number',
              type: 'text',
              validate: (value: string | null | undefined) => {
                if (!value) return true
                const pattern = /^\+?[\d\s\-().]{7,20}$/
                return pattern.test(value) || 'Must be a valid phone number (e.g. +27 11 123 4567)'
              },
            },
            {
              name: 'operationHours',
              label: 'Operating Hours',
              type: 'text',
              admin: {
                description: 'e.g. Mon – Fri: 08:00 – 17:00 & Sat: 08:00 – 12:30',
              },
            },
            AddressField(),
          ],
        },
        {
          label: 'Pricing Calculator',
          name: 'pricingCalculatorDefaults',
          interfaceName: 'PricingCalculatorDefaults',
          fields: [
            {
              name: 'depositAmount',
              label: 'Deposit Amount',
              type: 'number',
              min: 0,
              defaultValue: DEFAULT_DEPOSIT_AMOUNT,
              admin: {
                description: 'Default deposit in Rands for finance calculators.',
              },
            },
            {
              name: 'interestRate',
              label: 'Interest Rate',
              type: 'number',
              min: 0,
              defaultValue: DEFAULT_INTEREST_RATE_NUMBER,
              admin: {
                description: 'Default annual interest rate (%) for finance calculators.',
                step: 0.01,
              },
            },
            {
              name: 'balloonPayment',
              label: 'Balloon Payment',
              type: 'number',
              min: 0,
              max: MAX_BALLOON_PERCENT,
              defaultValue: 0,
              admin: {
                description: `Default balloon payment (%) for finance calculators. Maximum ${MAX_BALLOON_PERCENT}%.`,
                step: 0.01,
              },
            },
            {
              name: 'repaymentPeriod',
              label: 'Repayment Period',
              type: 'select',
              defaultValue: String(DEFAULT_PAYMENT_TERM),
              options: REPAYMENT_PERIOD_OPTIONS.map((months) => ({
                label: `${months} months`,
                value: String(months),
              })),
              admin: {
                description: 'Default repayment period for finance calculators.',
              },
            },
          ],
        },
        {
          label: 'Data Seeds',
          admin: {
            condition: (_data, _siblingData, { user }) => {
              return Boolean(user?.roles?.includes('developer'))
            },
          },
          fields: [
            {
              type: 'ui',
              label: 'Seeds',
              name: 'seedsDisplay',
              admin: {
                components: {
                  Field: '@/lib/fields/seed-buttons/SeedButtonsComponent#SeedButtonsComponent',
                },
              },
            },
          ],
        },
        {
          label: 'Media',
          admin: {
            condition: (_data, _siblingData, { user }) => {
              return Boolean(user?.roles?.includes('developer'))
            },
          },
          fields: [
            {
              type: 'ui',
              label: 'Media cleanup',
              name: 'mediaCleanupDisplay',
              admin: {
                components: {
                  Field: '@/lib/fields/media-cleanup/MediaCleanupComponent#MediaCleanupComponent',
                },
              },
            },
          ],
        },
        {
          label: 'Cache',
          admin: {
            condition: (_data, _siblingData, { user }) => {
              return Boolean(user?.roles?.includes('developer'))
            },
          },
          fields: [
            {
              type: 'ui',
              label: 'Cache bust',
              name: 'cacheBustDisplay',
              admin: {
                components: {
                  Field: '@/lib/fields/cache-bust/CacheBustComponent#CacheBustComponent',
                },
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobalSettings],
  },
}
