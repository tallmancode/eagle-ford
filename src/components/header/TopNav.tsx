import { Separator } from '@/components/ui/separator'
import { MapPin, PhoneCall } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header as GlobalHeader, Setting as GlobalSettings } from '@/payload-types'
import { formatPhoneNumber } from '@/utilities/formatPhoneNumber'
import Link from 'next/link'

export const TopNav = ({
  topNavProps,
  settings,
}: {
  topNavProps: GlobalHeader['topNav']
  settings: GlobalSettings
}) => {
  const address = settings?.contactInfo?.address
  const addressLine = [
    address?.street,
    address?.suburb,
    address?.city,
    address?.province,
    address?.postCode,
  ]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(', ')

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
        <div className="flex justify-end space-x-4 items-center">
          <a href="#">Book a Test Drive</a>
          <a href="#">Book a Service</a>
          <Button variant="secondary" className="rounded-full" size={'sm'}>
            Eagle Motor City
          </Button>
        </div>
      </div>
    </div>
  )
}
