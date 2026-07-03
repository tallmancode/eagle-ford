import { Separator } from '@/components/ui/separator'
import { MapPin, PhoneCall } from 'lucide-react'
import { Header as GlobalHeader, Setting as GlobalSettings } from '@/payload-types'
import { formatContactAddress } from '@/lib/utils/formatContactAddress'
import { formatPhoneNumber } from '@/utilities/formatPhoneNumber'
import Link from 'next/link'
import { NavMenuItems } from '@/components/header/NavMenuItems'

export const TopNav = ({
  topNavProps,
  settings,
}: {
  topNavProps: GlobalHeader['topNav']
  settings: GlobalSettings
}) => {
  const address = settings?.contactInfo?.address
  const addressLine = formatContactAddress(address)

  return (
    <div className="w-full bg-primary-500 py-2 text-sm">
      <div className="flex  text-light-50 container  mx-auto justify-between">
        <div className="flex space-x-2 items-center">
          {topNavProps?.homeLinkText && (
            <>
              <Link href="/" aria-label="Home">
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
                className="flex space-x-2 items-center"
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
                className="flex space-x-2 items-center"
              >
                <PhoneCall /> <span>{formatPhoneNumber(settings.contactInfo.phone)}</span>
              </a>
            </>
          )}
        </div>
        <NavMenuItems links={topNavProps?.topNavLinks} className="flex justify-end" />
      </div>
    </div>
  )
}
