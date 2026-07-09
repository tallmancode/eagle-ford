export type MotorCityStockVehicleMedia = {
  id: string
  kind: 'thumb' | 'pic'
  url: string
  sortOrder?: number | null
  dtCreated?: string | null
}

export type MotorCityStockTaxonomy = {
  label: string
  name: string
}

export type MotorCityStockVehicle = {
  id: string
  title?: string | null
  cmsId: string
  sourceDealerCode: string
  isActive?: boolean | null
  newUsed?: ('NEW' | 'USED') | null
  brand?: string | MotorCityStockTaxonomy | null
  model?: string | null
  modelRange?: string | null
  year?: number | null
  mileage?: number | null
  price?: number | null
  specialPrice?: number | null
  colour?: string | null
  stockNo?: string | null
  stockNoDisplay?: string | null
  vin?: string | null
  fuelType?: string | MotorCityStockTaxonomy | null
  bodyType?: string | MotorCityStockTaxonomy | null
  transmission?: string | MotorCityStockTaxonomy | null
  category?: string | null
  region?: string | null
  features?: string | null
  comments?: string | null
  media: MotorCityStockVehicleMedia[]
}

export type MotorCityStockResponse = {
  dealerCode: string
  brandKey?: string | null
  page?: number
  totalPages?: number
  totalDocs?: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
  docs: MotorCityStockVehicle[]
}

export type FetchStockOptions = {
  dealerCode?: string
  brandKey?: string
  brand?: string
  bodyType?: string
  fuelType?: string
  transmission?: string
  newUsed?: 'NEW' | 'USED'
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}

export type TaxonomyFilterOption = {
  label: string
  name: string
  count: number
}

export type NewUsedFilterOption = {
  value: string
  count: number
}

export type MotorCityStockFilterOptions = {
  dealerCode: string
  brandKey?: string | null
  bodyTypes: TaxonomyFilterOption[]
  brands: TaxonomyFilterOption[]
  fuelTypes: TaxonomyFilterOption[]
  transmissions: TaxonomyFilterOption[]
  newUsed: NewUsedFilterOption[]
  priceRange: { min: number | null; max: number | null }
}

export type FetchStockFiltersOptions = {
  dealerCode?: string
  brandKey?: string
}

export class MotorCityStockError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'MotorCityStockError'
    this.status = status
  }
}
