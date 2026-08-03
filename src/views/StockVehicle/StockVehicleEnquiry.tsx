'use client'

import type { Form } from '@/payload-types'
import { FormBlockClient } from '@/lib/blocks/form-block/components/FormBlockClient'
import type { MotorCityStockVehicle } from '@/lib/motor-city-stock/types'
import {
  buildVehicleFormContext,
  getVehicleLmsHiddenFieldNames,
  pickFormContextValues,
} from '@/lib/stock-vehicle/buildVehicleFormContext'

type Props = {
  vehicle: MotorCityStockVehicle
  form: Form
}

export function StockVehicleEnquiry({ vehicle, form }: Props) {
  return (
    <section id="enquire" className="scroll-mt-24 py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-6 text-center text-2xl font-bold uppercase tracking-wide text-primary-900 md:text-3xl">
          Enquire Now
        </h2>
        <FormBlockClient
          form={form}
          contextValues={pickFormContextValues(form, buildVehicleFormContext(vehicle))}
          forceHiddenFieldNames={getVehicleLmsHiddenFieldNames(form)}
        />
      </div>
    </section>
  )
}
