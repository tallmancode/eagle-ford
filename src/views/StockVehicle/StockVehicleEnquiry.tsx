'use client'

import type { Form } from '@/payload-types'
import { FormBlockClient } from '@/lib/blocks/form-block/components/FormBlockClient'
import { getVehicleDisplayName } from '@/lib/blocks/stock-archive-block/utils'
import type { MotorCityStockVehicle } from '@/lib/motor-city-stock/types'

type Props = {
  vehicle: MotorCityStockVehicle
  form: Form
}

export function StockVehicleEnquiry({ vehicle, form }: Props) {
  const vehicleName = getVehicleDisplayName(vehicle)

  return (
    <section id="enquire" className="scroll-mt-24 py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-6 text-center text-2xl font-bold uppercase tracking-wide text-primary-900 md:text-3xl">
          Enquire Now
        </h2>
        <FormBlockClient
          form={form}
          contextValues={{
            vehicleName,
          }}
        />
      </div>
    </section>
  )
}
