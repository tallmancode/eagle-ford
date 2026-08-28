import type { CSSProperties } from 'react'
import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { resolveColorCss } from '@/lib/blocks/v2/apply/color'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { MediaImage } from '@/components/ui/media-image'
import { getFinanceCalculatorDefaults } from '@/lib/blocks/finance-calculator-block/getFinanceCalculatorDefaults'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import { cn } from '@/lib/utils/cn'
import { AutoLoanCalculatorClient } from '@/lib/blocks/v2/auto-loan-calculator-block/components/AutoLoanCalculatorClient'
import type { AutoLoanCalculatorV2, Media, Setting } from '@/payload-types'

export async function AutoLoanCalculatorV2BlockComponent(props: AutoLoanCalculatorV2) {
  const {
    image,
    imageAlt,
    heading,
    description,
    defaultPrice,
    defaultInterestRate,
    defaultTermYears,
    defaultDownPayment,
    calculateLabel,
    disclaimer,
    mediaSide = 'left',
    panelColor,
    buttonColor,
    styles,
  } = props

  if (!heading?.trim() || !image || typeof image !== 'object') return null

  const media = image as Media
  const settings = (await getCachedGlobal('settings', 1)) as Setting
  const financeDefaults = getFinanceCalculatorDefaults(settings)

  const price = defaultPrice ?? 350000
  const interestRate = defaultInterestRate ?? financeDefaults.interestRate
  const termYears =
    defaultTermYears ?? Math.max(1, Math.round(financeDefaults.repaymentPeriod / 12))
  const downPayment = defaultDownPayment ?? financeDefaults.depositAmount

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  const panelCss = resolveColorCss(panelColor, 'foreground')
  const buttonCss = resolveColorCss(buttonColor, 'primary')

  const panelStyle: CSSProperties | undefined = panelCss ? { backgroundColor: panelCss } : undefined
  const buttonStyle: CSSProperties | undefined = buttonCss
    ? { backgroundColor: buttonCss, borderColor: buttonCss }
    : undefined

  const mediaOnLeft = mediaSide !== 'right'

  return (
    <section
      className={cn('w-full px-4 py-4 sm:px-6 lg:px-8', className)}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-2">
        <div
          className={cn(
            'relative min-h-[280px] overflow-hidden bg-muted lg:min-h-[520px]',
            !mediaOnLeft && 'lg:order-2',
          )}
        >
          <MediaImage
            resource={media}
            alt={imageAlt ?? undefined}
            fill
            imgClassName="object-cover object-center"
            maxWidth={1200}
            size="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className={cn(!mediaOnLeft && 'lg:order-1')}>
          <AutoLoanCalculatorClient
            heading={heading}
            description={description}
            calculateLabel={calculateLabel}
            disclaimer={disclaimer}
            defaultPrice={price}
            defaultInterestRate={interestRate}
            defaultTermYears={termYears}
            defaultDownPayment={downPayment}
            panelStyle={panelStyle}
            buttonStyle={buttonStyle}
          />
        </div>
      </div>
    </section>
  )
}
