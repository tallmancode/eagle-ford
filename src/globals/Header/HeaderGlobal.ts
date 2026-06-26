import type { GlobalConfig } from 'payload'
import { revalidateGlobalHeader } from '@/globals/Header/hooks/revalidateGlobalHeader'
import { NavLinksField } from '@/lib/fields/navigation/NavLinksField'
import { isAdmin } from '@/lib/utils/accessUtil'

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
              name: 'headerLogo',
              type: 'upload',
              label: 'Header Logo',
              relationTo: 'media',
              hasMany: false,
              admin: {
                width: '25%',
              },
            },
          ],
        },
        {
          label: 'Top Navigation',
          name: 'topNav',
          fields: [
            { type: 'text', label: 'Home Link Text', name: 'homeLinkText' },
            NavLinksField({ name: 'topNavLinks', maxRows: 10, relationTo: ['pages'] }),
          ],
        },
        {
          label: 'Navigation',
          fields: [
            NavLinksField({ name: 'leftLinks', maxRows: 10, relationTo: ['pages'] }),
            NavLinksField({ name: 'rightLinks', maxRows: 10, relationTo: ['pages'] }),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobalHeader],
  },
}
