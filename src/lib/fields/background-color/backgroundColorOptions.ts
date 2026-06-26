import type { Option } from 'payload'

export const backgroundColorOptions: Option[] = [
  { label: 'None', value: 'none' },
  { label: 'White', value: 'white' },
  { label: 'Light gray', value: 'light' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Primary (light)', value: 'primary-light' },
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Dark', value: 'dark' },
]

export type BackgroundColorValue =
  | 'none'
  | 'white'
  | 'light'
  | 'neutral'
  | 'primary-light'
  | 'primary'
  | 'secondary'
  | 'dark'
