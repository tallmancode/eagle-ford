'use client'

import type { Control, FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import type { ComponentType } from 'react'

import type { Form } from '@/payload-types'
import { CheckboxField } from '@/lib/blocks/form-block/components/fields/CheckboxField'
import { CountryField } from '@/lib/blocks/form-block/components/fields/CountryField'
import { DateField } from '@/lib/blocks/form-block/components/fields/DateField'
import { EmailField } from '@/lib/blocks/form-block/components/fields/EmailField'
import { MessageField } from '@/lib/blocks/form-block/components/fields/MessageField'
import { NumberField } from '@/lib/blocks/form-block/components/fields/NumberField'
import { RadioField } from '@/lib/blocks/form-block/components/fields/RadioField'
import { SelectField } from '@/lib/blocks/form-block/components/fields/SelectField'
import { UploadField } from '@/lib/blocks/form-block/components/fields/UploadField'
import { StateField } from '@/lib/blocks/form-block/components/fields/StateField'
import { TextField } from '@/lib/blocks/form-block/components/fields/TextField'
import { TextareaField } from '@/lib/blocks/form-block/components/fields/TextareaField'

type FormField = NonNullable<Form['fields']>[number]

export type FormFieldComponentProps = FormField & {
  errors: Partial<FieldErrors<FieldValues>>
  register: UseFormRegister<FieldValues>
  control: Control<FieldValues>
}

export const formFields: Record<string, ComponentType<FormFieldComponentProps>> = {
  checkbox: CheckboxField as ComponentType<FormFieldComponentProps>,
  country: CountryField as ComponentType<FormFieldComponentProps>,
  date: DateField as ComponentType<FormFieldComponentProps>,
  email: EmailField as ComponentType<FormFieldComponentProps>,
  message: MessageField as ComponentType<FormFieldComponentProps>,
  number: NumberField as ComponentType<FormFieldComponentProps>,
  radio: RadioField as ComponentType<FormFieldComponentProps>,
  select: SelectField as ComponentType<FormFieldComponentProps>,
  upload: UploadField as ComponentType<FormFieldComponentProps>,
  state: StateField as ComponentType<FormFieldComponentProps>,
  text: TextField as ComponentType<FormFieldComponentProps>,
  textarea: TextareaField as ComponentType<FormFieldComponentProps>,
}
