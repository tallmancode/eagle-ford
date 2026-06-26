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
            AddressField(),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobalSettings],
  },
}
