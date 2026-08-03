import type { SettingsContactInfo } from '@/payload-types'

type ContactAddress = SettingsContactInfo['address']

export function formatContactAddress(address: ContactAddress | null | undefined): string | null {
  if (!address) return null

  const addressLine = [
    address.street,
    address.suburb,
    address.city,
    address.province,
    address.postCode,
  ]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(', ')

  return addressLine || null
}
