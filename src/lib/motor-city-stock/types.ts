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

export type MotorCityStockDealership = {
  id: string
  dealershipID: string
  name: string
  region?: string | null
  email?: string | null
  phoneNumber?: string | null
  cellNumber?: string | null
  contactPerson?: string | null
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
  mmCode?: string | null
  year?: number | null
  mileage?: number | null
  price?: number | null
  specialPrice?: number | null
  colour?: string | null
  stockNo?: string | null
  stockNoDisplay?: string | null
  vin?: string | null
  regNo?: string | null
  fuelType?: string | MotorCityStockTaxonomy | null
  bodyType?: string | MotorCityStockTaxonomy | null
  transmission?: string | MotorCityStockTaxonomy | null
  category?: string | null
  region?: string | null
  features?: string | null
  comments?: string | null
  monthlyRepayment?: number | null
  repaymentTerm?: number | null
  repaymentInterestRate?: number | null
  repaymentDepositPerc?: number | null
  repaymentBalloonPerc?: number | null
  dealership?: string | MotorCityStockDealership | null
  media: MotorCityStockVehicleMedia[]
}

export type MotorCityStockVehicleResponse = {
  dealerCode: string | null
  dealerCodes?: string[]
  brandKey?: string | null
  brandKeys?: string[]
  vehicle: MotorCityStockVehicle
}

export type MotorCityStockResponse = {
  dealerCode: string | null
  dealerCodes?: string[]
  brandKey?: string | null
  brandKeys?: string[]
  page?: number
  totalPages?: number
  totalDocs?: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
  docs: MotorCityStockVehicle[]
}

export type FetchStockOptions = {
  dealerCode?: string
  brand?: string
  bodyType?: string
  fuelType?: string
  transmission?: string
  newUsed?: 'NEW' | 'USED'
  model?: string
  maxMileage?: number
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
  /**
   * When false, retryable/upstream list failures still throw but are not sent to Sentry.
   * Use for optional UI (e.g. showroom similar vehicles) that already soft-fails locally.
   * Default true. Not part of the Next.js data-cache key.
   */
  reportToSentry?: boolean
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
  dealerCode: string | null
  dealerCodes?: string[]
  brandKey?: string | null
  brandKeys?: string[]
  bodyTypes: TaxonomyFilterOption[]
  brands: TaxonomyFilterOption[]
  fuelTypes: TaxonomyFilterOption[]
  transmissions: TaxonomyFilterOption[]
  newUsed: NewUsedFilterOption[]
  priceRange: { min: number | null; max: number | null }
}

export type FetchStockFiltersOptions = {
  dealerCode?: string
}

export type FetchStockVehicleOptions = {
  cmsId: string
  dealerCode?: string
}

export class MotorCityStockError extends Error {
  status: number
  readonly code: string
  readonly retryable: boolean

  constructor(
    message: string,
    status: number,
    options?: { code?: string; retryable?: boolean; cause?: unknown },
  ) {
    super(message, options?.cause ? { cause: options.cause } : undefined)
    this.name = 'MotorCityStockError'
    this.status = status
    this.code = options?.code ?? 'STOCK_ERROR'
    this.retryable = options?.retryable ?? (status >= 500 || status === 408 || status === 429)
  }
}
