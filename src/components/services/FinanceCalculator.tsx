'use client'

import { useState, useMemo } from 'react'
import { Calculator } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const TERMS = [12, 24, 36, 48, 60, 72] as const

function formatZAR(value: number) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function calculatePMT(
  purchasePrice: number,
  deposit: number,
  annualRate: number,
  termMonths: number,
  balloonPct: number,
): { monthly: number; total: number; balloonAmount: number } | null {
  if (!purchasePrice || !annualRate || !termMonths) return null

  const balloonAmount = (balloonPct / 100) * purchasePrice
  const principal = purchasePrice - deposit - balloonAmount

  if (principal <= 0) return null

  const monthlyRate = annualRate / 100 / 12

  let monthly: number
  if (monthlyRate === 0) {
    monthly = principal / termMonths
  } else {
    const factor = Math.pow(1 + monthlyRate, termMonths)
    // PMT on principal, with balloon's PV deducted
    const pvBalloon = balloonAmount / factor
    const adjustedPrincipal = principal - pvBalloon
    monthly = (adjustedPrincipal * (monthlyRate * factor)) / (factor - 1)
  }

  if (!isFinite(monthly) || monthly <= 0) return null

  return {
    monthly,
    total: monthly * termMonths + balloonAmount,
    balloonAmount,
  }
}

export default function FinanceCalculator() {
  const [purchasePrice, setPurchasePrice] = useState('')
  const [deposit, setDeposit] = useState('')
  const [interestRate, setInterestRate] = useState('11.25')
  const [term, setTerm] = useState<string>('60')
  const [balloon, setBalloon] = useState('0')

  const result = useMemo(() => {
    const price = parseFloat(purchasePrice.replace(/\s/g, '').replace(',', '.'))
    const dep = parseFloat(deposit.replace(/\s/g, '').replace(',', '.')) || 0
    const rate = parseFloat(interestRate) || 0
    const months = parseInt(term) || 0
    const balloonPct = parseFloat(balloon) || 0

    if (!price || price <= 0) return null
    return calculatePMT(price, dep, rate, months, balloonPct)
  }, [purchasePrice, deposit, interestRate, term, balloon])

  const hasInput = purchasePrice.trim() !== ''

  return (
    <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-primary px-6 py-4 flex items-center gap-3">
        <Calculator className="size-5 text-white" />
        <h3 className="text-white font-semibold text-lg">Finance Calculator</h3>
      </div>

      <div className="p-6 space-y-5">
        {/* Inputs grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="fc-price">Purchase Price (R)</Label>
            <Input
              id="fc-price"
              type="number"
              min={0}
              placeholder="e.g. 450000"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fc-deposit">Deposit (R)</Label>
            <Input
              id="fc-deposit"
              type="number"
              min={0}
              placeholder="e.g. 50000"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fc-rate">Interest Rate (%)</Label>
            <Input
              id="fc-rate"
              type="number"
              min={0}
              max={50}
              step={0.25}
              placeholder="e.g. 11.25"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fc-term">Payment Term</Label>
            <Select value={term} onValueChange={setTerm}>
              <SelectTrigger id="fc-term">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                {TERMS.map((t) => (
                  <SelectItem key={t} value={String(t)}>
                    {t} Months
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="fc-balloon">Balloon Payment (%)</Label>
            <Input
              id="fc-balloon"
              type="number"
              min={0}
              max={50}
              step={1}
              placeholder="0"
              value={balloon}
              onChange={(e) => setBalloon(e.target.value)}
            />
          </div>
        </div>

        {/* Results */}
        <div className="border rounded-xl p-5 bg-muted/40 space-y-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            Your Estimated Terms*
          </p>

          {!hasInput ? (
            <p className="text-sm text-muted-foreground">
              Complete the fields above to see your estimated monthly instalment.
            </p>
          ) : result ? (
            <>
              <div className="flex items-end justify-between">
                <span className="text-sm text-muted-foreground">Monthly Instalment</span>
                <span className="text-3xl font-bold text-primary">{formatZAR(result.monthly)}</span>
              </div>

              <div className="border-t pt-3 grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">Interest Rate</span>
                <span className="text-right font-medium">{interestRate}%</span>

                <span className="text-muted-foreground">Term</span>
                <span className="text-right font-medium">{term} months</span>

                <span className="text-muted-foreground">Deposit</span>
                <span className="text-right font-medium">
                  {formatZAR(parseFloat(deposit) || 0)}
                </span>

                {result.balloonAmount > 0 && (
                  <>
                    <span className="text-muted-foreground">Balloon Payment</span>
                    <span className="text-right font-medium">
                      {formatZAR(result.balloonAmount)}
                    </span>
                  </>
                )}

                <span className="text-muted-foreground">Total Repayments</span>
                <span className="text-right font-medium">{formatZAR(result.total)}</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-destructive">
              Please check your inputs — the price must exceed the deposit.
            </p>
          )}

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            *Excludes finance initiation and admin fees. This is an estimate only and is subject to
            bank credit approval. Ts &amp; Cs apply.
          </p>
        </div>
      </div>
    </div>
  )
}
