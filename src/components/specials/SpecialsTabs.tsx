'use client'

import React, { Suspense, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Download } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { MediaImage } from '@/components/ui/media-image'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FormBlockClient } from '@/lib/blocks/form-block/components/FormBlockClient'
import type { FormBlockContextValues } from '@/lib/blocks/form-block/types/formContext'
import { FinanceCalculatorClient } from '@/lib/blocks/finance-calculator-block/components/FinanceCalculatorClient'
import type { FinanceCalculatorDefaults } from '@/lib/blocks/finance-calculator-block/getFinanceCalculatorDefaults'
import { getOfferTypeLabel } from '@/lib/specials/constants'
import { getSpecialDisplayTitle } from '@/lib/specials/getSpecialDisplayTitle'
import { getSpecialCategoryPath } from '@/lib/specials/paths'
import { formatZAR } from '@/lib/utils/formatZAR'
import { getBrochureUrl } from '@/lib/utils/vehicleCta'
import type { Form, Special, Vehicle, VehicleModel } from '@/payload-types'

const FINANCE_DISCLAIMER =
  'The instalment quoted does not include any admin costs, license and registration of the vehicle and any value added products. All calculations, rates quoted and payments shown are guidelines only and are not quotations.'

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
  | 'enquiryForm'
>

type SpecialsTabsProps = {
  categorySlug: string
  categoryTitle: string
  categoryEnquiryForm: Form | null
  fordPromiseHref: string | null
  specials: SpecialTabItem[]
  initialSpecialSlug?: string
  offerDetails?: React.ReactNode
  calculatorDefaults?: FinanceCalculatorDefaults | null
}

function findSpecialIndex(
  specials: SpecialTabItem[],
  specialSlug: string | null | undefined,
): number {
  if (!specialSlug) return 0
  const index = specials.findIndex((special) => special.slug === specialSlug)
  return index >= 0 ? index : 0
}

function resolveEnquiryForm(
  special: SpecialTabItem,
  categoryEnquiryForm: Form | null,
): Form | null {
  const override = special.enquiryForm
  if (override && typeof override === 'object' && override.id) {
    return override
  }
  return categoryEnquiryForm
}

function getModelName(special: SpecialTabItem): string {
  const model =
    special.vehicleModel && typeof special.vehicleModel === 'object'
      ? (special.vehicleModel as VehicleModel)
      : null
  return model?.name ?? ''
}

function buildSpecialContextValues(
  special: SpecialTabItem,
  categoryTitle: string,
): FormBlockContextValues {
  return {
    specialCategory: categoryTitle,
    modelName: getModelName(special),
    specialType: getOfferTypeLabel(special.offerType),
    specialTitle: getSpecialDisplayTitle(special),
  }
}

function SpecialListPricing({ special }: { special: SpecialTabItem }) {
  if (special.offerType === 'price-point') {
    if (special.specialOffer == null && special.bestSaving == null) return null
    return (
      <span className="flex flex-col items-start">
        {special.specialOffer != null && (
          <span className="flex items-center space-x-1">
            <span className="text-xs">Special Offer:</span>
            <span className="font-semibold text-secondary">{formatZAR(special.specialOffer)}*</span>
          </span>
        )}
        {special.bestSaving != null && (
          <span className="flex items-center space-x-1">
            <span className="text-xs">Best saving:</span>
            <span className="font-semibold text-secondary">{formatZAR(special.bestSaving)}*</span>
          </span>
        )}
      </span>
    )
  }

  if (special.offerType === 'payment' && special.paymentFrom != null) {
    return (
      <span className="flex justify-end">
        <span className="flex items-center space-x-1">
          <span className="text-xs">Payment From:</span>
          <span className="font-semibold text-secondary">{formatZAR(special.paymentFrom)}*pm</span>
        </span>
      </span>
    )
  }

  return null
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
      <div className="space-y-2">
        {special.specialOffer != null && (
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{offerLabel}</span>
            <span className="font-semibold text-secondary text-2xl">
              {formatZAR(special.specialOffer)}*
            </span>
          </div>
        )}
        {special.bestSaving != null && (
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Best saving</span>
            <span className="font-semibold text-secondary text-2xl">
              {formatZAR(special.bestSaving)}*
            </span>
          </div>
        )}
      </div>
    )
  }

  if (special.offerType === 'payment' && special.paymentFrom != null) {
    return (
      <div className="space-y-2">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Payment from</span>
          <span className="font-semibold text-secondary text-2xl">
            {formatZAR(special.paymentFrom)}*pm
          </span>
        </div>
      </div>
    )
  }

  if (special.offerType === 'service' && special.specialOffer != null) {
    return (
      <div className="space-y-2">
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

function scrollToSpecialDetails(specialId: string) {
  const targets = document.querySelectorAll<HTMLElement>(`[data-special-details="${specialId}"]`)
  const visible = Array.from(targets).find((el) => el.getClientRects().length > 0)
  visible?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function SpecialCardImage({ special, priority }: { special: SpecialTabItem; priority?: boolean }) {
  if (!special.cardImage) return null

  const hasPricing = hasSpecialDetailPricing(special)
  const detailsHref = `#special-${special.id}-details`

  return (
    <div className="relative aspect-[3/2] max-h-[500px] rounded-2xl overflow-hidden bg-muted">
      <MediaImage
        resource={special.cardImage}
        fill
        imgClassName="object-contain object-center"
        maxWidth={1400}
        size="(max-width: 1024px) 100vw, 66vw"
        priority={priority}
      />
      {hasPricing && (
        <a
          href={detailsHref}
          onClick={(event) => {
            event.preventDefault()
            scrollToSpecialDetails(String(special.id))
            window.history.replaceState(null, '', detailsHref)
          }}
          className="absolute bottom-3 right-3 z-10 max-w-[min(100%,16rem)] rounded-xl bg-background/90 px-3 py-2 shadow-sm backdrop-blur-sm transition-opacity hover:opacity-90 sm:text-right"
        >
          <SpecialDetailPricing special={special} />
          <p className="mt-1 text-[10px] leading-tight text-muted-foreground">
            All subject to finance approval Ford Credit.
          </p>
        </a>
      )}
    </div>
  )
}

function SpecialDetailInfo({
  special,
  fordPromiseHref,
  offerDetails,
  calculatorDefaults,
}: {
  special: SpecialTabItem
  fordPromiseHref: string | null
  offerDetails?: React.ReactNode
  calculatorDefaults?: FinanceCalculatorDefaults | null
}) {
  const title = getSpecialDisplayTitle(special)
  const model =
    special.vehicleModel && typeof special.vehicleModel === 'object' ? special.vehicleModel : null
  const vehicle =
    special.vehicle && typeof special.vehicle === 'object' ? (special.vehicle as Vehicle) : null
  const highlights = model?.highlights ?? []
  const hasHighlights = highlights.length > 0
  const hasOfferDetails = Boolean(offerDetails)
  const showFinanceCalculator = special.offerType === 'price-point'
  const hasDetailTabs = hasHighlights || hasOfferDetails || showFinanceCalculator
  const hasPricing = hasSpecialDetailPricing(special)
  const brochureUrl = getBrochureUrl(vehicle?.brochure)
  const vehicleHref = vehicle?.slug ? `/vehicles/${vehicle.slug}` : null

  return (
    <div>
      <h3 className="text-primary text-2xl md:text-3xl font-bold mb-3">{title}</h3>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {fordPromiseHref && (
          <Button className="w-full rounded-full sm:w-auto" asChild>
            <Link href={fordPromiseHref}>Ford Family Promise</Link>
          </Button>
        )}
        {brochureUrl && (
          <Button variant="secondary" className="w-full rounded-full sm:w-auto" asChild>
            <a href={brochureUrl} target="_blank" rel="noopener noreferrer" download>
              <Download className="mr-2 size-4" />
              Download Brochure
            </a>
          </Button>
        )}
        {vehicleHref && (
          <Button className="w-full rounded-full sm:w-auto" asChild>
            <Link href={vehicleHref}>View Full Range</Link>
          </Button>
        )}
        <Button variant="outline" className="w-full rounded-full sm:w-auto" asChild>
          <Link href="/specials">Back to Specials</Link>
        </Button>
      </div>

      {(hasPricing || hasDetailTabs) && (
        <div
          data-special-details={special.id}
          className="mb-8 flex flex-col gap-6 scroll-mt-24 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
        >
          {hasPricing && (
            <div className="shrink-0">
              <SpecialDetailPricing special={special} />
            </div>
          )}
          {hasDetailTabs && (
            <div className="min-w-0 flex-1">
              <Tabs key={special.id} defaultValue="offer-details">
                <TabsList
                  variant="line"
                  className="mb-4 flex h-auto w-full flex-wrap justify-start gap-x-1"
                >
                  <TabsTrigger value="offer-details">Offer Details</TabsTrigger>
                  <TabsTrigger value="key-features">Key Features</TabsTrigger>
                  {showFinanceCalculator && (
                    <TabsTrigger value="finance-calculator">Finance Calculator</TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="offer-details">
                  {hasOfferDetails ? (
                    offerDetails
                  ) : (
                    <p className="text-sm text-muted-foreground">No offer details available.</p>
                  )}
                </TabsContent>
                <TabsContent value="key-features">
                  {hasHighlights ? (
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
                  ) : (
                    <p className="text-sm text-muted-foreground">No key features available.</p>
                  )}
                </TabsContent>
                {showFinanceCalculator && (
                  <TabsContent value="finance-calculator">
                    <FinanceCalculatorClient
                      key={special.id}
                      disclaimer={FINANCE_DISCLAIMER}
                      defaultPurchasePrice={special.specialOffer}
                      mode="repaymentOnly"
                      defaults={calculatorDefaults}
                    />
                  </TabsContent>
                )}
              </Tabs>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SpecialEnquiryForm({
  form,
  special,
  categoryTitle,
}: {
  form: Form
  special: SpecialTabItem
  categoryTitle: string
}) {
  return (
    <FormBlockClient
      key={`${form.id}-${special.id}`}
      form={form}
      contextValues={buildSpecialContextValues(special, categoryTitle)}
    />
  )
}

function SpecialsTabsList({
  specials,
  selectedIndex,
  onSelect,
}: {
  specials: SpecialTabItem[]
  selectedIndex: number
  onSelect: (index: number) => void
}) {
  return (
    <>
      <div className="gap-4 px-4 flex justify-between pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span>Specials</span>
        <span className="text-xs">*Click the specials below to view deatils</span>
      </div>
      <ul className="divide-y divide-border">
        {specials.map((special, index) => {
          const isSelected = index === selectedIndex
          return (
            <li key={special.id}>
              <button
                type="button"
                onClick={() => onSelect(index)}
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

                <SpecialListPricing special={special} />
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

function SpecialsTabsInner({
  categorySlug,
  categoryTitle,
  categoryEnquiryForm,
  fordPromiseHref,
  specials,
  initialSpecialSlug,
  offerDetails,
  calculatorDefaults,
}: SpecialsTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const specialFromQuery = searchParams.get('special') ?? initialSpecialSlug
  const selectedIndex = findSpecialIndex(specials, specialFromQuery)
  const selectedSpecial = specials[selectedIndex] ?? specials[0]
  const enquiryForm = selectedSpecial
    ? resolveEnquiryForm(selectedSpecial, categoryEnquiryForm)
    : null

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
      {/* Mobile: accordion + form below */}
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
              const isSelected = index === selectedIndex
              return (
                <AccordionItem key={special.id} value={String(special.id)} className="border-b-0">
                  <AccordionTrigger className="group hover:no-underline w-full px-4 py-4 text-left transition-colors border-l-4 border-l-transparent data-[state=open]:bg-primary/5 data-[state=open]:border-l-primary hover:bg-muted/50 [&>svg]:text-muted-foreground group-data-[state=open]:[&>svg]:text-primary">
                    <span className="flex flex-1 flex-col gap-2 text-left">
                      <span className="font-semibold text-sm group-data-[state=open]:text-primary">
                        {getSpecialDisplayTitle(special)}
                      </span>
                      <SpecialListPricing special={special} />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-6">
                    <div className="flex flex-col gap-6">
                      <SpecialCardImage special={special} priority={isSelected} />
                      <SpecialDetailInfo
                        special={special}
                        fordPromiseHref={fordPromiseHref}
                        offerDetails={isSelected ? offerDetails : undefined}
                        calculatorDefaults={calculatorDefaults}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>

        {enquiryForm && (
          <SpecialEnquiryForm
            form={enquiryForm}
            special={selectedSpecial}
            categoryTitle={categoryTitle}
          />
        )}
      </div>

      {/* Desktop: tabs|image top; form|info bottom */}
      <div className="hidden lg:grid grid-cols-[minmax(0,440px)_1fr] xl:grid-cols-[minmax(0,600px)_1fr] grid-rows-[auto_auto] gap-x-12 gap-y-8 items-start">
        <div className="col-start-1 row-start-1 h-0 min-h-full overflow-y-auto border-b border-border">
          <SpecialsTabsList
            specials={specials}
            selectedIndex={selectedIndex}
            onSelect={selectSpecial}
          />
        </div>

        <div className="col-start-2 row-start-1">
          <SpecialCardImage special={selectedSpecial} priority />
        </div>

        <div className="col-start-1 row-start-2">
          {enquiryForm && (
            <SpecialEnquiryForm
              form={enquiryForm}
              special={selectedSpecial}
              categoryTitle={categoryTitle}
            />
          )}
        </div>

        <div className="col-start-2 row-start-2">
          <SpecialDetailInfo
            special={selectedSpecial}
            fordPromiseHref={fordPromiseHref}
            offerDetails={offerDetails}
            calculatorDefaults={calculatorDefaults}
          />
        </div>
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
