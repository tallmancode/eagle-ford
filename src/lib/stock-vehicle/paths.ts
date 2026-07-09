import type { MotorCityStockVehicle } from '@/lib/motor-city-stock/types'

const SHOWROOM_BASE_PATH = '/showroom'

export function getStockNumberForPath(
  vehicle: Pick<MotorCityStockVehicle, 'stockNo' | 'stockNoDisplay' | 'cmsId'>,
): string {
  return vehicle.stockNoDisplay ?? vehicle.stockNo ?? vehicle.cmsId
}

export function buildStockVehiclePath(
  vehicle: Pick<MotorCityStockVehicle, 'stockNo' | 'stockNoDisplay' | 'cmsId'>,
): string {
  const stockNo = getStockNumberForPath(vehicle)
  return `${SHOWROOM_BASE_PATH}/${stockNo}-${vehicle.cmsId}`
}

export function parseStockVehicleSlug(slug: string): { stockNo: string; cmsId: string } | null {
  const dashIndex = slug.indexOf('-')
  if (dashIndex <= 0 || dashIndex === slug.length - 1) {
    return null
  }

  return {
    stockNo: slug.slice(0, dashIndex),
    cmsId: slug.slice(dashIndex + 1),
  }
}

export function getStockVehicleCmsIdFromSlug(slug: string): string | null {
  return parseStockVehicleSlug(slug)?.cmsId ?? null
}
