'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

type FormData = {
  firstName: string
  lastName: string
  phone: string
  email: string
  message: string
}

const INITIAL_FORM: FormData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  message: '',
}

type ModelEnquireSectionProps = {
  vehicleName: string
  modelName: string
}

export function ModelEnquireSection({ vehicleName, modelName }: ModelEnquireSectionProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!privacyAccepted) return
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData(INITIAL_FORM)
    setPrivacyAccepted(false)
  }

  return (
    <section id="enquire" className="bg-muted/40 border-t py-14 px-4">
      <div className="container mx-auto max-w-xl">
        <div className="text-center mb-8">
          <h2 className="text-primary text-3xl font-bold mb-3">Enquire Now</h2>
          <p className="text-muted-foreground">
            Interested in the {modelName}? Fill in your details and our team will be in touch.
          </p>
        </div>

        {submitted ? (
          <div className="bg-card border rounded-2xl p-10 text-center shadow-sm">
            <CheckCircle2 className="size-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">Enquiry Received</h3>
            <p className="text-muted-foreground mb-6">
              Thank you! A member of our sales team will be in touch shortly.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-full">
              Submit Another Enquiry
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleFormSubmit}
            className="bg-card border rounded-2xl p-8 shadow-sm space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="model-enquire-firstName">First Name</Label>
                <Input
                  id="model-enquire-firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleFormChange}
                  placeholder="Jane"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="model-enquire-lastName">Last Name</Label>
                <Input
                  id="model-enquire-lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleFormChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="model-enquire-phone">Phone Number</Label>
              <Input
                id="model-enquire-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="0123456789"
                pattern="\d{10}"
                title="Please enter exactly 10 digits (no spaces or letters)."
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="model-enquire-email">Email Address</Label>
              <Input
                id="model-enquire-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="jane@example.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="model-enquire-message">Message (optional)</Label>
              <Textarea
                id="model-enquire-message"
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                placeholder={`I'm interested in the ${vehicleName} ${modelName}…`}
                rows={3}
              />
            </div>

            <div className="flex items-start gap-3 pt-1">
              <Checkbox
                id="model-enquire-privacy"
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                className="mt-0.5"
              />
              <Label
                htmlFor="model-enquire-privacy"
                className="text-sm font-normal leading-snug cursor-pointer"
              >
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
                  Submitting&hellip;
                </>
              ) : (
                'Submit'
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              *Subject to bank finance credit qualification. Ts &amp; Cs apply.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
