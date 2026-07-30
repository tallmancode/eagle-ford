export const DEFAULT_INTEREST_RATE = '11,25'
export const DEFAULT_INTEREST_RATE_NUMBER = 11.25
export const DEFAULT_PAYMENT_TERM = 72 as const
export const DEFAULT_BALLOON_PERCENT = '0'
export const DEFAULT_DEPOSIT_PERCENT = '0'
export const DEFAULT_DEPOSIT_AMOUNT = 0
export const MAX_BALLOON_PERCENT = 35

export const REPAYMENT_PERIOD_OPTIONS = [36, 48, 54, 60, 72] as const

export type RepaymentPeriodOption = (typeof REPAYMENT_PERIOD_OPTIONS)[number]

export const BALLOON_HELP_TEXT =
  'Balloon payments are typically only available for vehicles up to 6 years old and cannot exceed 35%'

export type CalculatorTab = 'monthlyInstallments' | 'purchasePrice'

export const CALCULATOR_TABS: { id: CalculatorTab; label: string }[] = [
  { id: 'monthlyInstallments', label: 'Monthly Installments' },
  { id: 'purchasePrice', label: 'Purchase Price' },
]
