import type { Control, FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

export type FormFieldBaseProps = {
  errors: Partial<FieldErrors<FieldValues>>
  register: UseFormRegister<FieldValues>
  control: Control<FieldValues>
}
