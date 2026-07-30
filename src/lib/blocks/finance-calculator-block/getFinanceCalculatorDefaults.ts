import {
  DEFAULT_DEPOSIT_AMOUNT,
  DEFAULT_INTEREST_RATE_NUMBER,
  DEFAULT_PAYMENT_TERM,
  MAX_BALLOON_PERCENT,
  REPAYMENT_PERIOD_OPTIONS,
  type RepaymentPeriodOption,
} from '@/lib/blocks/finance-calculator-block/financeCalculatorOptions'
import type { PricingCalculatorDefaults, Setting } from '@/payload-types'

export type FinanceCalculatorDefaults = {
  depositAmount: number
  interestRate: number
  balloonPayment: number
  repaymentPeriod: RepaymentPeriodOption
}

function isRepaymentPeriodOption(value: number): value is RepaymentPeriodOption {
  return (REPAYMENT_PERIOD_OPTIONS as readonly number[]).includes(value)
}

function resolveRepaymentPeriod(
  value: PricingCalculatorDefaults['repaymentPeriod'] | null | undefined,
): RepaymentPeriodOption {
  if (value == null) {
    return DEFAULT_PAYMENT_TERM
  }

  const parsed = Number.parseInt(value, 10)
  if (Number.isFinite(parsed) && isRepaymentPeriodOption(parsed)) {
    return parsed
  }

  return DEFAULT_PAYMENT_TERM
}

export function getFinanceCalculatorDefaults(
  settings?: Pick<Setting, 'pricingCalculatorDefaults'> | null,
): FinanceCalculatorDefaults {
  const defaults = settings?.pricingCalculatorDefaults

  const depositAmount =
    defaults?.depositAmount != null && Number.isFinite(defaults.depositAmount)
      ? Math.max(0, defaults.depositAmount)
      : DEFAULT_DEPOSIT_AMOUNT

  const interestRate =
    defaults?.interestRate != null && Number.isFinite(defaults.interestRate)
      ? Math.max(0, defaults.interestRate)
      : DEFAULT_INTEREST_RATE_NUMBER

  const balloonPayment =
    defaults?.balloonPayment != null && Number.isFinite(defaults.balloonPayment)
      ? Math.min(MAX_BALLOON_PERCENT, Math.max(0, defaults.balloonPayment))
      : 0

  return {
    depositAmount,
    interestRate,
    balloonPayment,
    repaymentPeriod: resolveRepaymentPeriod(defaults?.repaymentPeriod),
  }
}
