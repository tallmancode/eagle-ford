import fullLogo from '@/assets/Media/logo/eagle-ford-logo.png'
import Image from 'next/image'
import { SITE_NAME } from '@/constants/site'

type FullLogoProps = {
  className?: string
}

export default function FullLogo({ className = '' }: FullLogoProps) {
  return (
    <Image
      className={`h-auto w-full object-contain ${className}`.trim()}
      src={fullLogo}
      alt={`${SITE_NAME} logo`}
      priority
    />
  )
}
