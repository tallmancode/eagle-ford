'use client'

import React from 'react'
import { useRowLabel } from '@payloadcms/ui'
import { SOCIAL_ICONS } from '../socialIconsData'
import { SocialIconSvg } from './SocialIconSvg'

export function SocialIconRowLabel() {
  const { data } = useRowLabel<{ platform?: string; url?: string }>()

  const label = data?.platform
    ? (SOCIAL_ICONS[data.platform]?.label ?? data.platform)
    : 'New Account'

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      {data?.platform && <SocialIconSvg platform={data.platform} size={16} />}
      <span>{label}</span>
    </span>
  )
}
