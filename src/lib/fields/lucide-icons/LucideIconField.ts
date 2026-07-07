import type { TextField } from 'payload'
import { DEFAULT_LUCIDE_ICON, LUCIDE_ICONS } from './lucideIconsData'

type LucideIconFieldOptions = {
  required?: boolean
}

export const LucideIconField = (options: LucideIconFieldOptions = {}): TextField => {
  const required = options.required ?? true

  return {
    name: 'icon',
    type: 'text',
    label: 'Icon',
    required,
    ...(required ? { defaultValue: DEFAULT_LUCIDE_ICON } : {}),
    admin: {
      components: {
        Field: '@/lib/fields/lucide-icons/components/LucideIconPicker#LucideIconPicker',
      },
    },
    validate: (val: string | null | undefined) => {
      if (!val) return required ? 'Select an icon' : true
      if (!(val in LUCIDE_ICONS)) return 'Select a valid icon'
      return true
    },
  }
}
