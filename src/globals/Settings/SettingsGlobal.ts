import type { GlobalConfig } from 'payload'
import { revalidateGlobalSettings } from '@/globals/Settings/hooks/revalidateGlobalSettings'
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
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobalSettings],
  },
}
