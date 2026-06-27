'use client'

import type { Control, FieldErrors, FieldValues } from 'react-hook-form'

import { countryOptions } from '@/lib/blocks/form-block/components/fields/countryOptions'
import { SelectField } from '@/lib/blocks/form-block/components/fields/SelectField'

type CountryFieldProps = {
  name: string
  label?: string | null
  width?: number | null
  required?: boolean | null
  errors: Partial<FieldErrors<FieldValues>>
  control: Control<FieldValues>
}

export function CountryField(props: CountryFieldProps) {
  return <SelectField {...props} placeholder="Select a country" options={countryOptions} />
}
