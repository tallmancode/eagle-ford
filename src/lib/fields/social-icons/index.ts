import type { ArrayField } from 'payload'
import { SocialIconField } from './SocialIconField'
import { iconStyleFields } from './iconStyleFields'

type Options = {
  name?: string
  label?: string
  maxRows?: number
}

export const SocialAccountsField = ({
  name = 'socialAccounts',
  label = 'Social Accounts',
  maxRows,
}: Options = {}): ArrayField => ({
  name,
  label,
  type: 'array',
  maxRows,
  admin: {
    initCollapsed: true,
    isSortable: true,
    components: {
      RowLabel: '@/lib/fields/social-icons/components/SocialIconRowLabel#SocialIconRowLabel',
    },
  },
  fields: [
    {
      type: 'row',
      fields: [
        SocialIconField,
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
          admin: {
            width: '60%',
          },
        },
      ],
    },
    iconStyleFields,
  ],
})

export { SocialIconField } from './SocialIconField'
export { SocialIconSvg } from './components/SocialIconSvg'
export { SocialIconLink } from './components/SocialIconLink'
export { SOCIAL_ICONS, SOCIAL_ICON_KEYS } from './socialIconsData'
export { getSocialIconHref, isNativeLinkPlatform } from './getSocialIconHref'
export type { SocialIconEntry } from './socialIconsData'
export { iconStyleFields, resolveIconColors } from './iconStyleFields'
export type { SocialIconStyle, SocialIconStyleVariant } from './iconStyleFields'
