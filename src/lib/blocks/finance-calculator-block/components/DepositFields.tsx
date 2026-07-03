import { OutlinedField } from '@/lib/blocks/finance-calculator-block/components/OutlinedField'

type DepositFieldsProps = {
  depositAmount: string
  depositPercent: string
  onDepositAmountChange: (value: string) => void
  onDepositPercentChange: (value: string) => void
}

export function DepositFields({
  depositAmount,
  depositPercent,
  onDepositAmountChange,
  onDepositPercentChange,
}: DepositFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr]">
      <OutlinedField
        id="depositAmount"
        label="Deposit Amount"
        value={depositAmount}
        onChange={onDepositAmountChange}
      />
      <OutlinedField
        id="depositPercent"
        label="Deposit %"
        value={depositPercent}
        onChange={onDepositPercentChange}
        inputMode="decimal"
      />
    </div>
  )
}
