import type { FinanceCalculatorBlockType } from '@/payload-types'
import { FinanceCalculatorClient } from '@/lib/blocks/finance-calculator-block/components/FinanceCalculatorClient'

export function FinanceCalculatorBlockComponent({
  disclaimer,
  defaultPurchasePrice,
}: FinanceCalculatorBlockType) {
  return (
    <div className="w-full">
      <FinanceCalculatorClient
        disclaimer={disclaimer}
        defaultPurchasePrice={defaultPurchasePrice}
      />
    </div>
  )
}
