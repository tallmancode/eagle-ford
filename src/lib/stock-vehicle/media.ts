import type { MotorCityStockVehicleMedia } from '@/lib/motor-city-stock/types'

export function getStockGalleryImages(
  media: MotorCityStockVehicleMedia[],
): MotorCityStockVehicleMedia[] {
  const pics = media.filter((item) => item.kind === 'pic')
  if (pics.length > 0) return pics

  const thumbs = media.filter((item) => item.kind === 'thumb')
  if (thumbs.length > 0) return thumbs

  return media
}

export function getStockHeroImage(
  media: MotorCityStockVehicleMedia[],
): MotorCityStockVehicleMedia | null {
  return getStockGalleryImages(media)[0] ?? null
}
