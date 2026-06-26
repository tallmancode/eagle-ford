'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle2 } from 'lucide-react'

type FormData = {
  firstName: string
  lastName: string
  phone: string
  email: string
  message: string
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  message: '',
}

export default function EnquiryForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!privacyAccepted) return
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
          <h3 className="text-2xl font-bold text-primary mb-3">Enquiry Received</h3>
          <p className="text-muted-foreground mb-6">
            Thank you for reaching out. A member of our team will be in touch with you shortly.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-full">
            Send Another Enquiry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-3xl mx-auto shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl text-primary">Enquire Now</CardTitle>
        <p className="text-sm text-muted-foreground">
          Fill in the form below and our team will get back to you as soon as possible.
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
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Question / Comment</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we help you?"
              rows={5}
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
