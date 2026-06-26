import React from 'react'
import { SOCIAL_ICONS } from '../socialIconsData'
import { resolveIconColors, type SocialIconStyle } from '../iconStyleFields'

type Props = {
  platform: string
  size?: number
  className?: string
  iconStyle?: SocialIconStyle | null
}

export function SocialIconSvg({ platform, size = 32, className, iconStyle }: Props) {
  const icon = SOCIAL_ICONS[platform]
  if (!icon) return null

  const { fill, bg, variant } = resolveIconColors(icon.color, iconStyle)

  const svg = (
    <svg
      role="img"
      aria-label={icon.label}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      style={{
        display: 'block',
        flexShrink: 0,
        width: size,
        height: size,
        borderRadius: variant === 'rounded' ? '50%' : undefined,
      }}
    >
      <path d={`M0,0H64V64H0Z${icon.path}`} fill={fill} />
    </svg>
  )

  if (variant === 'rounded' && bg) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: bg,
          flexShrink: 0,
        }}
      >
        {svg}
      </span>
    )
  }

  return svg
}
