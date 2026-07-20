import type { ContactFooter, Setting } from '@/payload-types'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import { formatContactAddress } from '@/lib/utils/formatContactAddress'
import { Clock, MapPin } from 'lucide-react'
import React from 'react'

export async function ContactFooterBlockComponent(_props: ContactFooter) {
  const settings = (await getCachedGlobal('settings', 1)) as Setting
  const address = settings?.contactInfo?.address
  const addressLine = formatContactAddress(address)
  const hours = settings?.contactInfo?.operationHours?.trim()

  if (!addressLine && !hours) return null

  const addressContent = (
    <>
      <MapPin className="size-4 text-primary shrink-0" />
      <span>{addressLine}</span>
    </>
  )

  return (
    <section className="border-t py-8 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm text-muted-foreground">
        {addressLine &&
          (address?.mapsLink ? (
            <a
              href={address.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              {addressContent}
            </a>
          ) : (
            <div className="flex items-center gap-2">{addressContent}</div>
          ))}
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
