export { fetchStock, buildStockUrl, getStockApiConfig } from '@/lib/motor-city-stock/fetchStock'
export { fetchStockVehicle, buildStockVehicleUrl } from '@/lib/motor-city-stock/fetchStockVehicle'
export { fetchStockFilters, buildStockFiltersUrl } from '@/lib/motor-city-stock/fetchStockFilters'
export { getCachedStock } from '@/lib/motor-city-stock/getCachedStock'
export { getCachedStockFilters } from '@/lib/motor-city-stock/getCachedStockFilters'
export { getCachedStockVehicle } from '@/lib/motor-city-stock/getCachedStockVehicle'
export type {
  FetchStockFiltersOptions,
  FetchStockOptions,
  FetchStockVehicleOptions,
  MotorCityStockDealership,
  MotorCityStockFilterOptions,
  MotorCityStockResponse,
  MotorCityStockTaxonomy,
  MotorCityStockVehicle,
  MotorCityStockVehicleMedia,
  MotorCityStockVehicleResponse,
  NewUsedFilterOption,
  TaxonomyFilterOption,
} from '@/lib/motor-city-stock/types'
export { MotorCityStockError } from '@/lib/motor-city-stock/types'
