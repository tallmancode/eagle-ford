import type { TextField } from 'payload'
import { DEFAULT_LUCIDE_ICON, LUCIDE_ICONS } from './lucideIconsData'

export const LucideIconField = (): TextField => ({
  name: 'icon',
  type: 'text',
  label: 'Icon',
  required: true,
  defaultValue: DEFAULT_LUCIDE_ICON,
  admin: {
    components: {
      Field: '@/lib/fields/lucide-icons/components/LucideIconPicker#LucideIconPicker',
    },
  },
  validate: (val: string | null | undefined) => {
    if (!val) return 'Select an icon'
    if (!(val in LUCIDE_ICONS)) return 'Select a valid icon'
    return true
  },
})
