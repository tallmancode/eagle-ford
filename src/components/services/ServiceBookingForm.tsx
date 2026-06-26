'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

const FORD_MODELS = [
  'Everest',
  'Mustang Dark Horse',
  'Mustang GT',
  'New Level Territory',
  'New Tourneo Custom',
  'New Transit Custom',
  'Next Level Everest',
  'Next Level Ranger',
  'Ranger',
  'Ranger Double Cab',
  'Ranger Platinum',
  'Ranger Raptor',
  'Ranger Single Cab',
  'Ranger Sport',
  'Ranger Super Cab',
  'Ranger Tremor',
  'Ranger Wildtrak',
  'Ranger Wildtrak Super Cab',
  'Ranger Wildtrak X',
  'Ranger XL',
  'Ranger XLT',
  'Territory',
  'Transit Van',
  'Other',
]

type FormData = {
  firstName: string
  lastName: string
  phone: string
  email: string
  registration: string
  vin: string
  mileage: string
  preferredDate: string
  model: string
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  registration: '',
  vin: '',
  mileage: '',
  preferredDate: '',
  model: '',
}

export default function ServiceBookingForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [modelError, setModelError] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!privacyAccepted) return
    if (!formData.model) {
      setModelError(true)
      return
    }
    setModelError(false)
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData(initialFormData)
    setPrivacyAccepted(false)
  }

  if (submitted) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="py-12 text-center">
          <h3 className="text-2xl font-bold text-primary mb-3">Booking Request Received</h3>
          <p className="text-muted-foreground mb-6">
            Thank you! A member of our service team will be in touch shortly to confirm your
            appointment.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-full">
            Book Another Service
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-3xl mx-auto shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl text-primary">Book a Service</CardTitle>
        <p className="text-sm text-muted-foreground">
          Complete the form below and we&apos;ll confirm your booking within 24 hours.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jane"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0123456789"
                pattern="\d{10}"
                title="Please enter exactly 10 digits (no spaces or letters)."
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="registration">Registration Number</Label>
              <Input
                id="registration"
                name="registration"
                value={formData.registration}
                onChange={handleChange}
                placeholder="GP 123 456"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vin">VIN Number</Label>
              <Input
                id="vin"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                placeholder="17-character VIN"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mileage">Current Mileage (km)</Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                min="0"
                value={formData.mileage}
                onChange={handleChange}
                placeholder="e.g. 45000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="preferredDate">Preferred Service Date</Label>
              <Input
                id="preferredDate"
                name="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="model">Vehicle Model</Label>
            <Select
              value={formData.model}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, model: value }))
                setModelError(false)
              }}
            >
              <SelectTrigger
                id="model"
                className={`w-full${modelError ? ' border-destructive' : ''}`}
              >
                <SelectValue placeholder="Select your Ford model" />
              </SelectTrigger>
              <SelectContent>
                {FORD_MODELS.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {modelError && (
              <p className="text-destructive text-xs mt-1">Please select a vehicle model.</p>
            )}
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

          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={isSubmitting || !privacyAccepted}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Submitting…
              </>
            ) : (
              'Submit Booking Request'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
