import type { ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

type OutlinedFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  inputMode?: 'numeric' | 'decimal'
  trailing?: ReactNode
  className?: string
}

export function OutlinedField({
  id,
  label,
  value,
  onChange,
  inputMode = 'numeric',
  trailing,
  className,
}: OutlinedFieldProps) {
  return (
    <div className={cn('relative', className)}>
      <label
        htmlFor={id}
        className="pointer-events-none absolute -top-2.5 left-3 z-10 bg-white px-1 text-xs font-normal text-neutral-900"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            'h-12 w-full rounded-xl border border-neutral-200 bg-white px-3 text-base text-neutral-900 outline-none transition-colors',
            'focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20',
            trailing && 'pr-10',
          )}
        />
        {trailing && (
          <div className="pointer-events-auto absolute inset-y-0 right-3 flex items-center">
            {trailing}
          </div>
        )}
      </div>
    </div>
  )
}
