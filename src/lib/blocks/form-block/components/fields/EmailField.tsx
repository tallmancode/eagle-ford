'use client'

import type { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/lib/components/ui/input'
import { Label } from '@/lib/components/ui/label'
import { FieldError } from '@/lib/blocks/form-block/components/fields/FieldError'
import { formControlClassName } from '@/lib/components/ui/form-control-classes'
import { FieldWrapper } from '@/lib/blocks/form-block/components/fields/FieldWrapper'

type EmailFieldProps = {
  name: string
  label?: string | null
  width?: number | null
  required?: boolean | null
  errors: Partial<FieldErrors<FieldValues>>
  register: UseFormRegister<FieldValues>
}

export function EmailField({ name, label, width, required, errors, register }: EmailFieldProps) {
  const error = errors[name]

  return (
    <FieldWrapper width={width}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required ? ' *' : ''}
        </Label>
      )}
      <Input
        id={name}
        type="email"
        className={formControlClassName}
        autoComplete="email"
        aria-invalid={Boolean(error)}
        {...register(name, {
          required: required ? `${label || name} is required` : false,
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address',
          },
        })}
      />
      <FieldError message={error?.message as string | undefined} />
    </FieldWrapper>
  )
}
