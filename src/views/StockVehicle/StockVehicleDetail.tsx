import type { Form } from '@/payload-types'
import type { FinanceCalculatorDefaults } from '@/lib/blocks/finance-calculator-block/getFinanceCalculatorDefaults'
import type { MotorCityStockVehicle } from '@/lib/motor-city-stock/types'
import { getVehicleDisplayName } from '@/lib/blocks/stock-archive-block/utils'

import { StockVehicleDealer } from './StockVehicleDealer'
import { StockVehicleEnquiry } from './StockVehicleEnquiry'
import { StockVehicleFeatures } from './StockVehicleFeatures'
import { StockVehicleFinance } from './StockVehicleFinance'
import { StockVehicleGallery } from './StockVehicleGallery'
import { StockVehicleHero } from './StockVehicleHero'
import { StockVehicleSimilar } from './StockVehicleSimilar'
import { StockVehicleSpecs } from './StockVehicleSpecs'

type Props = {
  vehicle: MotorCityStockVehicle
  similarVehicles: MotorCityStockVehicle[]
  enquiryForm: Form | null
  calculatorDefaults?: FinanceCalculatorDefaults | null
}

export function StockVehicleDetail({
  vehicle,
  similarVehicles,
  enquiryForm,
  calculatorDefaults,
}: Props) {
  const vehicleName = getVehicleDisplayName(vehicle)

  return (
    <article>
      <StockVehicleHero vehicle={vehicle} />
      <StockVehicleGallery vehicleName={vehicleName} media={vehicle.media} />
      <StockVehicleSpecs vehicle={vehicle} />
      <StockVehicleFeatures vehicle={vehicle} />
      <StockVehicleFinance vehicle={vehicle} calculatorDefaults={calculatorDefaults} />
      <StockVehicleDealer vehicle={vehicle} />
      {enquiryForm && <StockVehicleEnquiry vehicle={vehicle} form={enquiryForm} />}
      <StockVehicleSimilar vehicles={similarVehicles} />
    </article>
  )
}
