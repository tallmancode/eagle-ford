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
  message: string
  privacyPolicy: boolean
}

type FormErrors = Partial<Record<keyof FormData, string>>

const INITIAL: FormData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  message: '',
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
  if (!data.privacyPolicy) errors.privacyPolicy = 'You must accept the privacy policy'
  return errors
}

export default function PaintPanelEnquiryForm() {
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
    // Replace with actual API call when available
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
          Thank you for your enquiry. Our paint &amp; panel team will be in touch with you shortly.
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
          <Label htmlFor="pp-firstName">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pp-firstName"
            value={form.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
            aria-invalid={!!errors.firstName}
            placeholder="e.g. John"
          />
          {errors.firstName && <p className="text-destructive text-xs">{errors.firstName}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pp-lastName">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pp-lastName"
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
          <Label htmlFor="pp-phone">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pp-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            aria-invalid={!!errors.phone}
            placeholder="e.g. 010 440 0510"
          />
          {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pp-email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pp-email"
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            aria-invalid={!!errors.email}
            placeholder="e.g. john@example.com"
          />
          {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
        </div>
      </div>

      {/* Question / Comment */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="pp-message">Question / Comment</Label>
        <Textarea
          id="pp-message"
          value={form.message}
          onChange={(e) => setField('message', e.target.value)}
          placeholder="Describe your paint or panel needs, or ask us anything…"
          className="min-h-28"
        />
      </div>

      {/* Privacy policy */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-3">
          <Checkbox
            id="pp-privacy"
            checked={form.privacyPolicy}
            onCheckedChange={(checked) => setField('privacyPolicy', checked === true)}
            aria-invalid={!!errors.privacyPolicy}
          />
          <Label htmlFor="pp-privacy" className="leading-snug cursor-pointer">
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
            'Submit Enquiry'
          )}
        </Button>
      </div>
    </form>
  )
}
