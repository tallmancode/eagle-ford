import type { BackgroundColorValue } from '@/lib/fields/background-color/backgroundColorOptions'

export const backgroundColorClassMap: Record<BackgroundColorValue, string> = {
  none: '',
  white: 'bg-light-50',
  light: 'bg-light-100',
  neutral: 'bg-neutral-50',
  'primary-light': 'bg-primary-50',
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  dark: 'bg-dark-950',
}

export function backgroundColorToClass(value?: string | null): string {
  if (!value || value === 'none') return ''
  return backgroundColorClassMap[value as BackgroundColorValue] ?? ''
}
