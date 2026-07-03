import React from 'react'
import { SOCIAL_ICONS } from '../socialIconsData'
import { getSocialIconHref, isNativeLinkPlatform } from '../getSocialIconHref'
import { SocialIconSvg } from './SocialIconSvg'
import type { SocialIconStyle } from '../iconStyleFields'
import Link from 'next/link'

type Props = {
  platform: string
  url: string
  size?: number
  className?: string
  iconStyle?: SocialIconStyle | null
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
}

export function SocialIconLink({
  platform,
  url,
  size = 32,
  className,
  iconStyle,
  target = '_blank',
  rel = 'noopener noreferrer',
}: Props) {
  const icon = SOCIAL_ICONS[platform]
  if (!icon) return null

  const href = getSocialIconHref(platform, url)

  if (isNativeLinkPlatform(platform)) {
    return (
      <a href={href} aria-label={icon.label} className={className}>
        <SocialIconSvg platform={platform} size={size} iconStyle={iconStyle} />
      </a>
    )
  }

  return (
    <Link href={href} target={target} rel={rel} aria-label={icon.label} className={className}>
      <SocialIconSvg platform={platform} size={size} iconStyle={iconStyle} />
    </Link>
  )
}
