import type { SelectField } from 'payload'

export const sectionBackgroundStyleOptions = [
  { label: 'Default', value: 'none' },
  { label: 'Slanted', value: 'slanted' },
] as const

export type SectionBackgroundStyleValue = (typeof sectionBackgroundStyleOptions)[number]['value']

export const SectionBackgroundStyleField = (): SelectField => ({
  name: 'backgroundStyle',
  type: 'select',
  label: 'Background style',
  defaultValue: 'none',
  options: [...sectionBackgroundStyleOptions],
  admin: {
    description:
      'Diagonal clip on the section background. Pair with a background color for best results.',
  },
})
