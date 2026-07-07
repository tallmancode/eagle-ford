import { defaultColors } from '@payloadcms/richtext-lexical'

type ColorEntry = { css: Record<string, string>; label: string }
type ColorStateMap = Record<string, ColorEntry>

export const richTextColorState: ColorStateMap = {
  ...defaultColors.text,
  'text-white': { label: 'White', css: { color: '#ffffff' } },
  ...defaultColors.background,
  'bg-white': { label: 'White', css: { 'background-color': '#ffffff' } },
}
