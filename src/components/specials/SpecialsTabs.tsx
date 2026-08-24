'use client'

import React, { Suspense, useEffect, useRef, useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
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
import { getSpecialCategoryPathPreservingParams } from '@/lib/specials/paths'
import { formatZAR } from '@/lib/utils/formatZAR'
import { getBrochureUrl } from '@/lib/utils/vehicleCta'
import type { Form, Special, Vehicle, VehicleModel, VehicleVariant } from '@/payload-types'
import type { CSSProperties } from 'react'

const FINANCE_DISCLAIMER =
  'The instalment quoted does not include any admin costs, license and registration of the vehicle and any value added products. All calculations, rates quoted and payments shown are guidelines only and are not quotations.'

const IMAGE_ILLUSTRATION_DISCLAIMER = '*Images for illustration purposes only.'

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
  | 'vehicleVariant'
  | 'enquiryForm'
>

/** Resolved CSS colour strings from Specials Tabs (v2) Appearance fields. */
export type SpecialsTabsAppearance = {
  activeTabBackground?: string
  activeTabText?: string
  inactiveTabBackground?: string
  inactiveTabText?: string
  activeTabAccent?: string
  badgeBackground?: string
  badgeText?: string
  pricingColor?: string
  mutedTextColor?: string
}

type SpecialsTabsProps = {
  categorySlug: string
  categoryTitle: string
  categoryEnquiryForm: Form | null
  fordPromiseHref: string | null
  specials: SpecialTabItem[]
  initialSpecialSlug?: string
  offerDetails?: React.ReactNode
  /** Distinct tree from `offerDetails` for mobile accordion (avoids React node reuse). */
  offerDetailsMobile?: React.ReactNode
  calculatorDefaults?: FinanceCalculatorDefaults | null
  appearance?: SpecialsTabsAppearance | null
  showOfferDetails?: boolean | null
  showKeyFeatures?: boolean | null
  showFinanceCalculator?: boolean | null
}

/** Prefer hex/literal colours for client-component inline styles (avoids CSS-var hydration diffs). */
function mutedTextStyle(appearance?: SpecialsTabsAppearance | null): CSSProperties | undefined {
  return appearance?.mutedTextColor ? { color: appearance.mutedTextColor } : undefined
}

function pricingTextStyle(appearance?: SpecialsTabsAppearance | null): CSSProperties | undefined {
  return appearance?.pricingColor ? { color: appearance.pricingColor } : undefined
}

function tabRowStyle(
  isSelected: boolean,
  appearance?: SpecialsTabsAppearance | null,
): CSSProperties | undefined {
  if (!appearance) return undefined

  if (isSelected) {
    const style: CSSProperties = {}
    if (appearance.activeTabBackground) style.backgroundColor = appearance.activeTabBackground
    if (appearance.activeTabAccent) style.borderLeftColor = appearance.activeTabAccent
    if (appearance.activeTabText) style.color = appearance.activeTabText
    return Object.keys(style).length > 0 ? style : undefined
  }

  const style: CSSProperties = {}
  if (appearance.inactiveTabBackground) style.backgroundColor = appearance.inactiveTabBackground
  if (appearance.inactiveTabText) style.color = appearance.inactiveTabText
  return Object.keys(style).length > 0 ? style : undefined
}

function tabTitleStyle(
  isSelected: boolean,
  appearance?: SpecialsTabsAppearance | null,
): CSSProperties | undefined {
  if (!appearance) return undefined
  if (isSelected && appearance.activeTabText) return { color: appearance.activeTabText }
  if (!isSelected && appearance.inactiveTabText) return { color: appearance.inactiveTabText }
  return undefined
}

function badgeStyle(appearance?: SpecialsTabsAppearance | null): CSSProperties | undefined {
  if (!appearance?.badgeBackground && !appearance?.badgeText) return undefined
  const style: CSSProperties = {}
  if (appearance.badgeBackground) style.backgroundColor = appearance.badgeBackground
  if (appearance.badgeText) style.color = appearance.badgeText
  return style
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

function getVehicleName(special: SpecialTabItem): string {
  const vehicle =
    special.vehicle && typeof special.vehicle === 'object' ? (special.vehicle as Vehicle) : null
  return vehicle?.name ?? ''
}

function buildSpecialContextValues(
  special: SpecialTabItem,
  categoryTitle: string,
): FormBlockContextValues {
  const vehicleName = getVehicleName(special)
  const modelName = getModelName(special)

  return {
    ...(vehicleName ? { vehicleName } : {}),
    specialCategory: categoryTitle,
    ...(modelName ? { modelName } : {}),
    specialType: getOfferTypeLabel(special.offerType),
    specialTitle: getSpecialDisplayTitle(special),
  }
}

function SpecialListPricing({
  special,
  appearance,
}: {
  special: SpecialTabItem
  appearance?: SpecialsTabsAppearance | null
}) {
  if (special.offerType === 'price-point') {
    if (special.specialOffer == null && special.bestSaving == null) return null
    return (
      <span className="flex flex-col items-start">
        {special.specialOffer != null && (
          <span className="flex items-center space-x-1">
            <span className="text-xs" style={mutedTextStyle(appearance)}>
              Special Offer:
            </span>
            <span className="font-semibold text-secondary" style={pricingTextStyle(appearance)}>
              {formatZAR(special.specialOffer)}*
            </span>
          </span>
        )}
        {special.bestSaving != null && (
          <span className="flex items-center space-x-1">
            <span className="text-xs" style={mutedTextStyle(appearance)}>
              Best saving:
            </span>
            <span className="font-semibold text-secondary" style={pricingTextStyle(appearance)}>
              {formatZAR(special.bestSaving)}*
            </span>
          </span>
        )}
      </span>
    )
  }

  if (special.offerType === 'payment' && special.paymentFrom != null) {
    return (
      <span className="flex justify-start">
        <span className="flex items-center space-x-1">
          <span className="text-xs" style={mutedTextStyle(appearance)}>
            Payment From:
          </span>
          <span className="font-semibold text-secondary" style={pricingTextStyle(appearance)}>
            {formatZAR(special.paymentFrom)}*pm
          </span>
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

function SpecialDetailPricing({
  special,
  appearance,
}: {
  special: SpecialTabItem
  appearance?: SpecialsTabsAppearance | null
}) {
  const offerLabel = special.pricingLabel?.trim() || 'Special Offer'

  if (special.offerType === 'price-point') {
    return (
      <div className="space-y-2">
        {special.specialOffer != null && (
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground" style={mutedTextStyle(appearance)}>
              {offerLabel}
            </span>
            <span
              className="font-semibold text-secondary text-2xl"
              style={pricingTextStyle(appearance)}
            >
              {formatZAR(special.specialOffer)}*
            </span>
          </div>
        )}
        {special.bestSaving != null && (
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground" style={mutedTextStyle(appearance)}>
              Best saving
            </span>
            <span
              className="font-semibold text-secondary text-2xl"
              style={pricingTextStyle(appearance)}
            >
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
          <span className="text-xs text-muted-foreground" style={mutedTextStyle(appearance)}>
            Payment from
          </span>
          <span
            className="font-semibold text-secondary text-2xl"
            style={pricingTextStyle(appearance)}
          >
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
          <span className="text-xs text-muted-foreground" style={mutedTextStyle(appearance)}>
            {offerLabel}
          </span>
          <span
            className="font-semibold text-secondary text-lg"
            style={pricingTextStyle(appearance)}
          >
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

/** Scroll the mobile accordion trigger to the top of the viewport (honours scroll-margin). */
function scrollAccordionTriggerIntoView(
  specialId: string,
  behavior: ScrollBehavior = 'smooth',
): boolean {
  const trigger = document.querySelector<HTMLElement>(
    `[data-special-accordion-trigger="${CSS.escape(specialId)}"]`,
  )
  if (!trigger || trigger.getClientRects().length === 0) return false
  trigger.scrollIntoView({ behavior, block: 'start' })
  return true
}

function getOpenAccordionTrigger(specialId: string): HTMLElement | null {
  const trigger = document.querySelector<HTMLElement>(
    `[data-special-accordion-trigger="${CSS.escape(specialId)}"][data-state="open"]`,
  )
  if (!trigger || trigger.getClientRects().length === 0) return null
  return trigger
}

function SpecialCardImage({
  special,
  priority,
  showPricingOverlay = true,
  appearance,
}: {
  special: SpecialTabItem
  priority?: boolean
  /** Desktop grid only — mobile accordion shows pricing in SpecialDetailInfo instead. */
  showPricingOverlay?: boolean
  appearance?: SpecialsTabsAppearance | null
}) {
  if (!special.cardImage) return null

  const hasPricing = showPricingOverlay && hasSpecialDetailPricing(special)
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
      <p className="absolute bottom-3 left-3 z-10 max-w-[calc(100%-1.5rem)] rounded-lg bg-background/90 px-2 py-1 text-[10px] leading-tight text-muted-foreground backdrop-blur-sm lg:hidden">
        {IMAGE_ILLUSTRATION_DISCLAIMER}
      </p>
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
          <SpecialDetailPricing special={special} appearance={appearance} />
          <p className="mt-1 text-[10px] leading-tight text-muted-foreground">
            All subject to finance approval Ford Credit.
          </p>
          <p className="mt-1 hidden text-[10px] leading-tight text-muted-foreground lg:block">
            {IMAGE_ILLUSTRATION_DISCLAIMER}
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
  appearance,
  showOfferDetails = true,
  showKeyFeatures = true,
  showFinanceCalculator = true,
}: {
  special: SpecialTabItem
  fordPromiseHref: string | null
  offerDetails?: React.ReactNode
  calculatorDefaults?: FinanceCalculatorDefaults | null
  appearance?: SpecialsTabsAppearance | null
  showOfferDetails?: boolean | null
  showKeyFeatures?: boolean | null
  showFinanceCalculator?: boolean | null
}) {
  const title = getSpecialDisplayTitle(special)
  const variant =
    special.vehicleVariant && typeof special.vehicleVariant === 'object'
      ? (special.vehicleVariant as VehicleVariant)
      : null
  const vehicle =
    special.vehicle && typeof special.vehicle === 'object' ? (special.vehicle as Vehicle) : null
  const highlights = variant?.highlights ?? []
  const hasHighlights = highlights.length > 0
  const hasOfferDetails = Boolean(offerDetails)
  const isServiceSpecial = special.offerType === 'service'
  const offerDetailsEnabled = showOfferDetails !== false
  const keyFeaturesEnabled = showKeyFeatures !== false && !isServiceSpecial
  const financeEnabled =
    showFinanceCalculator !== false && !isServiceSpecial && special.offerType === 'price-point'
  const hasDetailTabs = isServiceSpecial
    ? offerDetailsEnabled && hasOfferDetails
    : (offerDetailsEnabled && hasOfferDetails) ||
      (keyFeaturesEnabled && hasHighlights) ||
      financeEnabled
  const hasPricing = hasSpecialDetailPricing(special)
  const brochureUrl = getBrochureUrl(vehicle?.brochure)
  const vehicleHref = vehicle?.slug ? `/vehicles/${vehicle.slug}` : null
  const defaultDetailTab = offerDetailsEnabled
    ? 'offer-details'
    : keyFeaturesEnabled
      ? 'key-features'
      : 'finance-calculator'
  const tabsKey = [
    special.id,
    offerDetailsEnabled ? 'o' : '',
    keyFeaturesEnabled ? 'k' : '',
    financeEnabled ? 'f' : '',
  ].join('-')

  return (
    <div>
      <h3 className="text-primary text-2xl md:text-3xl font-bold mb-3">{title}</h3>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {fordPromiseHref && (
          <Button className="w-full rounded-full sm:w-auto" asChild>
            <Link href={fordPromiseHref} prefetch={false}>
              Ford Family Promise
            </Link>
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
            <Link href={vehicleHref} prefetch={false}>
              View Full Range
            </Link>
          </Button>
        )}
        <Button variant="outline" className="w-full rounded-full sm:w-auto" asChild>
          <Link href="/specials" prefetch={false}>
            Back to Specials
          </Link>
        </Button>
      </div>

      {(hasPricing || hasDetailTabs) && (
        <div
          data-special-details={special.id}
          className="mb-8 flex flex-col gap-6 scroll-mt-24 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
        >
          {hasPricing && (
            <div className="shrink-0">
              <SpecialDetailPricing special={special} appearance={appearance} />
            </div>
          )}
          {hasDetailTabs && (
            <div className="min-w-0 flex-1">
              {isServiceSpecial ? (
                offerDetails
              ) : (
                <Tabs key={tabsKey} defaultValue={defaultDetailTab}>
                  <TabsList
                    variant="line"
                    className="mb-4 flex h-auto w-full flex-wrap justify-start gap-x-1"
                  >
                    {offerDetailsEnabled ? (
                      <TabsTrigger value="offer-details">Offer Details</TabsTrigger>
                    ) : null}
                    {keyFeaturesEnabled ? (
                      <TabsTrigger value="key-features">Key Features</TabsTrigger>
                    ) : null}
                    {financeEnabled ? (
                      <TabsTrigger value="finance-calculator">Finance Calculator</TabsTrigger>
                    ) : null}
                  </TabsList>
                  {offerDetailsEnabled ? (
                    <TabsContent value="offer-details">
                      {hasOfferDetails ? (
                        offerDetails
                      ) : (
                        <p className="text-sm text-muted-foreground">No offer details available.</p>
                      )}
                    </TabsContent>
                  ) : null}
                  {keyFeaturesEnabled ? (
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
                  ) : null}
                  {financeEnabled ? (
                    <TabsContent value="finance-calculator">
                      <FinanceCalculatorClient
                        key={special.id}
                        disclaimer={FINANCE_DISCLAIMER}
                        defaultPurchasePrice={special.specialOffer}
                        mode="repaymentOnly"
                        defaults={calculatorDefaults}
                      />
                    </TabsContent>
                  ) : null}
                </Tabs>
              )}
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

/** Empty mount target inside the open mobile accordion panel. */
function MobileEnquiryFormMount({
  active,
  onMountChange,
}: {
  active: boolean
  onMountChange: (node: HTMLElement | null) => void
}) {
  if (!active) return null
  return <div ref={onMountChange} />
}

/** Single mobile enquiry form instance, portaled into the active special's panel. */
function MobileSpecialEnquiryFormPortal({
  mountNode,
  form,
  special,
  categoryTitle,
}: {
  mountNode: HTMLElement | null
  form: Form
  special: SpecialTabItem
  categoryTitle: string
}) {
  if (!mountNode) return null
  return createPortal(
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-primary">Enquire Now</h2>
      <SpecialEnquiryForm form={form} special={special} categoryTitle={categoryTitle} />
    </div>,
    mountNode,
  )
}

function SpecialsTabsList({
  specials,
  selectedIndex,
  onSelect,
  appearance,
}: {
  specials: SpecialTabItem[]
  selectedIndex: number
  onSelect: (index: number) => void
  appearance?: SpecialsTabsAppearance | null
}) {
  return (
    <>
      <div
        className="gap-4 px-4 flex justify-between pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"
        style={mutedTextStyle(appearance)}
      >
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
                style={tabRowStyle(isSelected, appearance)}
              >
                <span className="flex justify-between">
                  <span
                    className={`font-semibold text-sm ${isSelected ? 'text-primary' : ''}`}
                    style={tabTitleStyle(isSelected, appearance)}
                  >
                    {getSpecialDisplayTitle(special)}
                  </span>
                  <span
                    className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
                    style={badgeStyle(appearance)}
                  >
                    {getOfferTypeLabel(special.offerType)}
                  </span>
                </span>

                <SpecialListPricing special={special} appearance={appearance} />
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
  offerDetailsMobile,
  calculatorDefaults,
  appearance,
  showOfferDetails,
  showKeyFeatures,
  showFinanceCalculator,
}: SpecialsTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  /** Snapshot first paint so URL sync adding `?special=` does not count as a deep link. */
  const arrivedWithSpecialQueryRef = useRef<boolean | null>(null)
  const didInitialMobileScrollRef = useRef(false)

  if (arrivedWithSpecialQueryRef.current === null) {
    arrivedWithSpecialQueryRef.current = Boolean(searchParams.get('special') ?? initialSpecialSlug)
  }

  const specialFromQuery = searchParams.get('special') ?? initialSpecialSlug
  const selectedIndex = findSpecialIndex(specials, specialFromQuery)
  const selectedSpecial = specials[selectedIndex] ?? specials[0]
  const enquiryForm = selectedSpecial
    ? resolveEnquiryForm(selectedSpecial, categoryEnquiryForm)
    : null
  const [mobileFormMountNode, setMobileFormMountNode] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (specials.length === 0 || !selectedSpecial?.slug) return
    if (searchParams.get('special') === selectedSpecial.slug) return

    startTransition(() => {
      router.replace(
        getSpecialCategoryPathPreservingParams(categorySlug, selectedSpecial.slug, searchParams),
        { scroll: false },
      )
    })
  }, [categorySlug, router, searchParams, selectedSpecial?.slug, specials.length])

  // Mobile only: on deep-link load (`?special=`), scroll the open accordion trigger into view.
  // Retries until the open trigger exists, then reinforces briefly — one-shot rAF fails under
  // React Strict Mode (cleanup cancels the frame after the "done" ref is set) and can lose to
  // Next.js / browser scroll restoration or accordion open animation.
  useEffect(() => {
    if (didInitialMobileScrollRef.current) return
    if (!arrivedWithSpecialQueryRef.current || !selectedSpecial?.id) return
    if (window.matchMedia('(min-width: 1024px)').matches) return

    const specialId = String(selectedSpecial.id)
    let cancelled = false
    let attempts = 0
    const maxFindAttempts = 40
    /** After the open trigger is found, re-apply scroll a few times to beat scroll restoration. */
    const reinforceAfterFound = 8
    let foundAtAttempt: number | null = null
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let rafId = 0

    const scheduleRetry = () => {
      timeoutId = setTimeout(() => {
        rafId = requestAnimationFrame(tryScroll)
      }, 50)
    }

    const tryScroll = () => {
      if (cancelled || didInitialMobileScrollRef.current) return

      const openTrigger = getOpenAccordionTrigger(specialId)
      if (openTrigger) {
        // Instant avoids smooth-scroll races with retries / restoration.
        openTrigger.scrollIntoView({ behavior: 'instant', block: 'start' })
        if (foundAtAttempt === null) foundAtAttempt = attempts
        if (attempts - foundAtAttempt >= reinforceAfterFound) {
          didInitialMobileScrollRef.current = true
          return
        }
      }

      attempts += 1
      if (attempts >= maxFindAttempts) {
        if (foundAtAttempt === null) {
          scrollAccordionTriggerIntoView(specialId, 'instant')
        }
        didInitialMobileScrollRef.current = true
        return
      }

      scheduleRetry()
    }

    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(tryScroll)
    })

    return () => {
      cancelled = true
      if (timeoutId !== undefined) clearTimeout(timeoutId)
      cancelAnimationFrame(rafId)
    }
  }, [selectedSpecial?.id])

  const selectSpecial = (index: number) => {
    const special = specials[index]
    if (!special?.slug) return
    startTransition(() => {
      router.replace(
        getSpecialCategoryPathPreservingParams(categorySlug, special.slug, searchParams),
        { scroll: false },
      )
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
      {/* Mobile: accordion; enquiry form portaled into the open panel */}
      <div className="lg:hidden flex flex-col gap-6">
        <div className="border-b border-border">
          <div
            className="px-4 pb-2 text-xs font-medium tracking-wide text-muted-foreground"
            style={mutedTextStyle(appearance)}
          >
            <span>Specials</span>
          </div>
          <Accordion
            type="single"
            collapsible={false}
            value={String(selectedSpecial.id)}
            onValueChange={(value) => {
              const index = specials.findIndex((special) => String(special.id) === value)
              if (index >= 0) selectSpecial(index)
              if (!value) return
              // Defer until Radix applies the open state so layout/scroll-margin are correct.
              requestAnimationFrame(() => {
                scrollAccordionTriggerIntoView(value)
              })
            }}
          >
            {specials.map((special, index) => {
              const isSelected = index === selectedIndex
              return (
                <AccordionItem
                  key={special.id}
                  value={String(special.id)}
                  className="border-b border-border"
                >
                  <AccordionTrigger
                    data-special-accordion-trigger={String(special.id)}
                    className="group scroll-mt-24 hover:no-underline w-full px-4 py-4 text-left transition-colors border-l-4 border-l-transparent bg-muted/50 data-[state=open]:bg-primary/5 data-[state=open]:border-l-primary hover:bg-muted [&>svg]:text-muted-foreground group-data-[state=open]:[&>svg]:text-primary"
                    style={tabRowStyle(isSelected, appearance)}
                  >
                    <span className="flex flex-1 flex-col gap-2 text-left">
                      <span
                        className="font-semibold text-sm group-data-[state=open]:text-primary"
                        style={tabTitleStyle(isSelected, appearance)}
                      >
                        {getSpecialDisplayTitle(special)}
                      </span>
                      <SpecialListPricing special={special} appearance={appearance} />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-6">
                    <div className="flex flex-col gap-6">
                      <SpecialCardImage
                        special={special}
                        priority={isSelected}
                        showPricingOverlay={false}
                        appearance={appearance}
                      />
                      {isSelected ? (
                        <SpecialDetailInfo
                          special={special}
                          fordPromiseHref={fordPromiseHref}
                          offerDetails={offerDetailsMobile ?? offerDetails}
                          calculatorDefaults={calculatorDefaults}
                          appearance={appearance}
                          showOfferDetails={showOfferDetails}
                          showKeyFeatures={showKeyFeatures}
                          showFinanceCalculator={showFinanceCalculator}
                        />
                      ) : null}
                      <MobileEnquiryFormMount
                        active={isSelected && Boolean(enquiryForm)}
                        onMountChange={setMobileFormMountNode}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>

        {enquiryForm && (
          <MobileSpecialEnquiryFormPortal
            mountNode={mobileFormMountNode}
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
            appearance={appearance}
          />
        </div>

        <div className="col-start-2 row-start-1">
          <SpecialCardImage special={selectedSpecial} priority appearance={appearance} />
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
            appearance={appearance}
            showOfferDetails={showOfferDetails}
            showKeyFeatures={showKeyFeatures}
            showFinanceCalculator={showFinanceCalculator}
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
