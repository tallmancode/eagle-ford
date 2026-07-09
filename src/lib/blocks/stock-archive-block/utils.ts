import type {
  MotorCityStockTaxonomy,
  MotorCityStockVehicle,
  MotorCityStockVehicleMedia,
} from '@/lib/motor-city-stock/types'
import type { FetchStockOptions } from '@/lib/motor-city-stock/types'
import { formatZAR } from '@/lib/utils/formatZAR'

export type StockArchiveVehicle = MotorCityStockVehicle

export const FUEL_TYPE_LABELS: Record<string, string> = {
  petrol: 'Petrol',
  diesel: 'Diesel',
  hybrid: 'Hybrid',
  electric: 'Electric',
}

export const TRANSMISSION_LABELS: Record<string, string> = {
  manual: 'Manual',
  automatic: 'Automatic',
  cvt: 'CVT',
  other: 'Other',
}

export type StockArchiveFilters = {
  bodyType?: string
  fuelType?: string
  transmission?: string
  model?: string
  priceMin?: number
  priceMax?: number
  mileageMax?: number
  page?: number
}

export type StockArchiveSearchParams = Record<string, string | string[] | undefined>

function getParam(
  searchParams: StockArchiveSearchParams | undefined,
  key: string,
): string | undefined {
  const value = searchParams?.[key]
  if (Array.isArray(value)) return value[0]
  return value
}

function parseNumberParam(value: string | undefined): number | undefined {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function parseStockArchiveSearchParams(
  searchParams: StockArchiveSearchParams | undefined,
): StockArchiveFilters {
  const page = Number(getParam(searchParams, 'page') ?? '1')

  return {
    bodyType: getParam(searchParams, 'bodyType'),
    fuelType: getParam(searchParams, 'fuelType'),
    transmission: getParam(searchParams, 'transmission'),
    model: getParam(searchParams, 'model'),
    priceMin: parseNumberParam(getParam(searchParams, 'priceMin')),
    priceMax: parseNumberParam(getParam(searchParams, 'priceMax')),
    mileageMax: parseNumberParam(getParam(searchParams, 'mileageMax')),
    page: Number.isFinite(page) && page > 0 ? page : 1,
  }
}

export function hasClientOnlyFilters(filters: StockArchiveFilters): boolean {
  return Boolean(filters.model || filters.mileageMax !== undefined)
}

export function stockArchiveFiltersToSearchParams(filters: StockArchiveFilters): URLSearchParams {
  const params = new URLSearchParams()

  const setIfPresent = (key: string, value: string | number | undefined) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value))
    }
  }

  setIfPresent('bodyType', filters.bodyType)
  setIfPresent('fuelType', filters.fuelType)
  setIfPresent('transmission', filters.transmission)
  setIfPresent('model', filters.model)
  setIfPresent('priceMin', filters.priceMin)
  setIfPresent('priceMax', filters.priceMax)
  setIfPresent('mileageMax', filters.mileageMax)
  if (filters.page && filters.page > 1) {
    params.set('page', String(filters.page))
  }

  return params
}

export function stockArchiveFiltersToFetchOptions(
  filters: StockArchiveFilters,
  options: {
    brand: string
    newUsed?: 'NEW' | 'USED'
    limit: number
  },
): FetchStockOptions {
  return {
    brand: options.brand,
    newUsed: options.newUsed,
    bodyType: filters.bodyType,
    fuelType: filters.fuelType,
    transmission: filters.transmission,
    minPrice: filters.priceMin,
    maxPrice: filters.priceMax,
    page: filters.page ?? 1,
    limit: options.limit,
  }
}

export function getTaxonomyLabel(
  value: string | MotorCityStockTaxonomy | null | undefined,
): string | null {
  if (!value) return null
  if (typeof value === 'object') return value.name ?? value.label ?? null
  return value
}

export function getTaxonomySlug(
  value: string | MotorCityStockTaxonomy | null | undefined,
): string | null {
  if (!value) return null
  if (typeof value === 'object') return value.label ?? null
  return value.toLowerCase().trim()
}

export function getVehiclePrice(vehicle: StockArchiveVehicle): number {
  return vehicle.specialPrice ?? vehicle.price ?? 0
}

export function getVehicleDisplayName(vehicle: StockArchiveVehicle): string {
  return (
    vehicle.title ??
    [vehicle.modelRange, vehicle.model, vehicle.year].filter(Boolean).join(' ') ??
    'Vehicle'
  )
}

export function getStockImageUrl(media: MotorCityStockVehicleMedia[]): string | null {
  const image =
    media.find((item) => item.kind === 'pic') ??
    media.find((item) => item.kind === 'thumb') ??
    media[0]
  return image?.url ?? null
}

export function formatPrice(price: number): string {
  return formatZAR(price)
}

export function formatMileage(mileage: number | null | undefined): string {
  if (mileage === null || mileage === undefined) return 'New'
  return `${new Intl.NumberFormat('en-ZA').format(mileage)} km`
}

export function formatMileageCompact(mileage: number | null | undefined): string {
  if (mileage === null || mileage === undefined) return 'New'
  const formatted = mileage
    .toLocaleString('en-ZA')
    .replace(/[\s,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return `${formatted}km`
}

export function formatTransmissionShort(
  transmission?: string | MotorCityStockTaxonomy | null,
): string {
  const label = getTaxonomyLabel(transmission)
  if (!label) return '—'
  const key = label.toLowerCase()
  if (key === 'automatic') return 'Auto'
  if (key === 'manual') return 'Manual'
  if (key === 'cvt') return 'CVT'
  return TRANSMISSION_LABELS[key] ?? label
}

export function getVehicleSubtitle(vehicle: StockArchiveVehicle): string | null {
  if (vehicle.comments?.trim()) return vehicle.comments.trim()

  const transmission = getTaxonomyLabel(vehicle.transmission)
  const fuelType = getTaxonomyLabel(vehicle.fuelType)
  const parts = [vehicle.model, transmission, fuelType].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : null
}

export function getUniqueModels(vehicles: StockArchiveVehicle[]): string[] {
  const models = new Set<string>()

  for (const vehicle of vehicles) {
    const name = vehicle.modelRange ?? vehicle.model
    if (name) models.add(name)
  }

  return Array.from(models).sort((a, b) => a.localeCompare(b))
}

export function filterStock(
  vehicles: StockArchiveVehicle[],
  filters: Pick<StockArchiveFilters, 'model' | 'mileageMax'>,
): StockArchiveVehicle[] {
  return vehicles.filter((vehicle) => {
    if (filters.model) {
      const modelName = vehicle.modelRange ?? vehicle.model
      if (modelName?.toLowerCase() !== filters.model.toLowerCase()) return false
    }

    if (
      filters.mileageMax !== undefined &&
      vehicle.mileage !== null &&
      vehicle.mileage !== undefined &&
      vehicle.mileage > filters.mileageMax
    ) {
      return false
    }

    return true
  })
}

export function getPriceBounds(vehicles: StockArchiveVehicle[]): { min: number; max: number } {
  if (vehicles.length === 0) return { min: 0, max: 0 }

  const prices = vehicles.map((v) => getVehiclePrice(v))
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}

export function getPriceBoundsFromRange(
  priceRange: { min: number | null; max: number | null },
  vehicles: StockArchiveVehicle[],
): { min: number; max: number } {
  const fromApi = {
    min: priceRange.min ?? undefined,
    max: priceRange.max ?? undefined,
  }

  if (fromApi.min !== undefined && fromApi.max !== undefined) {
    return { min: fromApi.min, max: fromApi.max }
  }

  return getPriceBounds(vehicles)
}

export function getMileageBounds(vehicles: StockArchiveVehicle[]): { min: number; max: number } {
  const mileages = vehicles
    .map((v) => v.mileage)
    .filter((m): m is number => m !== null && m !== undefined)

  if (mileages.length === 0) return { min: 0, max: 200000 }

  return {
    min: Math.min(...mileages),
    max: Math.max(...mileages),
  }
}

export function buildPriceHistogram(
  vehicles: StockArchiveVehicle[],
  bounds: { min: number; max: number },
  bucketCount = 20,
): number[] {
  if (vehicles.length === 0) return Array.from({ length: bucketCount }, () => 0)

  const { min, max } = bounds
  if (min === max)
    return Array.from({ length: bucketCount }, (_, i) => (i === 0 ? vehicles.length : 0))

  const buckets = Array.from({ length: bucketCount }, () => 0)
  const range = max - min || 1

  for (const vehicle of vehicles) {
    const price = getVehiclePrice(vehicle)
    const index = Math.min(bucketCount - 1, Math.floor(((price - min) / range) * bucketCount))
    buckets[index] += 1
  }

  return buckets
}

export function buildEnquireUrl(baseUrl: string, vehicleTitle: string): string {
  if (baseUrl.startsWith('tel:') || baseUrl.startsWith('mailto:')) {
    return baseUrl
  }

  const separator = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${separator}vehicle=${encodeURIComponent(vehicleTitle)}`
}
