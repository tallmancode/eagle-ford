export type MotorCityStockVehicleMedia = {
  id: string
  kind: 'thumb' | 'pic'
  url: string
  sortOrder?: number | null
  dtCreated?: string | null
}

export type MotorCityStockVehicle = {
  id: string
  title?: string | null
  cmsId: string
  sourceDealerCode: string
  isActive?: boolean | null
  newUsed?: ('NEW' | 'USED') | null
  brand?: string | null
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
  fuelType?: string | null
  bodyType?: string | null
  transmission?: string | null
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
  newUsed?: 'NEW' | 'USED'
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}

export class MotorCityStockError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'MotorCityStockError'
    this.status = status
  }
}
