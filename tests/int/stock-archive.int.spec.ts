import { describe, expect, it } from 'vitest'
import type { StockArchiveVehicle } from '@/lib/blocks/stock-archive-block/utils'
import {
  buildEnquireUrl,
  filterStock,
  formatMileageCompact,
  formatTransmissionShort,
  getPriceBounds,
  getStockImageUrl,
  getTaxonomyLabel,
  getUniqueModels,
  getVehiclePrice,
  getVehicleSubtitle,
  hasClientOnlyFilters,
  parseStockArchiveSearchParams,
  stockArchiveFiltersToSearchParams,
} from '@/lib/blocks/stock-archive-block/utils'
import { buildStockUrl } from '@/lib/motor-city-stock/fetchStock'

function makeVehicle(overrides: Partial<StockArchiveVehicle> = {}): StockArchiveVehicle {
  return {
    id: '1',
    cmsId: 'cms-1',
    sourceDealerCode: 'EC167',
    media: [],
    ...overrides,
  }
}

describe('stock-archive utils', () => {
  const vehicles = [
    makeVehicle({
      id: '1',
      modelRange: 'Ranger',
      bodyType: { label: 'double-cab', name: 'D/C' },
      price: 500000,
      mileage: 10000,
    }),
    makeVehicle({
      id: '2',
      model: 'Everest',
      bodyType: { label: 'suv', name: 'SUV' },
      specialPrice: 700000,
      price: 750000,
      mileage: null,
    }),
    makeVehicle({
      id: '3',
      modelRange: 'Territory',
      bodyType: { label: 'suv', name: 'SUV' },
      price: 400000,
      mileage: 50000,
    }),
  ]

  it('getVehiclePrice prefers specialPrice', () => {
    expect(getVehiclePrice(vehicles[1])).toBe(700000)
  })

  it('getUniqueModels returns sorted unique model names', () => {
    expect(getUniqueModels(vehicles)).toEqual(['Everest', 'Ranger', 'Territory'])
  })

  it('filterStock filters by model', () => {
    const result = filterStock(vehicles, { model: 'Ranger' })
    expect(result.map((v) => v.id)).toEqual(['1'])
  })

  it('filterStock excludes vehicles above mileage max', () => {
    const result = filterStock(vehicles, { mileageMax: 20000 })
    expect(result.map((v) => v.id)).toEqual(['1', '2'])
  })

  it('getPriceBounds uses specialPrice when present', () => {
    expect(getPriceBounds(vehicles)).toEqual({ min: 400000, max: 700000 })
  })

  it('parseStockArchiveSearchParams maps URL params', () => {
    expect(
      parseStockArchiveSearchParams({
        bodyType: 'hatch',
        fuelType: 'petrol',
        transmission: 'automatic',
        priceMin: '100000',
        priceMax: '500000',
        model: 'Ranger',
        mileageMax: '50000',
        page: '2',
      }),
    ).toEqual({
      bodyType: 'hatch',
      fuelType: 'petrol',
      transmission: 'automatic',
      priceMin: 100000,
      priceMax: 500000,
      model: 'Ranger',
      mileageMax: 50000,
      page: 2,
    })
  })

  it('stockArchiveFiltersToSearchParams round-trips API filter params', () => {
    const params = stockArchiveFiltersToSearchParams({
      bodyType: 'suv',
      fuelType: 'diesel',
      transmission: 'automatic',
      priceMin: 200000,
      priceMax: 800000,
      page: 3,
    })

    expect(params.toString()).toBe(
      'bodyType=suv&fuelType=diesel&transmission=automatic&priceMin=200000&priceMax=800000&page=3',
    )
  })

  it('hasClientOnlyFilters is true when model or mileage is set', () => {
    expect(hasClientOnlyFilters({ model: 'Ranger' })).toBe(true)
    expect(hasClientOnlyFilters({ mileageMax: 10000 })).toBe(true)
    expect(hasClientOnlyFilters({ bodyType: 'suv' })).toBe(false)
  })

  it('getTaxonomyLabel returns name from populated taxonomy', () => {
    expect(getTaxonomyLabel({ label: 'suv', name: 'SUV' })).toBe('SUV')
    expect(getTaxonomyLabel('automatic')).toBe('automatic')
  })

  it('buildEnquireUrl appends vehicle query for internal paths', () => {
    expect(buildEnquireUrl('/contact', 'Ford Ranger')).toBe('/contact?vehicle=Ford%20Ranger')
  })

  it('buildEnquireUrl leaves tel links unchanged', () => {
    expect(buildEnquireUrl('tel:0104400510', 'Ford Ranger')).toBe('tel:0104400510')
  })

  it('getStockImageUrl prefers full-size pic over thumb', () => {
    const media = [
      { id: '1', kind: 'thumb' as const, url: 'https://cdn.example.com/thumb.jpg' },
      { id: '2', kind: 'pic' as const, url: 'https://cdn.example.com/full.jpg' },
    ]

    expect(getStockImageUrl(media)).toBe('https://cdn.example.com/full.jpg')
  })

  it('getStockImageUrl falls back to thumb when no pic exists', () => {
    const media = [{ id: '1', kind: 'thumb' as const, url: 'https://cdn.example.com/thumb.jpg' }]

    expect(getStockImageUrl(media)).toBe('https://cdn.example.com/thumb.jpg')
  })

  it('getVehicleSubtitle prefers comments', () => {
    const vehicle = makeVehicle({
      comments: '2.0D XL Double Cab 4X2 6AT',
      model: 'Ranger',
    })

    expect(getVehicleSubtitle(vehicle)).toBe('2.0D XL Double Cab 4X2 6AT')
  })

  it('getVehicleSubtitle falls back to model and specs', () => {
    const vehicle = makeVehicle({
      model: 'Ranger',
      transmission: { label: 'automatic', name: 'Automatic' },
      fuelType: { label: 'diesel', name: 'Diesel' },
    })

    expect(getVehicleSubtitle(vehicle)).toBe('Ranger Automatic Diesel')
  })

  it('formatMileageCompact formats with spaces', () => {
    expect(formatMileageCompact(102000)).toBe('102 000km')
  })

  it('formatTransmissionShort maps automatic to Auto', () => {
    expect(formatTransmissionShort({ label: 'automatic', name: 'Automatic' })).toBe('Auto')
  })
})

describe('buildStockUrl', () => {
  it('includes taxonomy filter params', () => {
    const url = buildStockUrl('http://localhost:3000', {
      brand: 'ford',
      bodyType: 'hatch',
      fuelType: 'petrol',
      transmission: 'automatic',
      minPrice: 100000,
      maxPrice: 500000,
      page: 2,
      limit: 12,
    })

    expect(url.pathname).toBe('/api/stock/EC167')
    expect(url.searchParams.get('brandKey')).toBe('ford')
    expect(url.searchParams.get('brand')).toBe('ford')
    expect(url.searchParams.get('bodyType')).toBe('hatch')
    expect(url.searchParams.get('fuelType')).toBe('petrol')
    expect(url.searchParams.get('transmission')).toBe('automatic')
    expect(url.searchParams.get('minPrice')).toBe('100000')
    expect(url.searchParams.get('maxPrice')).toBe('500000')
    expect(url.searchParams.get('page')).toBe('2')
    expect(url.searchParams.get('limit')).toBe('12')
  })
})
