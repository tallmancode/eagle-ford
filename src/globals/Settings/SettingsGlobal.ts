import type { GlobalConfig } from 'payload'
import { revalidateGlobalSettings } from '@/globals/Settings/hooks/revalidateGlobalSettings'
import { isAdmin } from '@/lib/utils/accessUtil'

export const SettingsGlobal: GlobalConfig = {
  slug: 'global-settings',
  access: {
    read: () => true,
    update: isAdmin,
  },
  admin: {
    group: 'Layout',
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
            },
            {
              name: 'phone',
              label: 'Phone Number',
              type: 'text',
            },
          ],
        },
        {
          label: 'Social',
          name: 'socials',
          interfaceName: 'Socials',
          fields: [
            {
              name: 'enabled',
              type: 'group',
              fields: [
                {
                  name: 'header',
                  label: 'Enable in header',
                  type: 'checkbox',
                },
                {
                  name: 'footer',
                  label: 'Enable in footer',
                  type: 'checkbox',
                },
              ],
            },
            {
              name: 'facebook',
              type: 'text',
              admin: {
                description: 'Sets the Github link to your profile.',
              },
            },
            {
              name: 'instagram',
              type: 'text',
              admin: {
                description: 'Sets the Github link to your profile.',
              },
            },

            {
              name: 'linkedin',
              type: 'text',
              admin: {
                description: 'Sets the LinkedIn link to your profile.',
              },
            },
            {
              name: 'tiktok',
              type: 'text',
              admin: {
                description: 'Sets the Github link to your profile.',
              },
            },
            {
              name: 'youtube',
              type: 'text',
              admin: {
                description: 'Sets the Github link to your profile.',
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
