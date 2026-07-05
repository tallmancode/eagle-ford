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

export const BackButtonBlockComponent: React.FC<BackButton> = ({
  label = 'Back',
  variant = 'default',
  size = 'default',
  align = 'left',
  fallbackUrl = '/',
  showIcon = true,
}) => {
  const router = useRouter()
  const wrapperClass = cn('flex w-full', alignClass[align ?? 'left'])

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackUrl || '/')
    }
  }

  return (
    <div className={wrapperClass}>
      <Button
        type="button"
        variant={variant ?? 'default'}
        size={size ?? 'default'}
        onClick={handleBack}
      >
        {showIcon ? <ArrowLeft /> : null}
        {label}
      </Button>
    </div>
  )
}
