import type { Vehicle } from '@/payload-types'

export function getVehicleCustomField(
  vehicle: Vehicle | null | undefined,
  key: string,
): string | null {
  const match = vehicle?.customFields?.find((f) => f.key === key)
  return match?.value ?? null
}
