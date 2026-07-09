'use client'

import { Link, useConfig } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import { usePathname } from 'next/navigation'

import { LIVE_STOCK_ADMIN_PATH } from '@/components/admin/sidebar/customNavLinks'

export function LiveStockNavLink() {
  const pathname = usePathname()
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  const href = formatAdminURL({ adminRoute, path: LIVE_STOCK_ADMIN_PATH })
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      className={['nav__link', isActive && 'active'].filter(Boolean).join(' ')}
      href={href}
      id="nav-live-stock"
      prefetch={false}
    >
      {isActive && <div className="nav__link-indicator" />}
      <span className="nav__link-label">Live Stock</span>
    </Link>
  )
}
