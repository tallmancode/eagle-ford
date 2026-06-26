import type { TextField } from 'payload'
import { SOCIAL_ICONS } from './socialIconsData'

export const SocialIconField: TextField = {
  name: 'platform',
  type: 'text',
  label: 'Platform',
  required: true,
  admin: {
    width: '40%',
    components: {
      Field: '@/lib/fields/social-icons/components/SocialIconPicker#SocialIconPicker',
    },
  },
  validate: (val: string | null | undefined) => {
    if (!val) return 'Select a platform'
    if (!(val in SOCIAL_ICONS)) return 'Select a valid platform'
    return true
  },
}
