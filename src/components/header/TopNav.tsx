'use client'

import { Separator } from '@/components/ui/separator'
import { MapPin, PhoneCall } from 'lucide-react'
import { Header as GlobalHeader, Setting as GlobalSettings } from '@/payload-types'
import { formatContactAddress } from '@/lib/utils/formatContactAddress'
import { formatPhoneNumber } from '@/lib/utils/formatPhoneNumber'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavMenuItems } from '@/components/header/NavMenuItems'
import { isNavLinkActive, navLinkFocusResetClass } from '@/lib/fields/navigation/isNavLinkActive'
import { cn } from '@/lib/utils/cn'

export const TopNav = ({
  topNavProps,
  settings,
}: {
  topNavProps: GlobalHeader['topNav']
  settings: GlobalSettings
}) => {
  const pathname = usePathname()
  const address = settings?.contactInfo?.address
  const addressLine = formatContactAddress(address)
  const homeActive = isNavLinkActive(pathname, '/')

  return (
    <div className="w-full bg-primary-500 py-2 text-sm hidden lg:block">
      <div className="flex  text-light-50 container  mx-auto justify-between">
        <div className="flex space-x-2 items-center py-2">
          {topNavProps?.homeLinkText && (
            <>
              <Link
                href="/"
                aria-label="Home"
                aria-current={homeActive ? 'page' : undefined}
                className={cn(
                  navLinkFocusResetClass,
                  'hover:text-light-400 transition-colors',
                  homeActive && 'text-light-400',
                )}
              >
                {topNavProps?.homeLinkText}
              </Link>
              <Separator orientation="vertical" />
            </>
          )}

          {addressLine &&
            (address?.mapsLink ? (
              <a
                href={address.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  navLinkFocusResetClass,
                  'flex space-x-2 items-center hover:text-light-400 transition-colors',
                )}
              >
                <MapPin />
                <span>{addressLine}</span>
              </a>
            ) : (
              <span className="flex space-x-2 items-center">
                <MapPin />
                <span>{addressLine}</span>
              </span>
            ))}

          {settings?.contactInfo.phone && (
            <>
              <Separator orientation="vertical" />
              <a
                href={`tel:${settings.contactInfo.phone.replace(/\D/g, '')}`}
                className={cn(
                  navLinkFocusResetClass,
                  'flex space-x-2 items-center hover:text-light-400 transition-colors',
                )}
              >
                <PhoneCall /> <span>{formatPhoneNumber(settings.contactInfo.phone)}</span>
              </a>
            </>
          )}
        </div>
        <NavMenuItems
          links={topNavProps?.topNavLinks}
          className="flex justify-end"
          linkClassName="hover:text-light-400"
          activeClassName="text-light-400"
        />
      </div>
    </div>
  )
}
