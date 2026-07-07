'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, X, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { MediaImage } from '@/components/ui/media-image'
import type { Media, Vehicle, VehicleModel } from '@/payload-types'

type ColourItem = NonNullable<NonNullable<Vehicle['colours']>[number]>
type GalleryItem = NonNullable<NonNullable<Vehicle['gallery']>[number]>

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

import { formatPrice } from '@/lib/utils/formatPrice'

function getModelCardImage(
  model: VehicleModel,
  vehicleFeatureImage: string | Media | null,
  vehicleHeroImage: string | Media | null,
) {
  return model.featureImage ?? model.heroImage ?? vehicleFeatureImage ?? vehicleHeroImage ?? null
}

const MODELS_PER_PAGE = 3

type Props = {
  vehicleName: string
  colours: ColourItem[]
  gallery: GalleryItem[]
  models: VehicleModel[]
  vehicleFeatureImage: string | Media | null
  vehicleHeroImage: string | Media | null
}

export default function VehicleRangePage({
  vehicleName,
  colours,
  gallery,
  models,
  vehicleFeatureImage,
  vehicleHeroImage,
}: Props) {
  const [selectedColour, setSelectedColour] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [modelPage, setModelPage] = useState(0)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const modelPages = Math.ceil(models.length / MODELS_PER_PAGE)
  const visibleModels = models.slice(modelPage * MODELS_PER_PAGE, (modelPage + 1) * MODELS_PER_PAGE)

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
    <>
      {/* ── Colours ── */}
      {colours.length > 0 && (
        <section className="py-14 px-4">
          <div className="container mx-auto">
            <h2 className="text-primary text-3xl font-bold text-center mb-10">
              {vehicleName} Colours
            </h2>

            {/* Main colour display */}
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-4 bg-muted">
              {colours[selectedColour]?.colourSwatch ? (
                <MediaImage
                  resource={colours[selectedColour].colourSwatch}
                  fill
                  imgClassName="object-cover object-center"
                  size="100vw"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground text-lg">
                    {colours[selectedColour]?.colourName}
                  </p>
                </div>
              )}
            </div>

            {/* Colour name + availability note */}
            <p className="text-center font-semibold mb-0.5">
              {colours[selectedColour]?.colourName}
            </p>
            {colours[selectedColour]?.colourNote && (
              <p className="text-center text-sm text-muted-foreground mb-6">
                ({colours[selectedColour].colourNote})
              </p>
            )}
            {!colours[selectedColour]?.colourNote && <div className="mb-6" />}

            {/* Swatch picker */}
            <div className="flex flex-wrap justify-center gap-3">
              {colours.map((colour, i) => (
                <button
                  key={colour.id ?? i}
                  onClick={() => setSelectedColour(i)}
                  className="group flex flex-col items-center gap-1.5 focus:outline-none"
                  title={colour.colourName}
                  aria-pressed={selectedColour === i}
                  aria-label={colour.colourName}
                >
                  <div
                    className={`relative w-16 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedColour === i
                        ? 'border-primary shadow-md scale-110'
                        : 'border-transparent hover:border-muted-foreground/40'
                    }`}
                  >
                    {colour.colourSwatch ? (
                      <MediaImage
                        resource={colour.colourSwatch}
                        fill
                        imgClassName="object-cover object-center"
                        size="64px"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted-foreground/20 flex items-center justify-center">
                        <span className="text-[7px] text-center px-0.5 leading-tight text-muted-foreground">
                          {colour.colourName}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground text-center max-w-[64px] leading-tight">
                    {colour.colourName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Model Variants ── */}
      {models.length > 0 && (
        <section id="models" className="bg-muted/40 py-14 px-4">
          <div className="container mx-auto">
            <h2 className="text-primary text-3xl font-bold text-center mb-10">
              {vehicleName} Model Variants
            </h2>

            <div className="relative">
              {/* Prev arrow */}
              {modelPages > 1 && (
                <button
                  onClick={() => setModelPage((p) => Math.max(0, p - 1))}
                  disabled={modelPage === 0}
                  aria-label="Previous models"
                  className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-background border rounded-full p-2 shadow-sm disabled:opacity-30 hover:bg-muted transition-colors items-center justify-center"
                >
                  <ChevronLeft className="size-5" />
                </button>
              )}

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleModels.map((model) => {
                  const cardImage = getModelCardImage(model, vehicleFeatureImage, vehicleHeroImage)

                  return (
                    <div
                      key={model.id}
                      className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col"
                    >
                      {cardImage && (
                        <div className="relative w-full aspect-[3/2] mb-4">
                          <MediaImage
                            resource={cardImage}
                            fill
                            imgClassName="object-contain"
                            size="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        </div>
                      )}
                      <h3 className="font-semibold text-base mb-1 leading-snug">{model.name}</h3>
                      <p className="text-primary text-2xl font-bold mb-4">
                        {formatPrice(model.price)}
                      </p>
                      {model.highlights && model.highlights.length > 0 && (
                        <ul className="space-y-1.5 flex-1 mb-6">
                          {model.highlights.map((h, i) => (
                            <li
                              key={h.id ?? i}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span className="text-primary mt-0.5 shrink-0">•</span>
                              <span>{h.highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <a href="#enquire">
                        <Button variant="outline" className="rounded-full w-full mt-auto">
                          View Details
                        </Button>
                      </a>
                    </div>
                  )
                })}
              </div>

              {/* Next arrow */}
              {modelPages > 1 && (
                <button
                  onClick={() => setModelPage((p) => Math.min(modelPages - 1, p + 1))}
                  disabled={modelPage >= modelPages - 1}
                  aria-label="Next models"
                  className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-background border rounded-full p-2 shadow-sm disabled:opacity-30 hover:bg-muted transition-colors items-center justify-center"
                >
                  <ChevronRight className="size-5" />
                </button>
              )}
            </div>

            {/* Page indicators */}
            {modelPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {/* Mobile prev/next */}
                <button
                  onClick={() => setModelPage((p) => Math.max(0, p - 1))}
                  disabled={modelPage === 0}
                  className="md:hidden flex items-center gap-1 text-sm text-muted-foreground disabled:opacity-30"
                >
                  <ChevronLeft className="size-4" /> Prev
                </button>

                {Array.from({ length: modelPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setModelPage(i)}
                    aria-label={`Page ${i + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i === modelPage
                        ? 'bg-primary'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
                    }`}
                  />
                ))}

                <button
                  onClick={() => setModelPage((p) => Math.min(modelPages - 1, p + 1))}
                  disabled={modelPage >= modelPages - 1}
                  className="md:hidden flex items-center gap-1 text-sm text-muted-foreground disabled:opacity-30"
                >
                  Next <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Gallery ── */}
      {gallery.length > 0 && (
        <section className="py-14 px-4">
          <div className="container mx-auto">
            <h2 className="text-primary text-3xl font-bold text-center mb-10">
              {vehicleName} Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.map((item, i) => (
                <button
                  key={item.id ?? i}
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`Open gallery image ${i + 1}`}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <MediaImage
                    resource={item.image}
                    fill
                    imgClassName="object-cover group-hover:scale-105 transition-transform duration-300"
                    size="(max-width: 768px) 50vw, 25vw"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery lightbox"
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white hover:text-white/70 z-10 p-2"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close gallery"
          >
            <X className="size-7" />
          </button>

          {/* Prev */}
          {lightboxIndex > 0 && (
            <button
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-white hover:text-white/70 z-10 p-2"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex((n) => (n !== null ? n - 1 : null))
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="size-9" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <MediaImage
              resource={gallery[lightboxIndex]?.image}
              fill
              imgClassName="object-contain"
              size="100vw"
              priority
            />
          </div>

          {/* Next */}
          {lightboxIndex < gallery.length - 1 && (
            <button
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-white hover:text-white/70 z-10 p-2"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex((n) => (n !== null ? n + 1 : null))
              }}
              aria-label="Next image"
            >
              <ChevronRight className="size-9" />
            </button>
          )}

          {/* Counter */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightboxIndex + 1} / {gallery.length}
          </p>
        </div>
      )}

      {/* ── Enquire Now ── */}
      <section id="enquire" className="bg-muted/40 border-t py-14 px-4">
        <div className="container mx-auto max-w-xl">
          <div className="text-center mb-8">
            <h2 className="text-primary text-3xl font-bold mb-3">Enquire Now</h2>
            <p className="text-muted-foreground">
              Interested in the {vehicleName}? Fill in your details and our team will be in touch.
            </p>
          </div>

          {submitted ? (
            <div className="bg-card border rounded-2xl p-10 text-center shadow-sm">
              <CheckCircle2 className="size-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Enquiry Received</h3>
              <p className="text-muted-foreground mb-6">
                Thank you! A member of our sales team will be in touch shortly.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="rounded-full"
              >
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
                  <Label htmlFor="enquire-firstName">First Name</Label>
                  <Input
                    id="enquire-firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    placeholder="Jane"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="enquire-lastName">Last Name</Label>
                  <Input
                    id="enquire-lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="enquire-phone">Phone Number</Label>
                <Input
                  id="enquire-phone"
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
                <Label htmlFor="enquire-email">Email Address</Label>
                <Input
                  id="enquire-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="jane@example.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="enquire-message">Message (optional)</Label>
                <Textarea
                  id="enquire-message"
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder={`I\u2019m interested in the ${vehicleName}\u2026`}
                  rows={3}
                />
              </div>

              <div className="flex items-start gap-3 pt-1">
                <Checkbox
                  id="enquire-privacy"
                  checked={privacyAccepted}
                  onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="enquire-privacy"
                  className="text-sm font-normal leading-snug cursor-pointer"
                >
                  I have read and agree to the{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-primary underline underline-offset-2"
                  >
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
    </>
  )
}
