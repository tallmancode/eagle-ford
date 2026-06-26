import type { GlobalConfig } from 'payload'
import { revalidateGlobalHeader } from '@/globals/Header/hooks/revalidateGlobalHeader'
import { NavLinksField } from '@/lib/fields/navigation/NavLinksField'
import { isAdmin } from '@/lib/utils/accessUtil'
import { SocialAccountsField } from '@/lib/fields/social-icons'

export const HeaderGlobal: GlobalConfig = {
  slug: 'header',
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
          label: 'Brand',
          fields: [
            {
              name: 'logoImage',
              type: 'upload',
              label: 'logo Image',
              relationTo: 'media',
              hasMany: false,
            },
          ],
        },
        {
          label: 'Top Navigation',
          name: 'topNav',
          fields: [
            {
              type: 'group',
              label: 'Address',
              fields: [
                {
                  name: 'address',
                  type: 'text',
                },
                {
                  name: 'mapsLink',
                  type: 'text',
                },
              ],
            },
            SocialAccountsField({ name: 'socials', maxRows: 8 }),
          ],
        },
        {
          label: 'Navigation',
          fields: [NavLinksField({ name: 'links', maxRows: 10, relationTo: ['pages'] })],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobalHeader],
  },
}
