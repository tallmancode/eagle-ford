'use client'

import { useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { calculateRepayment } from '@/lib/blocks/finance-calculator-block/calculateRepayment'
import { formatCalculatorPrice } from '@/lib/blocks/finance-calculator-block/formatCalculatorPrice'
import { cn } from '@/lib/utils/cn'

type AutoLoanCalculatorClientProps = {
  heading: string
  description?: string | null
  calculateLabel?: string | null
  disclaimer?: string | null
  defaultPrice: number
  defaultInterestRate: number
  defaultTermYears: number
  defaultDownPayment: number
  panelStyle?: CSSProperties
  buttonStyle?: CSSProperties
}

function Field({
  id,
  label,
  value,
  onChange,
  suffix,
}: {
  id: string
  label: string
  value: string
  onChange: (next: string) => void
  suffix?: string
}) {
  return (
    <label
      htmlFor={id}
      className="relative flex h-[58px] flex-col justify-center rounded-xl border border-[#e9e9e9] bg-white px-4 pt-1"
    >
      <span className="text-[13px] leading-none text-[#818181]">
        {label}
        {suffix ? ` ${suffix}` : ''}
      </span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        className="w-full border-0 bg-transparent p-0 text-[15px] text-foreground outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[^\d.]/g, ''))}
      />
    </label>
  )
}

export function AutoLoanCalculatorClient({
  heading,
  description,
  calculateLabel = 'Calculate',
  disclaimer,
  defaultPrice,
  defaultInterestRate,
  defaultTermYears,
  defaultDownPayment,
  panelStyle,
  buttonStyle,
}: AutoLoanCalculatorClientProps) {
  const [price, setPrice] = useState(String(defaultPrice))
  const [interestRate, setInterestRate] = useState(String(defaultInterestRate))
  const [termYears, setTermYears] = useState(String(defaultTermYears))
  const [downPayment, setDownPayment] = useState(String(defaultDownPayment))
  const [submitted, setSubmitted] = useState(false)

  const result = useMemo(() => {
    if (!submitted) return null
    const purchasePrice = Number(price)
    const annualInterestRate = Number(interestRate)
    const years = Number(termYears)
    const deposit = Number(downPayment)
    if (!Number.isFinite(years) || years <= 0) return null

    return calculateRepayment({
      purchasePrice,
      deposit,
      annualInterestRate,
      termMonths: Math.round(years * 12),
      balloonPercent: 0,
    })
  }, [submitted, price, interestRate, termYears, downPayment])

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div
      className="flex h-full flex-col justify-center rounded-2xl bg-[#050b20] px-8 py-12 text-white sm:px-10 lg:px-12"
      style={panelStyle}
    >
      <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
      {description ? (
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/90">{description}</p>
      ) : null}

      <form className="mt-8 flex flex-col gap-5" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="auto-loan-price" label="Price" suffix="(R)" value={price} onChange={setPrice} />
          <Field
            id="auto-loan-rate"
            label="Interest Rate"
            suffix="(%)"
            value={interestRate}
            onChange={setInterestRate}
          />
          <Field
            id="auto-loan-term"
            label="Loan Term"
            suffix="(year)"
            value={termYears}
            onChange={setTermYears}
          />
          <Field
            id="auto-loan-deposit"
            label="Down Payment"
            suffix="(R)"
            value={downPayment}
            onChange={setDownPayment}
          />
        </div>

        <button
          type="submit"
          className={cn(
            'inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 text-[15px] font-medium text-white transition hover:bg-primary-600',
          )}
          style={buttonStyle}
        >
          {calculateLabel}
          <ArrowUpRight className="size-3.5" width={14} height={14} aria-hidden />
        </button>
      </form>

      {submitted ? (
        <div className="mt-6 rounded-xl bg-white/10 px-4 py-3 text-sm">
          {result ? (
            <>
              <p className="text-white/70">Estimated monthly repayment</p>
              <p className="mt-1 text-2xl font-bold">
                {formatCalculatorPrice(result.monthlyRepayment)}
              </p>
            </>
          ) : (
            <p className="text-white/90">
              Please enter a valid price, deposit, interest rate, and term.
            </p>
          )}
          {disclaimer ? <p className="mt-2 text-xs text-white/60">{disclaimer}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
