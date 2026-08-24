import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import { formatContactAddress } from '@/lib/utils/formatContactAddress'
import { formatPhoneNumber } from '@/lib/utils/formatPhoneNumber'
import { cn } from '@/lib/utils/cn'
import type { Setting } from '@/payload-types'
import { Clock, MapPin, Phone } from 'lucide-react'

const itemClassName =
  'flex max-w-sm flex-col items-center gap-2 text-center sm:max-w-none sm:flex-row sm:text-left'

const linkClassName = `${itemClassName} transition-colors hover:text-primary`

function googleMapsSearchUrl(address: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`
}

type ContactFooterV2Props = {
  addressSource?: 'settings' | 'override' | null
  addressOverride?: string | null
  hoursSource?: 'settings' | 'override' | null
  hoursOverride?: string | null
  phoneSource?: 'settings' | 'override' | null
  phoneOverride?: string | null
  styles?: StyleValues | null
  blockType?: string
  id?: string | null
}

export async function ContactFooterV2BlockComponent(props: ContactFooterV2Props) {
  const {
    addressSource = 'settings',
    addressOverride,
    hoursSource = 'settings',
    hoursOverride,
    phoneSource = 'settings',
    phoneOverride,
    styles,
  } = props

  const settings = (await getCachedGlobal('settings', 1)) as Setting
  const settingsAddress = settings?.contactInfo?.address
  const useAddressOverride = addressSource === 'override'
  const addressLine = useAddressOverride
    ? addressOverride?.trim() || ''
    : formatContactAddress(settingsAddress)
  const hours =
    hoursSource === 'override'
      ? hoursOverride?.trim() || ''
      : settings?.contactInfo?.operationHours?.trim() || ''
  const phone =
    phoneSource === 'override'
      ? phoneOverride?.trim() || ''
      : settings?.contactInfo?.phone?.trim() || ''

  if (!addressLine && !hours && !phone) return null

  const mapsHref =
    (!useAddressOverride && settingsAddress?.mapsLink?.trim()) ||
    (addressLine ? googleMapsSearchUrl(addressLine) : null)

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={cn('border-t px-4 py-8', className)}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <div className="container mx-auto flex flex-col items-center justify-center gap-6 text-base text-muted-foreground sm:flex-row sm:gap-12">
        {addressLine && mapsHref ? (
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            <MapPin className="size-5 shrink-0 text-primary" />
            <span>{addressLine}</span>
          </a>
        ) : null}
        {phone ? (
          <a
            href={`tel:${phone.replace(/\D/g, '')}`}
            className={linkClassName}
            data-gtm-cta="call-now"
            data-gtm-cta-location="contact-footer-v2"
          >
            <Phone className="size-5 shrink-0 text-primary" />
            <span>{formatPhoneNumber(phone)}</span>
          </a>
        ) : null}
        {hours ? (
          <div className={itemClassName}>
            <Clock className="size-5 shrink-0 text-primary" />
            <span>{hours}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
