import type { ContactFooter, Setting } from '@/payload-types'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import { formatContactAddress } from '@/lib/utils/formatContactAddress'
import { formatPhoneNumber } from '@/lib/utils/formatPhoneNumber'
import { Clock, MapPin, Phone } from 'lucide-react'
import React from 'react'

const itemClassName =
  'flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left max-w-sm sm:max-w-none'

const linkClassName = `${itemClassName} hover:text-primary transition-colors`

function googleMapsSearchUrl(address: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`
}

export async function ContactFooterBlockComponent({
  addressOverride,
  hoursOverride,
  phoneOverride,
}: ContactFooter) {
  const settings = (await getCachedGlobal('settings', 1)) as Setting
  const settingsAddress = settings?.contactInfo?.address
  const hasAddressOverride = Boolean(addressOverride?.trim())
  const addressLine = addressOverride?.trim() || formatContactAddress(settingsAddress)
  const hours = hoursOverride?.trim() || settings?.contactInfo?.operationHours?.trim()
  const phone = phoneOverride?.trim() || settings?.contactInfo?.phone?.trim()

  if (!addressLine && !hours && !phone) return null

  const mapsHref =
    (!hasAddressOverride && settingsAddress?.mapsLink?.trim()) ||
    (addressLine ? googleMapsSearchUrl(addressLine) : null)

  return (
    <section className="border-t py-8 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-base text-muted-foreground">
        {addressLine && mapsHref && (
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            <MapPin className="size-5 text-primary shrink-0" />
            <span>{addressLine}</span>
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone.replace(/\D/g, '')}`}
            className={linkClassName}
            data-gtm-cta="call-now"
            data-gtm-cta-location="contact-footer"
          >
            <Phone className="size-5 text-primary shrink-0" />
            <span>{formatPhoneNumber(phone)}</span>
          </a>
        )}
        {hours && (
          <div className={itemClassName}>
            <Clock className="size-5 text-primary shrink-0" />
            <span>{hours}</span>
          </div>
        )}
      </div>
    </section>
  )
}
