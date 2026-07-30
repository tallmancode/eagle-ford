import { defaultColors } from '@payloadcms/richtext-lexical'

type ColorEntry = { css: Record<string, string>; label: string }
type ColorStateMap = Record<string, ColorEntry>

/** Brand palette — CSS vars with oklch fallbacks for admin swatches. */
const brandTextColors: ColorStateMap = {
  'text-primary': {
    label: 'Primary',
    css: { color: 'var(--color-primary, oklch(0.241 0.149 265.1))' },
  },
  'text-secondary': {
    label: 'Secondary',
    css: { color: 'var(--color-secondary, oklch(0.568 0.21 258.31))' },
  },
  'text-neutral': {
    label: 'Neutral',
    css: { color: 'var(--color-neutral, oklch(0.497 0.006 17.51))' },
  },
}

const brandBackgroundColors: ColorStateMap = {
  'bg-primary': {
    label: 'Primary',
    css: { 'background-color': 'var(--color-primary, oklch(0.241 0.149 265.1))' },
  },
  'bg-secondary': {
    label: 'Secondary',
    css: { 'background-color': 'var(--color-secondary, oklch(0.568 0.21 258.31))' },
  },
  'bg-neutral': {
    label: 'Neutral',
    css: { 'background-color': 'var(--color-neutral, oklch(0.497 0.006 17.51))' },
  },
}

export const richTextColorState: ColorStateMap = {
  ...brandTextColors,
  ...defaultColors.text,
  'text-white': { label: 'White', css: { color: '#ffffff' } },
  ...brandBackgroundColors,
  ...defaultColors.background,
  'bg-white': { label: 'White', css: { 'background-color': '#ffffff' } },
}
