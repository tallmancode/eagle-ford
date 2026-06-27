import type React from 'react'

import { cn } from '@/lib/utils/cn'

type FieldWrapperProps = {
  width?: number | null
  className?: string
  children: React.ReactNode
}

export function FieldWrapper({ className, children }: FieldWrapperProps) {
  return <div className={cn('flex w-full flex-col gap-1', className)}>{children}</div>
}
