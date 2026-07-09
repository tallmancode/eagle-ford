'use client'

import { FinanceCalculatorClient } from '@/lib/blocks/finance-calculator-block/components/FinanceCalculatorClient'
import { getVehiclePrice } from '@/lib/blocks/stock-archive-block/utils'
import type { MotorCityStockVehicle } from '@/lib/motor-city-stock/types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const FINANCE_DISCLAIMER =
  'The instalment quoted does not include any admin costs, license and registration of the vehicle and any value added products. All calculations, rates quoted and payments shown are guidelines only and are not quotations.'

type Props = {
  vehicle: MotorCityStockVehicle
}

export function StockVehicleFinance({ vehicle }: Props) {
  const price = getVehiclePrice(vehicle)

  return (
    <section id="finance" className="scroll-mt-24 bg-neutral-50 py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-bold text-primary-900 md:text-3xl">Can I afford it?</h2>
          <Button asChild variant="outline" className="rounded-lg border-primary text-primary">
            <Link href="#enquire">Apply For Finance</Link>
          </Button>
        </div>

        <FinanceCalculatorClient
          heading={null}
          disclaimer={FINANCE_DISCLAIMER}
          defaultPurchasePrice={price > 0 ? price : null}
          mode="repaymentOnly"
        />
      </div>
    </section>
  )
}
