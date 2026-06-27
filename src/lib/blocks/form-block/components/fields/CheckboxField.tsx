'use client'

import type { Control, FieldErrors, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { Checkbox } from '@/lib/components/ui/checkbox'
import { Label } from '@/lib/components/ui/label'
import { FieldError } from '@/lib/blocks/form-block/components/fields/FieldError'
import { FieldWrapper } from '@/lib/blocks/form-block/components/fields/FieldWrapper'

type CheckboxFieldProps = {
  name: string
  label?: string | null
  width?: number | null
  required?: boolean | null
  errors: Partial<FieldErrors<FieldValues>>
  control: Control<FieldValues>
}

export function CheckboxField({
  name,
  label,
  width,
  required,
  errors,
  control,
}: CheckboxFieldProps) {
  const error = errors[name]

  return (
    <FieldWrapper width={width}>
      <Controller
        control={control}
        name={name}
        rules={{
          validate: (value) => {
            if (!required) return true
            return value === true || `${label || name} is required`
          },
        }}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              id={name}
              name={name}
              checked={Boolean(field.value)}
              onCheckedChange={(checked) => field.onChange(checked)}
              aria-invalid={Boolean(error)}
            />
            {label && (
              <Label htmlFor={name} className="font-normal">
                {label}
                {required ? ' *' : ''}
              </Label>
            )}
          </div>
        )}
      />
      <FieldError message={error?.message as string | undefined} />
    </FieldWrapper>
  )
}
