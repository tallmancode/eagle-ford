'use client'

import { CircleHelp } from 'lucide-react'
import { useMemo, useState } from 'react'

import {
  calculateAffordablePrice,
  type DepositMode,
} from '@/lib/blocks/finance-calculator-block/calculateAffordablePrice'
import {
  calculateRepayment,
  getValidationErrorMessage,
  validateFinanceCalculatorInput,
  type FinanceCalculatorResult,
  type FinanceCalculatorValidationError,
} from '@/lib/blocks/finance-calculator-block/calculateRepayment'
import { DepositFields } from '@/lib/blocks/finance-calculator-block/components/DepositFields'
import {
  FinanceCalculatorTabs,
  getFinanceCalculatorPanelId,
  getFinanceCalculatorTabId,
} from '@/lib/blocks/finance-calculator-block/components/FinanceCalculatorTabs'
import { OutlinedField } from '@/lib/blocks/finance-calculator-block/components/OutlinedField'
import { RepaymentPeriodSegment } from '@/lib/blocks/finance-calculator-block/components/RepaymentPeriodSegment'
import {
  BALLOON_HELP_TEXT,
  DEFAULT_BALLOON_PERCENT,
  DEFAULT_DEPOSIT_PERCENT,
  DEFAULT_INTEREST_RATE,
  DEFAULT_PAYMENT_TERM,
  MAX_BALLOON_PERCENT,
  type CalculatorTab,
} from '@/lib/blocks/finance-calculator-block/financeCalculatorOptions'
import type { FinanceCalculatorDefaults } from '@/lib/blocks/finance-calculator-block/getFinanceCalculatorDefaults'
import { formatCalculatorPrice } from '@/lib/blocks/finance-calculator-block/formatCalculatorPrice'
import {
  formatCalculatorDecimal,
  formatCalculatorInteger,
  parseCalculatorNumber,
} from '@/lib/blocks/finance-calculator-block/parseCalculatorNumber'
import { Button } from '@/components/ui/button'

type FinanceCalculatorMode = 'full' | 'repaymentOnly'

type FinanceCalculatorClientProps = {
  disclaimer?: string | null
  defaultPurchasePrice?: number | null
  mode?: FinanceCalculatorMode
  defaults?: FinanceCalculatorDefaults | null
}

type CalculatorFormState = {
  vehiclePrice: string
  monthlyInstallment: string
  depositAmount: string
  depositPercent: string
  depositMode: DepositMode
  interestRate: string
  balloonPercent: string
  paymentTerm: number
}

function getInitialVehiclePrice(defaultPurchasePrice?: number | null): string {
  if (defaultPurchasePrice != null && defaultPurchasePrice > 0) {
    return formatCalculatorInteger(defaultPurchasePrice)
  }

  return ''
}

function clampBalloonInput(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) {
    return value
  }

  const parsed = parseCalculatorNumber(value)
  if (!Number.isFinite(parsed)) {
    return value
  }

  if (parsed > MAX_BALLOON_PERCENT) {
    return formatCalculatorDecimal(MAX_BALLOON_PERCENT, 2)
  }

  if (parsed < 0) {
    return '0'
  }

  return value
}

function createInitialFormState(
  defaultPurchasePrice?: number | null,
  defaults?: FinanceCalculatorDefaults | null,
): CalculatorFormState {
  const vehiclePrice = getInitialVehiclePrice(defaultPurchasePrice)
  const purchasePrice = parseCalculatorNumber(vehiclePrice)

  const depositAmountValue = defaults?.depositAmount ?? 0
  const hasDepositAmount = depositAmountValue > 0
  const interestRate =
    defaults != null ? formatCalculatorDecimal(defaults.interestRate, 2) : DEFAULT_INTEREST_RATE
  const balloonPercent =
    defaults != null
      ? formatCalculatorDecimal(
          Math.min(MAX_BALLOON_PERCENT, Math.max(0, defaults.balloonPayment)),
          defaults.balloonPayment % 1 === 0 ? 0 : 2,
        )
      : DEFAULT_BALLOON_PERCENT
  const paymentTerm = defaults?.repaymentPeriod ?? DEFAULT_PAYMENT_TERM

  const depositAmount = hasDepositAmount ? formatCalculatorInteger(depositAmountValue) : '0'
  let depositPercent = DEFAULT_DEPOSIT_PERCENT
  const depositMode: DepositMode = hasDepositAmount ? 'amount' : 'percent'

  if (hasDepositAmount && Number.isFinite(purchasePrice) && purchasePrice > 0) {
    depositPercent = formatCalculatorDecimal((depositAmountValue / purchasePrice) * 100, 2)
  }

  return {
    vehiclePrice,
    monthlyInstallment: '',
    depositAmount,
    depositPercent,
    depositMode,
    interestRate,
    balloonPercent,
    paymentTerm,
  }
}

function resolveDeposit(
  purchasePrice: number,
  depositAmount: string,
  depositPercent: string,
  depositMode: DepositMode,
): number {
  if (depositMode === 'percent') {
    return purchasePrice * (parseCalculatorNumber(depositPercent) / 100)
  }

  return parseCalculatorNumber(depositAmount) || 0
}

export function FinanceCalculatorClient({
  disclaimer,
  defaultPurchasePrice,
  mode = 'full',
  defaults,
}: FinanceCalculatorClientProps) {
  const isRepaymentOnly = mode === 'repaymentOnly'

  const initialFormState = useMemo(
    () => createInitialFormState(defaultPurchasePrice, defaults),
    [defaultPurchasePrice, defaults],
  )

  const [activeTab, setActiveTab] = useState<CalculatorTab>('monthlyInstallments')
  const [formState, setFormState] = useState<CalculatorFormState>(initialFormState)
  const [result, setResult] = useState<FinanceCalculatorResult | null>(null)
  const [error, setError] = useState<FinanceCalculatorValidationError | null>(null)

  const syncVehiclePrice = isRepaymentOnly
    ? parseCalculatorNumber(formState.vehiclePrice)
    : activeTab === 'monthlyInstallments'
      ? parseCalculatorNumber(formState.vehiclePrice)
      : (result?.purchasePrice ?? null)

  const updateFormState = (partial: Partial<CalculatorFormState>) => {
    setFormState((current) => ({ ...current, ...partial }))
  }

  const handleDepositAmountChange = (value: string) => {
    const nextState: Partial<CalculatorFormState> = {
      depositMode: 'amount',
      depositAmount: value,
    }

    if (Number.isFinite(syncVehiclePrice) && (syncVehiclePrice ?? 0) > 0) {
      const amount = parseCalculatorNumber(value)
      if (Number.isFinite(amount)) {
        nextState.depositPercent = formatCalculatorDecimal((amount / syncVehiclePrice!) * 100, 2)
      }
    }

    updateFormState(nextState)
  }

  const handleDepositPercentChange = (value: string) => {
    const nextState: Partial<CalculatorFormState> = {
      depositMode: 'percent',
      depositPercent: value,
    }

    if (Number.isFinite(syncVehiclePrice) && (syncVehiclePrice ?? 0) > 0) {
      const percent = parseCalculatorNumber(value)
      if (Number.isFinite(percent)) {
        nextState.depositAmount = formatCalculatorInteger(syncVehiclePrice! * (percent / 100))
      }
    }

    updateFormState(nextState)
  }

  const handleBalloonPercentChange = (value: string) => {
    updateFormState({ balloonPercent: clampBalloonInput(value) })
  }

  const handleCalculate = () => {
    const annualInterestRate = parseCalculatorNumber(formState.interestRate)
    const balloonPercent = parseCalculatorNumber(formState.balloonPercent) || 0

    if (isRepaymentOnly || activeTab === 'monthlyInstallments') {
      const purchasePrice = parseCalculatorNumber(formState.vehiclePrice)
      const deposit = resolveDeposit(
        purchasePrice,
        formState.depositAmount,
        formState.depositPercent,
        formState.depositMode,
      )

      const input = {
        purchasePrice,
        deposit,
        annualInterestRate,
        termMonths: formState.paymentTerm,
        balloonPercent,
      }

      const validationError = validateFinanceCalculatorInput(input)
      if (validationError) {
        setError(validationError)
        setResult(null)
        return
      }

      const calculation = calculateRepayment(input)
      setError(null)
      setResult(calculation)
      return
    }

    const { result: affordableResult, error: affordableError } = calculateAffordablePrice({
      monthlyInstallment: parseCalculatorNumber(formState.monthlyInstallment),
      depositAmount: parseCalculatorNumber(formState.depositAmount) || 0,
      depositPercent: parseCalculatorNumber(formState.depositPercent) || 0,
      depositMode: formState.depositMode,
      annualInterestRate,
      termMonths: formState.paymentTerm,
      balloonPercent,
    })

    if (affordableError || !affordableResult) {
      setError(affordableError ?? 'unaffordable')
      setResult(null)
      return
    }

    setError(null)
    setResult(affordableResult)
  }

  const handleReset = () => {
    setFormState(initialFormState)
    setResult(null)
    setError(null)
  }

  const showMonthlyRepaymentResult = isRepaymentOnly || activeTab === 'monthlyInstallments'

  const primaryResultLabel = showMonthlyRepaymentResult
    ? 'Estimated monthly repayment'
    : 'Estimated vehicle price'

  const primaryResultValue = showMonthlyRepaymentResult
    ? result
      ? formatCalculatorPrice(Math.round(result.monthlyRepayment))
      : null
    : result
      ? formatCalculatorPrice(Math.round(result.purchasePrice))
      : null

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        {!isRepaymentOnly && (
          <FinanceCalculatorTabs activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleCalculate()
          }}
          className="flex flex-col gap-4"
          aria-label="Vehicle finance calculator"
        >
          <div
            role={isRepaymentOnly ? undefined : 'tabpanel'}
            id={isRepaymentOnly ? undefined : getFinanceCalculatorPanelId(activeTab)}
            aria-labelledby={isRepaymentOnly ? undefined : getFinanceCalculatorTabId(activeTab)}
          >
            {showMonthlyRepaymentResult ? (
              <OutlinedField
                id="vehiclePrice"
                label="Vehicle Price"
                value={formState.vehiclePrice}
                onChange={(value) => updateFormState({ vehiclePrice: value })}
              />
            ) : (
              <OutlinedField
                id="monthlyInstallment"
                label="Monthly Installment"
                value={formState.monthlyInstallment}
                onChange={(value) => updateFormState({ monthlyInstallment: value })}
              />
            )}
          </div>

          <DepositFields
            depositAmount={formState.depositAmount}
            depositPercent={formState.depositPercent}
            onDepositAmountChange={handleDepositAmountChange}
            onDepositPercentChange={handleDepositPercentChange}
          />

          <OutlinedField
            id="interestRate"
            label="Interest Rate %"
            value={formState.interestRate}
            onChange={(value) => updateFormState({ interestRate: value })}
            inputMode="decimal"
          />

          <div>
            <OutlinedField
              id="balloonPercent"
              label="Balloon Payment %"
              value={formState.balloonPercent}
              onChange={handleBalloonPercentChange}
              inputMode="decimal"
              trailing={
                <button
                  type="button"
                  className="text-neutral-400 transition-colors hover:text-neutral-600"
                  title="Balloon payment is a lump sum due at the end of the finance term."
                  aria-label="Balloon payment help"
                >
                  <CircleHelp className="size-4" />
                </button>
              }
            />
            <p className="mt-2 text-xs italic text-neutral-500">{BALLOON_HELP_TEXT}</p>
          </div>

          <RepaymentPeriodSegment
            value={formState.paymentTerm}
            onChange={(paymentTerm) => updateFormState({ paymentTerm })}
          />

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {getValidationErrorMessage(error)}
            </p>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button
              type="submit"
              className="h-12 flex-1 bg-primary-500 text-base font-semibold text-white hover:bg-primary-600 sm:flex-none sm:px-8"
            >
              Calculate
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="h-12 flex-1 text-base font-semibold sm:flex-none sm:px-8"
            >
              Reset
            </Button>
          </div>
        </form>

        {result && primaryResultValue && (
          <div className="mt-6 border-t border-neutral-100 pt-6">
            <p className="text-sm text-neutral-500">{primaryResultLabel}</p>
            <p className="mt-1 text-3xl font-bold text-neutral-900">{primaryResultValue}</p>

            <dl className="mt-4 space-y-3">
              {!isRepaymentOnly && activeTab === 'purchasePrice' && (
                <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-3">
                  <dt className="text-sm text-neutral-500">Estimated monthly repayment</dt>
                  <dd className="text-sm font-medium text-neutral-900">
                    {formatCalculatorPrice(Math.round(result.monthlyRepayment))}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-3">
                <dt className="text-sm text-neutral-500">Amount financed</dt>
                <dd className="text-sm font-medium text-neutral-900">
                  {formatCalculatorPrice(Math.round(result.financedAmount))}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-3">
                <dt className="text-sm text-neutral-500">Balloon due at end</dt>
                <dd className="text-sm font-medium text-neutral-900">
                  {formatCalculatorPrice(Math.round(result.balloonAmount))}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-neutral-500">Total interest</dt>
                <dd className="text-sm font-medium text-neutral-900">
                  {formatCalculatorPrice(Math.round(result.totalInterest))}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {disclaimer && (
          <p className="mt-6 text-xs leading-relaxed text-neutral-500">{disclaimer}</p>
        )}
      </div>
    </div>
  )
}
