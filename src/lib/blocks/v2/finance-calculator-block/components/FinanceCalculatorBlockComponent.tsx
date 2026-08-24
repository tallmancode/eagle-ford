import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { FinanceCalculatorClient } from '@/lib/blocks/finance-calculator-block/components/FinanceCalculatorClient'
import { getFinanceCalculatorDefaults } from '@/lib/blocks/finance-calculator-block/getFinanceCalculatorDefaults'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import type { Setting } from '@/payload-types'

type FinanceCalculatorV2Props = {
  defaultPurchasePrice?: number | null
  disclaimer?: string | null
  styles?: StyleValues | null
  blockType?: string
  id?: string | null
}

export async function FinanceCalculatorV2BlockComponent(props: FinanceCalculatorV2Props) {
  const { disclaimer, defaultPurchasePrice, styles } = props
  const settings = (await getCachedGlobal('settings', 1)) as Setting
  const defaults = getFinanceCalculatorDefaults(settings)
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={['w-full', className].filter(Boolean).join(' ')}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <FinanceCalculatorClient
        disclaimer={disclaimer}
        defaultPurchasePrice={defaultPurchasePrice}
        defaults={defaults}
      />
    </div>
  )
}
