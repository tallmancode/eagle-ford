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
import { Loader2, CheckCircle2 } from 'lucide-react'

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
  'Ranger Platinum',
  'Ranger Raptor',
  'Ranger Single Cab',
  'Ranger Sport',
  'Ranger Super Cab',
  'Ranger Tremor',
  'Ranger Wildtrak',
  'Ranger Wildtrak X',
  'Ranger XL',
  'Ranger XLT',
  'Transit Van',
]

type FormData = {
  firstName: string
  lastName: string
  phone: string
  email: string
  model: string
  preferredDate: string
  message: string
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  model: '',
  preferredDate: '',
  message: '',
}

export default function TestDriveBookingForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [modelError, setModelError] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          <CheckCircle2 className="size-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-primary mb-3">Test Drive Request Received</h3>
          <p className="text-muted-foreground mb-6">
            Thank you! A member of our sales team will be in touch shortly to confirm your test
            drive appointment.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-full">
            Book Another Test Drive
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-3xl mx-auto shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl text-primary">Book a Test Drive</CardTitle>
        <p className="text-sm text-muted-foreground">
          Complete the form below and we&apos;ll confirm your booking within one business day.
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
              <Label htmlFor="preferredDate">Preferred Test Drive Date</Label>
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
            <Label htmlFor="model">Model</Label>
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
                <SelectValue placeholder="Select a Ford model" />
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

          <div className="space-y-1.5">
            <Label htmlFor="message">Question / Comment</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Any questions or special requests?"
              rows={4}
            />
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
              'Submit'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
