import type { LucideIcon } from 'lucide-react'
import { LUCIDE_ICONS } from './lucideIconsData'

export const lucideIconMap: Record<string, LucideIcon> = Object.fromEntries(
  Object.entries(LUCIDE_ICONS).map(([key, { Icon }]) => [key, Icon]),
)
