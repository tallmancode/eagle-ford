import type { FinanceCalculatorBlockType } from '@/payload-types'
import { FinanceCalculatorClient } from '@/lib/blocks/finance-calculator-block/components/FinanceCalculatorClient'

export function FinanceCalculatorBlockComponent({
  heading,
  disclaimer,
  defaultPurchasePrice,
}: FinanceCalculatorBlockType) {
  return (
    <div className="w-full">
      <FinanceCalculatorClient
        heading={heading}
        disclaimer={disclaimer}
        defaultPurchasePrice={defaultPurchasePrice}
      />
    </div>
  )
}
