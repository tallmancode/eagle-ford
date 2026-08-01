import type { ContactFooter, Setting } from '@/payload-types'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import { formatContactAddress } from '@/lib/utils/formatContactAddress'
import { formatPhoneNumber } from '@/lib/utils/formatPhoneNumber'
import { Clock, MapPin, Phone } from 'lucide-react'
import React from 'react'

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

  const addressContent = (
    <>
      <MapPin className="size-4 text-primary shrink-0" />
      <span>{addressLine}</span>
    </>
  )

  const showMapsLink = !hasAddressOverride && Boolean(settingsAddress?.mapsLink)

  return (
    <section className="border-t py-8 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm text-muted-foreground">
        {addressLine &&
          (showMapsLink ? (
            <a
              href={settingsAddress!.mapsLink!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              {addressContent}
            </a>
          ) : (
            <div className="flex items-center gap-2">{addressContent}</div>
          ))}
        {phone && (
          <a
            href={`tel:${phone.replace(/\D/g, '')}`}
            className="flex items-center gap-2"
            data-gtm-cta="call-now"
            data-gtm-cta-location="contact-footer"
          >
            <Phone className="size-4 text-primary shrink-0" />
            <span>{formatPhoneNumber(phone)}</span>
          </a>
        )}
        {hours && (
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary shrink-0" />
            <span>{hours}</span>
          </div>
        )}
      </div>
    </section>
  )
}
