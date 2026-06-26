'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react'

const PROVINCES = [
  { label: 'Eastern Cape', value: 'EC' },
  { label: 'Free State', value: 'FS' },
  { label: 'Gauteng', value: 'GT' },
  { label: 'KwaZulu-Natal', value: 'KZN' },
  { label: 'Limpopo', value: 'LMP' },
  { label: 'Mpumalanga', value: 'MP' },
  { label: 'Northern Cape', value: 'NC' },
  { label: 'North West', value: 'NW' },
  { label: 'Western Cape', value: 'WC' },
]

const YEAR_MODELS = Array.from({ length: 2026 - 1966 + 1 }, (_, i) => String(2026 - i))

const SERVICE_HISTORY_OPTIONS = [
  { label: 'Full Service History', value: 'YES' },
  { label: 'No Service History', value: 'NO' },
  { label: 'Partial Service History', value: 'PARTIAL' },
  { label: 'Full Service History with Manufacturer', value: 'AGENTS' },
]

type Step1Data = {
  tradingIn: string
  province: string
  yearModel: string
  vehicleMake: string
  vehicleModel: string
  vehicleVariant: string
  colour: string
  odometer: string
  serviceHistory: string
  registration: string
  vin: string
  accident: string
  spareKeys: string
  expectedPrice: string
  accessories: string
}

type Step2Data = {
  firstName: string
  lastName: string
  phone: string
  email: string
}

const initialStep1: Step1Data = {
  tradingIn: '',
  province: '',
  yearModel: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleVariant: '',
  colour: '',
  odometer: '',
  serviceHistory: '',
  registration: '',
  vin: '',
  accident: '',
  spareKeys: '',
  expectedPrice: '',
  accessories: '',
}

const initialStep2: Step2Data = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
}

export default function SellEnquiryForm() {
  const [step, setStep] = useState(1)
  const [step1, setStep1] = useState<Step1Data>(initialStep1)
  const [step2, setStep2] = useState<Step2Data>(initialStep2)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleStep1Select = (field: keyof Step1Data) => (value: string) => {
    setStep1((prev) => ({ ...prev, [field]: value }))
  }

  const handleStep1Change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setStep1((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleStep2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStep2((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const step1Complete =
    step1.tradingIn &&
    step1.province &&
    step1.yearModel &&
    step1.colour &&
    step1.odometer &&
    step1.serviceHistory &&
    step1.registration &&
    step1.accident &&
    step1.spareKeys &&
    step1.expectedPrice

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!privacyAccepted) return
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="py-16 text-center">
          <CheckCircle2 className="size-14 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-primary mb-3">Enquiry Received!</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Thank you, {step2.firstName}! We&apos;ve received your vehicle details and will be in
            touch within one business day with an offer.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false)
              setStep(1)
              setStep1(initialStep1)
              setStep2(initialStep2)
              setPrivacyAccepted(false)
            }}
            variant="outline"
            className="rounded-full"
          >
            Submit Another Enquiry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-3xl mx-auto shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
            Step {step} of 2
          </p>
          <div className="flex gap-1.5">
            <span className={`h-1.5 w-8 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <span className={`h-1.5 w-8 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </div>
        <CardTitle className="text-2xl text-primary">
          {step === 1 ? 'Tell us about your car.' : 'Your contact details.'}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {step === 1
            ? 'Select your vehicle below so we can prepare an accurate offer.'
            : 'Almost done! Let us know how to reach you with our offer.'}
        </p>
      </CardHeader>

      <CardContent>
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setStep(2)
            }}
            className="space-y-4 mt-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Are you trading in?</Label>
                <Select
                  value={step1.tradingIn}
                  onValueChange={handleStep1Select('tradingIn')}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Are you trading in?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YES">Yes</SelectItem>
                    <SelectItem value="NO">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Province</Label>
                <Select
                  value={step1.province}
                  onValueChange={handleStep1Select('province')}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Year Model</Label>
                <Select
                  value={step1.yearModel}
                  onValueChange={handleStep1Select('yearModel')}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_MODELS.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vehicleMake">Vehicle Make</Label>
                <Input
                  id="vehicleMake"
                  name="vehicleMake"
                  placeholder="e.g. Ford, Toyota, BMW"
                  value={step1.vehicleMake}
                  onChange={handleStep1Change}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vehicleModel">Vehicle Model</Label>
                <Input
                  id="vehicleModel"
                  name="vehicleModel"
                  placeholder="e.g. Ranger, Hilux, X5"
                  value={step1.vehicleModel}
                  onChange={handleStep1Change}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vehicleVariant">Vehicle Variant</Label>
                <Input
                  id="vehicleVariant"
                  name="vehicleVariant"
                  placeholder="e.g. 2.0 BiTurbo 4x4"
                  value={step1.vehicleVariant}
                  onChange={handleStep1Change}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="colour">Vehicle Colour</Label>
                <Input
                  id="colour"
                  name="colour"
                  placeholder="e.g. White, Silver"
                  value={step1.colour}
                  onChange={handleStep1Change}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="odometer">Odometer Reading (km)</Label>
                <Input
                  id="odometer"
                  name="odometer"
                  type="number"
                  min="0"
                  placeholder="e.g. 45000"
                  value={step1.odometer}
                  onChange={handleStep1Change}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Service History</Label>
                <Select
                  value={step1.serviceHistory}
                  onValueChange={handleStep1Select('serviceHistory')}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service history" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_HISTORY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="registration">Registration Number</Label>
                <Input
                  id="registration"
                  name="registration"
                  placeholder="e.g. GP 123 456"
                  value={step1.registration}
                  onChange={handleStep1Change}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vin">VIN Number</Label>
                <Input
                  id="vin"
                  name="vin"
                  placeholder="17-character VIN"
                  value={step1.vin}
                  onChange={handleStep1Change}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Accident History</Label>
                <Select
                  value={step1.accident}
                  onValueChange={handleStep1Select('accident')}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Has the vehicle been in an accident?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NO">No</SelectItem>
                    <SelectItem value="YES">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Spare Keys</Label>
                <Select
                  value={step1.spareKeys}
                  onValueChange={handleStep1Select('spareKeys')}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Does the vehicle have spare keys?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YES">Yes</SelectItem>
                    <SelectItem value="NO">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="expectedPrice">Expected Price (R)</Label>
                <Input
                  id="expectedPrice"
                  name="expectedPrice"
                  type="number"
                  min="0"
                  placeholder="e.g. 350000"
                  value={step1.expectedPrice}
                  onChange={handleStep1Change}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="accessories">Extra Accessories / Notes</Label>
              <Textarea
                id="accessories"
                name="accessories"
                placeholder="List any additional accessories, modifications or notes about the vehicle…"
                value={step1.accessories}
                onChange={handleStep1Change}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full rounded-full gap-2" disabled={!step1Complete}>
              Next — Your Details
              <ChevronRight className="size-4" />
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Jane"
                  value={step2.firstName}
                  onChange={handleStep2Change}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={step2.lastName}
                  onChange={handleStep2Change}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="0123456789"
                  pattern="\d{10}"
                  title="Please enter exactly 10 digits."
                  value={step2.phone}
                  onChange={handleStep2Change}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={step2.email}
                  onChange={handleStep2Change}
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <Checkbox
                id="privacy"
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                className="mt-0.5"
              />
              <Label htmlFor="privacy" className="text-sm font-normal leading-snug cursor-pointer">
                I have read and agree to the{' '}
                <Link href="/privacy-policy" className="text-primary underline underline-offset-2">
                  Eagle Ford (Pty) Ltd Privacy Policy
                </Link>
              </Label>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-full gap-2 flex-1"
                onClick={() => setStep(1)}
              >
                <ChevronLeft className="size-4" />
                Back
              </Button>
              <Button
                type="submit"
                className="rounded-full flex-1"
                disabled={isSubmitting || !privacyAccepted}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  'Submit Enquiry'
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
