'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Loader2, CheckCircle2 } from 'lucide-react'

type FormData = {
  firstName: string
  lastName: string
  phone: string
  email: string
  vin: string
  description: string
  privacyPolicy: boolean
}

type FormErrors = Partial<Record<keyof FormData, string>>

const INITIAL: FormData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  vin: '',
  description: '',
  privacyPolicy: false,
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.firstName.trim()) errors.firstName = 'First name is required'
  if (!data.lastName.trim()) errors.lastName = 'Last name is required'
  if (!data.phone.trim()) errors.phone = 'Phone number is required'
  if (!data.email.trim()) {
    errors.email = 'Email address is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address'
  }
  if (!data.vin.trim()) errors.vin = 'VIN number is required'
  if (!data.privacyPolicy) errors.privacyPolicy = 'You must accept the privacy policy'
  return errors
}

export default function PartsEnquiryForm() {
  const [form, setForm] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors = validate(form)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setSubmitting(true)
    // Simulate submission — replace with actual API call when available
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <CheckCircle2 className="text-green-500 size-14" />
        <h3 className="text-xl font-semibold">Enquiry Submitted</h3>
        <p className="text-muted-foreground max-w-md">
          Thank you for your enquiry. Our parts team will be in touch with you shortly.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setForm(INITIAL)
            setSubmitted(false)
          }}
        >
          Submit Another Enquiry
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Name row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            value={form.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
            aria-invalid={!!errors.firstName}
            placeholder="e.g. John"
          />
          {errors.firstName && <p className="text-destructive text-xs">{errors.firstName}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            value={form.lastName}
            onChange={(e) => setField('lastName', e.target.value)}
            aria-invalid={!!errors.lastName}
            placeholder="e.g. Smith"
          />
          {errors.lastName && <p className="text-destructive text-xs">{errors.lastName}</p>}
        </div>
      </div>

      {/* Contact row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            aria-invalid={!!errors.phone}
            placeholder="e.g. 010 597 1555"
          />
          {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            aria-invalid={!!errors.email}
            placeholder="e.g. john@example.com"
          />
          {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
        </div>
      </div>

      {/* VIN */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="vin">
            VIN Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="vin"
            value={form.vin}
            onChange={(e) => setField('vin', e.target.value)}
            aria-invalid={!!errors.vin}
            placeholder="17-character VIN"
            maxLength={17}
          />
          {errors.vin && <p className="text-destructive text-xs">{errors.vin}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description of Part</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setField('description', e.target.value)}
          placeholder="Describe the part(s) you need..."
          className="min-h-24"
        />
      </div>

      {/* Privacy policy */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-3">
          <Checkbox
            id="privacy"
            checked={form.privacyPolicy}
            onCheckedChange={(checked) => setField('privacyPolicy', checked === true)}
            aria-invalid={!!errors.privacyPolicy}
          />
          <Label htmlFor="privacy" className="leading-snug cursor-pointer">
            I have read and agree to the Eagle Ford (Pty) Ltd{' '}
            <Link
              href="/privacy-policy"
              className="text-primary underline underline-offset-2 hover:opacity-80"
            >
              Privacy Policy
            </Link>
            <span className="text-destructive"> *</span>
          </Label>
        </div>
        {errors.privacyPolicy && (
          <p className="text-destructive text-xs pl-7">{errors.privacyPolicy}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={submitting} className="rounded-full px-8 min-w-32">
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Submitting…
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </div>
    </form>
  )
}
