'use client'

import React from 'react'
import { useRowLabel } from '@payloadcms/ui'

type FormStepRowData = {
  title?: string | null
}

export function FormStepRowLabel() {
  const { data, rowNumber } = useRowLabel<FormStepRowData>()

  const title = data?.title?.trim()
  if (title) {
    return <span>{title}</span>
  }

  return <span>{`Step ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}</span>
}
