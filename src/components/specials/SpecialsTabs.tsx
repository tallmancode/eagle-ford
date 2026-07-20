'use client'

import React, { Suspense, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Download } from 'lucide-react'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { MediaImage } from '@/components/ui/media-image'
import { Button } from '@/components/ui/button'
import { richTextConverters } from '@/components/rich-text/richTextConverters'
import { getOfferTypeLabel } from '@/lib/specials/constants'
import { getSpecialDisplayTitle } from '@/lib/specials/getSpecialDisplayTitle'
import { getSpecialCategoryPath } from '@/lib/specials/paths'
import { formatZAR } from '@/lib/utils/formatZAR'
import { getBrochureUrl } from '@/lib/utils/vehicleCta'
import type { Special, Vehicle } from '@/payload-types'

export type SpecialTabItem = Pick<
  Special,
  | 'id'
  | 'slug'
  | 'title'
  | 'subTitle'
  | 'offerType'
  | 'pricingLabel'
  | 'specialOffer'
  | 'bestSaving'
  | 'paymentFrom'
  | 'cardImage'
  | 'vehicle'
  | 'vehicleModel'
  | 'detailContent'
  | 'enquireSectionId'
>

type SpecialsTabsProps = {
  categorySlug: string
  specials: SpecialTabItem[]
  initialSpecialSlug?: string
}

function getSpecialPrimaryAmount(special: SpecialTabItem): number | null {
  if (special.offerType === 'payment') {
    return special.paymentFrom ?? null
  }

  if (special.offerType === 'price-point' || special.offerType === 'service') {
    return special.specialOffer ?? null
  }

  return null
}

function formatSpecialListPrice(special: SpecialTabItem): string | null {
  const amount = getSpecialPrimaryAmount(special)
  if (amount == null) return null
  return formatZAR(amount)
}

function findSpecialIndex(
  specials: SpecialTabItem[],
  specialSlug: string | null | undefined,
): number {
  if (!specialSlug) return 0
  const index = specials.findIndex((special) => special.slug === specialSlug)
  return index >= 0 ? index : 0
}

function hasSpecialDetailPricing(special: SpecialTabItem): boolean {
  if (special.offerType === 'price-point') {
    return special.specialOffer != null || special.bestSaving != null
  }
  if (special.offerType === 'payment') {
    return special.paymentFrom != null
  }
  if (special.offerType === 'service') {
    return special.specialOffer != null
  }
  return false
}

function SpecialDetailPricing({ special }: { special: SpecialTabItem }) {
  const offerLabel = special.pricingLabel?.trim() || 'Special Offer'

  if (special.offerType === 'price-point') {
    return (
      <div className="space-y-2 sm:text-right">
        {special.specialOffer != null && (
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{offerLabel}</span>
            <span className="font-semibold text-secondary text-lg">
              {formatZAR(special.specialOffer)}*
            </span>
          </div>
        )}
        {special.bestSaving != null && (
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Best saving</span>
            <span className="font-semibold text-secondary text-lg">
              {formatZAR(special.bestSaving)}*
            </span>
          </div>
        )}
      </div>
    )
  }

  if (special.offerType === 'payment' && special.paymentFrom != null) {
    return (
      <div className="space-y-2 sm:text-right">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Payment from</span>
          <span className="font-semibold text-secondary text-lg">
            {formatZAR(special.paymentFrom)}*pm
          </span>
        </div>
      </div>
    )
  }

  if (special.offerType === 'service' && special.specialOffer != null) {
    return (
      <div className="space-y-2 sm:text-right">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{offerLabel}</span>
          <span className="font-semibold text-secondary text-lg">
            {formatZAR(special.specialOffer)}*
          </span>
        </div>
      </div>
    )
  }

  return null
}

function SpecialDetailContent({
  special,
  priority,
}: {
  special: SpecialTabItem
  priority?: boolean
}) {
  const title = getSpecialDisplayTitle(special)
  const model =
    special.vehicleModel && typeof special.vehicleModel === 'object' ? special.vehicleModel : null
  const vehicle =
    special.vehicle && typeof special.vehicle === 'object' ? (special.vehicle as Vehicle) : null
  const highlights = model?.highlights ?? []
  const hasHighlights = highlights.length > 0
  const hasPricing = hasSpecialDetailPricing(special)
  const enquireSectionId = special.enquireSectionId?.trim() || null
  const brochureUrl = getBrochureUrl(vehicle?.brochure)

  return (
    <div className="flex flex-col gap-6">
      {special.cardImage && (
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted">
          <MediaImage
            resource={special.cardImage}
            fill
            imgClassName="object-contain object-center"
            size="(max-width: 1024px) 100vw, 66vw"
            priority={priority}
          />
        </div>
      )}

      <div>
        <h3 className="text-primary text-2xl md:text-3xl font-bold mb-3">{title}</h3>

        <div className="mb-8 flex flex-wrap gap-3">
          {enquireSectionId && (
            <Button variant="default" className="rounded-full" asChild>
              <a href={`#${enquireSectionId}`}>Enquire Now</a>
            </Button>
          )}
          {brochureUrl && (
            <Button variant="secondary" className="rounded-full" asChild>
              <a href={brochureUrl} target="_blank" rel="noopener noreferrer" download>
                <Download className="mr-2 size-4" />
                Download Brochure
              </a>
            </Button>
          )}
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/specials">Back to Specials</Link>
          </Button>
        </div>

        {(hasHighlights || hasPricing) && (
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            {hasHighlights && (
              <div className="min-w-0 flex-1">
                <h4 className="text-primary font-bold mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {highlights.map((item, i) => (
                    <li
                      key={item.id ?? i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="text-primary mt-0.5 shrink-0">•</span>
                      <span>{item.highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {hasPricing && (
              <div className="shrink-0 sm:ml-auto">
                <SpecialDetailPricing special={special} />
              </div>
            )}
          </div>
        )}

        {special.detailContent && (
          <div className="text-muted-foreground leading-relaxed">
            <ConvertRichText
              converters={richTextConverters}
              data={special.detailContent as SerializedEditorState}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function SpecialsTabsInner({ categorySlug, specials, initialSpecialSlug }: SpecialsTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const specialFromQuery = searchParams.get('special') ?? initialSpecialSlug
  const selectedIndex = findSpecialIndex(specials, specialFromQuery)
  const selectedSpecial = specials[selectedIndex] ?? specials[0]

  useEffect(() => {
    if (specials.length === 0 || !selectedSpecial?.slug) return
    if (searchParams.get('special') === selectedSpecial.slug) return

    startTransition(() => {
      router.replace(getSpecialCategoryPath(categorySlug, selectedSpecial.slug), { scroll: false })
    })
  }, [categorySlug, router, searchParams, selectedSpecial?.slug, specials.length])

  const selectSpecial = (index: number) => {
    const special = specials[index]
    if (!special?.slug) return
    startTransition(() => {
      router.replace(getSpecialCategoryPath(categorySlug, special.slug), { scroll: false })
    })
  }

  if (specials.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-8 text-center">
        No specials in this category.
      </p>
    )
  }

  return (
    <div>
      {/* Mobile: accordion */}
      <div className="lg:hidden flex flex-col gap-6">
        <div className="border-b border-border">
          <div className="px-4 pb-2 text-xs font-medium tracking-wide text-muted-foreground">
            <span>Specials</span>
          </div>
          <Accordion
            type="single"
            collapsible={false}
            value={String(selectedSpecial.id)}
            onValueChange={(value) => {
              const index = specials.findIndex((special) => String(special.id) === value)
              if (index >= 0) selectSpecial(index)
            }}
          >
            {specials.map((special, index) => {
              const listPrice = formatSpecialListPrice(special)
              const isSelected = index === selectedIndex
              return (
                <AccordionItem key={special.id} value={String(special.id)} className="border-b-0">
                  <AccordionTrigger className="group hover:no-underline w-full px-4 py-4 text-left transition-colors border-l-4 border-l-transparent data-[state=open]:bg-primary/5 data-[state=open]:border-l-primary hover:bg-muted/50 [&>svg]:text-muted-foreground group-data-[state=open]:[&>svg]:text-primary">
                    <span className="grid grid-cols-[1fr_auto] gap-4 flex-1 items-center">
                      <span className="font-semibold text-sm group-data-[state=open]:text-primary">
                        {getSpecialDisplayTitle(special)}
                      </span>
                      {listPrice && (
                        <span className="text-sm font-medium whitespace-nowrap text-muted-foreground group-data-[state=open]:text-primary">
                          {listPrice}
                        </span>
                      )}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-6">
                    <SpecialDetailContent special={special} priority={isSelected} />
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>

      {/* Desktop: two-column layout */}
      <div className="hidden lg:grid grid-cols-[minmax(0,440px)_1fr] gap-12 items-start">
        <div className="border-b border-border">
          <div className="gap-4 px-4 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span>Specials</span>
          </div>
          <ul className="divide-y divide-border">
            {specials.map((special, index) => {
              const isSelected = index === selectedIndex
              return (
                <li key={special.id}>
                  <button
                    type="button"
                    onClick={() => selectSpecial(index)}
                    aria-pressed={isSelected}
                    className={`w-full flex flex-col gap-4 px-4 py-4 text-left transition-colors border-l-4 ${
                      isSelected
                        ? 'bg-primary/5 border-l-primary text-primary'
                        : 'border-l-transparent hover:bg-muted/50'
                    }`}
                  >
                    <span className="flex justify-between">
                      <span className={`font-semibold text-sm ${isSelected ? 'text-primary' : ''}`}>
                        {getSpecialDisplayTitle(special)}
                      </span>
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                        {getOfferTypeLabel(special.offerType)}
                      </span>
                    </span>

                    {special.offerType === 'price-point' && (
                      <span className="flex justify-between">
                        {special.specialOffer != null && (
                          <span className="flex items-center space-x-1">
                            <span className="text-xs">Special Offer:</span>
                            <span className="font-semibold text-secondary">
                              {formatZAR(special.specialOffer)}*
                            </span>
                          </span>
                        )}
                        {special.bestSaving != null && (
                          <span className="flex items-center space-x-1">
                            <span className="text-xs">Best saving:</span>
                            <span className="font-semibold text-secondary">
                              {formatZAR(special.bestSaving)}*
                            </span>
                          </span>
                        )}
                      </span>
                    )}

                    {special.offerType === 'payment' && special.paymentFrom != null && (
                      <span className="flex justify-end">
                        <span className="flex items-center space-x-1">
                          <span className="text-xs">Payment From:</span>
                          <span className="font-semibold text-secondary">
                            {formatZAR(special.paymentFrom)}*pm
                          </span>
                        </span>
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <SpecialDetailContent special={selectedSpecial} priority />
      </div>
    </div>
  )
}

export function SpecialsTabs(props: SpecialsTabsProps) {
  return (
    <Suspense
      fallback={<p className="text-muted-foreground text-sm py-8 text-center">Loading specials…</p>}
    >
      <SpecialsTabsInner {...props} />
    </Suspense>
  )
}
