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
          interfaceName: 'SettingsContactInfo',
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
          label: 'Analytics',
          name: 'analytics',
          interfaceName: 'AnalyticsSettings',
          fields: [
            {
              name: 'enableGoogleTagManager',
              label: 'Enable Google Tag Manager',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'Always loads the GTM container when enabled. Consent Mode still gates ads/analytics storage until the visitor accepts cookies (EU) or is auto-granted (non-EU).',
              },
            },
            {
              name: 'googleTagManagerId',
              label: 'Google Tag Manager Container ID',
              type: 'text',
              required: true,
              defaultValue: 'GTM-P2JCNCLC',
              admin: {
                description: 'The public GTM container ID in the format GTM-XXXXXXXX.',
              },
              validate: (value: string | null | undefined) => {
                if (!value) return 'Google Tag Manager Container ID is required.'

                return (
                  /^GTM-[A-Z0-9]+$/.test(value.trim()) ||
                  'Must be a valid Google Tag Manager container ID (e.g. GTM-ABC12345).'
                )
              },
            },
          ],
        },
        {
          label: 'Forms',
          fields: [
            {
              name: 'showroomQuoteForm',
              type: 'relationship',
              relationTo: 'forms',
              label: 'Showroom quote form',
              admin: {
                description:
                  'Used on live stock / showroom vehicle detail pages. Leave empty to hide the enquiry form.',
              },
            },
            {
              name: 'newVehicleQuoteForm',
              type: 'relationship',
              relationTo: 'forms',
              label: 'New vehicle quote form',
              admin: {
                description:
                  'Used on new vehicle and model pages under /vehicles. Leave empty to hide the enquiry form.',
              },
            },
          ],
        },
        {
          label: 'Email',
          name: 'email',
          interfaceName: 'EmailSettings',
          admin: {
            condition: (_data, _siblingData, { user }) => {
              return Boolean(user?.roles?.includes('admin') || user?.roles?.includes('developer'))
            },
            description:
              'Test Mimecast SMTP connectivity. Host, port, user, and password stay in server env (SMTP_*), not in the CMS.',
          },
          fields: [
            {
              name: 'testRecipient',
              label: 'Test recipient',
              type: 'email',
              admin: {
                description:
                  'Address that receives the SMTP test message. SMTP credentials are configured via SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in the server environment.',
              },
            },
            {
              type: 'ui',
              label: 'SMTP test',
              name: 'emailSmtpTest',
              admin: {
                components: {
                  Field: '@/lib/fields/email-test-send/EmailTestSendField#EmailTestSendField',
                },
              },
            },
            {
              name: 'lastTestAt',
              label: 'Last test at',
              type: 'date',
              admin: {
                readOnly: true,
                description: 'Updated when an admin runs Send test email',
                date: { pickerAppearance: 'dayAndTime' },
              },
            },
            {
              name: 'lastTestOk',
              label: 'Last test succeeded',
              type: 'checkbox',
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'lastTestSummary',
              label: 'Last test summary',
              type: 'textarea',
              admin: {
                readOnly: true,
              },
            },
          ],
        },
        {
          label: 'Motor City',
          name: 'motorCity',
          interfaceName: 'MotorCitySettings',
          admin: {
            condition: (_data, _siblingData, { user }) => {
              return Boolean(user?.roles?.includes('admin') || user?.roles?.includes('developer'))
            },
            description:
              'Test Eagle Motor City stock API connectivity. URL and API key stay in server env (MOTOR_CITY_STOCK_API_*), not in the CMS.',
          },
          fields: [
            {
              type: 'ui',
              label: 'Stock API test',
              name: 'motorCityStockTest',
              admin: {
                components: {
                  Field:
                    '@/lib/fields/motor-city-stock-test/MotorCityStockTestField#MotorCityStockTestField',
                },
              },
            },
            {
              name: 'lastTestAt',
              label: 'Last test at',
              type: 'date',
              admin: {
                readOnly: true,
                description: 'Updated when an admin runs Test Motor City stock API',
                date: { pickerAppearance: 'dayAndTime' },
              },
            },
            {
              name: 'lastTestOk',
              label: 'Last test succeeded',
              type: 'checkbox',
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'lastTestSummary',
              label: 'Last test summary',
              type: 'textarea',
              admin: {
                readOnly: true,
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
