import {
  calculateRepayment,
  getAnnuityFactor,
  validateInterestRate,
  type FinanceCalculatorResult,
  type FinanceCalculatorValidationError,
} from '@/lib/blocks/finance-calculator-block/calculateRepayment'
import { MAX_BALLOON_PERCENT } from '@/lib/blocks/finance-calculator-block/financeCalculatorOptions'

export type DepositMode = 'amount' | 'percent'

export type AffordablePriceInput = {
  monthlyInstallment: number
  depositAmount: number
  depositPercent: number
  depositMode: DepositMode
  annualInterestRate: number
  termMonths: number
  balloonPercent: number
}

export type AffordablePriceResult = FinanceCalculatorResult

export function validateAffordablePriceInput(
  input: AffordablePriceInput,
): FinanceCalculatorValidationError | null {
  const interestError = validateInterestRate(input.annualInterestRate)
  if (interestError) {
    return interestError
  }

  if (!Number.isFinite(input.monthlyInstallment) || input.monthlyInstallment <= 0) {
    return 'monthlyInstallmentRequired'
  }

  if (
    input.depositMode === 'amount' &&
    (!Number.isFinite(input.depositAmount) || input.depositAmount < 0)
  ) {
    return 'depositInvalid'
  }

  if (
    input.depositMode === 'percent' &&
    (!Number.isFinite(input.depositPercent) ||
      input.depositPercent < 0 ||
      input.depositPercent >= 100)
  ) {
    return 'depositInvalid'
  }

  if (!Number.isFinite(input.balloonPercent) || input.balloonPercent < 0) {
    return 'balloonExceedsFinanced'
  }

  if (input.balloonPercent > MAX_BALLOON_PERCENT) {
    return 'balloonExceedsMax'
  }

  return null
}

function calculatePurchasePrice(input: AffordablePriceInput): number | null {
  const monthlyRate = input.annualInterestRate / 12 / 100
  const months = input.termMonths
  const annuityFactor = getAnnuityFactor(monthlyRate, months)
  const balloonFactor =
    monthlyRate === 0
      ? input.balloonPercent / 100
      : input.balloonPercent / 100 / (1 + monthlyRate) ** months

  if (input.depositMode === 'percent') {
    const depositFactor = input.depositPercent / 100
    const coefficient = (1 - depositFactor - balloonFactor) * annuityFactor

    if (!Number.isFinite(coefficient) || coefficient <= 0) {
      return null
    }

    return input.monthlyInstallment / coefficient
  }

  const denominator = 1 - balloonFactor
  if (!Number.isFinite(denominator) || denominator <= 0) {
    return null
  }

  return (input.monthlyInstallment / annuityFactor + input.depositAmount) / denominator
}

export function calculateAffordablePrice(input: AffordablePriceInput): {
  result: AffordablePriceResult | null
  error: FinanceCalculatorValidationError | null
} {
  const validationError = validateAffordablePriceInput(input)
  if (validationError) {
    return { result: null, error: validationError }
  }

  const purchasePrice = calculatePurchasePrice(input)
  if (purchasePrice == null || !Number.isFinite(purchasePrice) || purchasePrice <= 0) {
    return { result: null, error: 'unaffordable' }
  }

  const deposit =
    input.depositMode === 'percent'
      ? purchasePrice * (input.depositPercent / 100)
      : input.depositAmount

  const forwardResult = calculateRepayment({
    purchasePrice,
    deposit,
    annualInterestRate: input.annualInterestRate,
    termMonths: input.termMonths,
    balloonPercent: input.balloonPercent,
  })

  if (!forwardResult) {
    return { result: null, error: 'unaffordable' }
  }

  return { result: forwardResult, error: null }
}
