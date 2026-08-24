import iconLogo from '@/assets/Media/logo/eagle-ford-logo-w256.webp'
import Image from 'next/image'
import { SITE_NAME } from '@/constants/site'
import './nav-brand.css'

const logoFitStyle = {
  display: 'block',
  width: 'auto',
  height: 'auto',
  maxWidth: '100%',
  maxHeight: 'calc(var(--app-header-height, 56px) - 12px)',
  objectFit: 'contain',
} as const

export const NavBrand = () => (
  <div className="admin-nav__brand">
    <span className="admin-nav__logo">
      <Image
        src={iconLogo}
        alt={`${SITE_NAME} logo`}
        width={256}
        height={130}
        priority
        className="admin-nav__logo-img"
        style={logoFitStyle}
      />
    </span>
  </div>
)
