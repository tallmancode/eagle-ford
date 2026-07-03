export type FinanceCalculatorInput = {
  purchasePrice: number
  deposit: number
  annualInterestRate: number
  termMonths: number
  balloonPercent: number
}

export type FinanceCalculatorResult = {
  monthlyRepayment: number
  purchasePrice: number
  financedAmount: number
  balloonAmount: number
  totalInterest: number
}

export type FinanceCalculatorValidationError =
  | 'purchasePriceRequired'
  | 'monthlyInstallmentRequired'
  | 'depositInvalid'
  | 'balloonExceedsFinanced'
  | 'interestRateInvalid'
  | 'unaffordable'

const ERROR_MESSAGES: Record<FinanceCalculatorValidationError, string> = {
  purchasePriceRequired: 'Please enter a valid vehicle price.',
  monthlyInstallmentRequired: 'Please enter a valid monthly installment.',
  depositInvalid: 'Deposit must be zero or greater and less than the vehicle price.',
  balloonExceedsFinanced: 'The balloon payment exceeds the amount being financed.',
  interestRateInvalid: 'Please enter a valid interest rate.',
  unaffordable:
    'These values do not produce an affordable vehicle price. Try adjusting your inputs.',
}

export function getValidationErrorMessage(error: FinanceCalculatorValidationError): string {
  return ERROR_MESSAGES[error]
}

export function validateInterestRate(rate: number): FinanceCalculatorValidationError | null {
  if (!Number.isFinite(rate) || rate < 0) {
    return 'interestRateInvalid'
  }

  return null
}

export function getAnnuityFactor(monthlyRate: number, months: number): number {
  if (monthlyRate === 0) {
    return 1 / months
  }

  const compoundFactor = (1 + monthlyRate) ** months
  return (monthlyRate * compoundFactor) / (compoundFactor - 1)
}

export function validateFinanceCalculatorInput(
  input: FinanceCalculatorInput,
): FinanceCalculatorValidationError | null {
  const interestError = validateInterestRate(input.annualInterestRate)
  if (interestError) {
    return interestError
  }

  if (!Number.isFinite(input.purchasePrice) || input.purchasePrice <= 0) {
    return 'purchasePriceRequired'
  }

  if (
    !Number.isFinite(input.deposit) ||
    input.deposit < 0 ||
    input.deposit >= input.purchasePrice
  ) {
    return 'depositInvalid'
  }

  const financedAmount = input.purchasePrice - input.deposit
  const balloonAmount = input.purchasePrice * (input.balloonPercent / 100)

  if (balloonAmount >= financedAmount) {
    return 'balloonExceedsFinanced'
  }

  return null
}

/**
 * SA vehicle finance PMT with balloon (residual) as future value.
 * Balloon is calculated as a percentage of purchase price.
 */
export function calculateRepayment(input: FinanceCalculatorInput): FinanceCalculatorResult | null {
  const validationError = validateFinanceCalculatorInput(input)
  if (validationError) {
    return null
  }

  const financedAmount = input.purchasePrice - input.deposit
  const balloonAmount = input.purchasePrice * (input.balloonPercent / 100)
  const monthlyRate = input.annualInterestRate / 12 / 100
  const months = input.termMonths
  const annuityFactor = getAnnuityFactor(monthlyRate, months)

  let monthlyRepayment: number

  if (monthlyRate === 0) {
    monthlyRepayment = (financedAmount - balloonAmount) / months
  } else {
    const compoundFactor = (1 + monthlyRate) ** months
    const presentValueOfBalloon = balloonAmount / compoundFactor
    monthlyRepayment = (financedAmount - presentValueOfBalloon) * annuityFactor
  }

  const totalPaid = monthlyRepayment * months + balloonAmount
  const totalInterest = totalPaid - financedAmount

  return {
    monthlyRepayment,
    purchasePrice: input.purchasePrice,
    financedAmount,
    balloonAmount,
    totalInterest,
  }
}
