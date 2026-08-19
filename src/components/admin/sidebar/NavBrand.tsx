import iconLogo from '@/assets/Media/logo/eagle-icon.png'
import Image from 'next/image'
import { SITE_NAME } from '@/constants/site'

export const NavBrand = () => (
  <div className="admin-nav__brand">
    <span className="admin-nav__logo">
      <Image src={iconLogo} alt={`${SITE_NAME} logo`} width={26} height={26} priority />
    </span>
    <span className="admin-nav__wordmark">{SITE_NAME}</span>
  </div>
)
