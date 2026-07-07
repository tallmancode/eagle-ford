'use client'

import type { BackButton } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const alignClass: Record<string, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export const BackButtonBlockComponent: React.FC<BackButton & { meta?: unknown }> = ({
  label = 'Back',
  variant = 'default',
  size = 'default',
  align = 'left',
  fallbackUrl = '/',
  showIcon = true,
  meta,
}) => {
  const router = useRouter()
  const inRow = (meta as { inRow?: boolean } | undefined)?.inRow === true
  const wrapperClass = inRow ? undefined : cn('flex w-full', alignClass[align ?? 'left'])

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackUrl || '/')
    }
  }

  const button = (
    <Button
      type="button"
      variant={variant ?? 'default'}
      size={size ?? 'default'}
      onClick={handleBack}
    >
      {showIcon ? <ArrowLeft /> : null}
      {label}
    </Button>
  )

  return wrapperClass ? <div className={wrapperClass}>{button}</div> : button
}
