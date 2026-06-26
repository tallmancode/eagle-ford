import type { SelectField } from 'payload'
import { backgroundColorOptions } from '@/lib/fields/background-color/backgroundColorOptions'

export const BackgroundColorField = (): SelectField => ({
  name: 'backgroundColor',
  type: 'select',
  label: 'Background color',
  defaultValue: 'none',
  options: backgroundColorOptions,
})
