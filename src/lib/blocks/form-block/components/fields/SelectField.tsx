'use client'

import type { Control, FieldErrors, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { cn } from '@/lib/utils/cn'
import { Label } from '@/lib/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/components/ui/select'
import { FieldError } from '@/lib/blocks/form-block/components/fields/FieldError'
import { formControlClassName } from '@/lib/components/ui/form-control-classes'
import { FieldWrapper } from '@/lib/blocks/form-block/components/fields/FieldWrapper'

type SelectOption = {
  label: string
  value: string
}

type SelectFieldProps = {
  name: string
  label?: string | null
  width?: number | null
  required?: boolean | null
  placeholder?: string | null
  options?: SelectOption[] | null
  errors: Partial<FieldErrors<FieldValues>>
  control: Control<FieldValues>
}

export function SelectField({
  name,
  label,
  width,
  required,
  placeholder,
  options,
  errors,
  control,
}: SelectFieldProps) {
  const error = errors[name]

  return (
    <FieldWrapper width={width}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required ? ' *' : ''}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        rules={{
          required: required ? `${label || name} is required` : false,
        }}
        render={({ field }) => (
          <Select
            name={name}
            value={field.value || null}
            onValueChange={(value) => field.onChange(value ?? '')}
          >
            <SelectTrigger
              id={name}
              className={cn('w-full', formControlClassName)}
              aria-invalid={Boolean(error)}
            >
              <SelectValue placeholder={placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent className={'bg-light-50'}>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <FieldError message={error?.message as string | undefined} />
    </FieldWrapper>
  )
}
