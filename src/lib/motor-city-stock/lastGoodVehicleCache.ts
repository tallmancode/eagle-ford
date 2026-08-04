import type { MotorCityStockVehicle } from '@/lib/motor-city-stock/types'

/** How long a successfully fetched vehicle may be served after upstream 5xx. */
export const LAST_GOOD_VEHICLE_MAX_AGE_MS = 30 * 60 * 1000

type LastGoodEntry = {
  vehicle: MotorCityStockVehicle
  storedAtMs: number
}

const lastGoodByKey = new Map<string, LastGoodEntry>()

export function lastGoodVehicleKey(dealerCode: string, cmsId: string): string {
  return `${dealerCode}:${cmsId}`
}

export function rememberLastGoodVehicle(
  dealerCode: string,
  cmsId: string,
  vehicle: MotorCityStockVehicle,
  nowMs: number = Date.now(),
): void {
  lastGoodByKey.set(lastGoodVehicleKey(dealerCode, cmsId), {
    vehicle,
    storedAtMs: nowMs,
  })
}

export function getLastGoodVehicle(
  dealerCode: string,
  cmsId: string,
  nowMs: number = Date.now(),
  maxAgeMs: number = LAST_GOOD_VEHICLE_MAX_AGE_MS,
): MotorCityStockVehicle | null {
  const entry = lastGoodByKey.get(lastGoodVehicleKey(dealerCode, cmsId))
  if (!entry) return null
  if (nowMs - entry.storedAtMs > maxAgeMs) {
    lastGoodByKey.delete(lastGoodVehicleKey(dealerCode, cmsId))
    return null
  }
  return entry.vehicle
}

export function forgetLastGoodVehicle(dealerCode: string, cmsId: string): void {
  lastGoodByKey.delete(lastGoodVehicleKey(dealerCode, cmsId))
}

/** Test helper — clears in-memory last-good map. */
export function resetLastGoodVehicleCacheState(): void {
  lastGoodByKey.clear()
}
