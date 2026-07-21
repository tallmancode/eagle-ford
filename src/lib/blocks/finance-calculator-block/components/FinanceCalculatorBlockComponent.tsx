import type { FinanceCalculatorBlockType, Setting } from '@/payload-types'
import { FinanceCalculatorClient } from '@/lib/blocks/finance-calculator-block/components/FinanceCalculatorClient'
import { getFinanceCalculatorDefaults } from '@/lib/blocks/finance-calculator-block/getFinanceCalculatorDefaults'
import { getCachedGlobal } from '@/lib/utils/getGlobals'

export async function FinanceCalculatorBlockComponent({
  disclaimer,
  defaultPurchasePrice,
}: FinanceCalculatorBlockType) {
  const settings = (await getCachedGlobal('settings', 1)) as Setting
  const defaults = getFinanceCalculatorDefaults(settings)

  return (
    <div className="w-full">
      <FinanceCalculatorClient
        disclaimer={disclaimer}
        defaultPurchasePrice={defaultPurchasePrice}
        defaults={defaults}
      />
    </div>
  )
}
