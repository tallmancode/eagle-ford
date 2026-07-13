import type { CSSProperties } from 'react'
import iconLogo from '@/assets/Media/logo/eagle-icon.png'
import Image from 'next/image'
import { SITE_NAME } from '@/constants/site'

type LogoProps = {
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

export default function Logo({ width = 512, height = 512, className = '', style = {} }: LogoProps) {
  return (
    <Image
      src={iconLogo}
      alt={`${SITE_NAME} logo`}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  )
}
