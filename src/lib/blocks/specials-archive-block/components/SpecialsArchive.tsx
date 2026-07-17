'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { MediaImage } from '@/components/ui/media-image'
import { Button } from '@/components/ui/button'
import type { Special, SpecialCategory } from '@/payload-types'
import { formatZAR } from '@/lib/utils/formatZAR'

const ALL_TAB_ID = 'all'

const offerTypeLabels: Record<Special['offerType'], string> = {
  'price-point': 'Price Point',
  payment: 'Payment Option',
  service: 'Service',
  enquiry: 'Enquire Now',
}

type SpecialsArchiveProps = {
  categories: SpecialCategory[]
  specials: Special[]
}

type TabItem = {
  id: string
  title: string
}

function getCategoryId(category: string | SpecialCategory): string {
  return typeof category === 'object' ? category.id : category
}

function SpecialCard({ special }: { special: Special }) {
  const detailsHref = `/specials/${special.slug}`

  return (
    <div className="bg-light-50 shadow-card rounded-lg p-4">
      <Link href={detailsHref} className="block relative aspect-square w-full mb-4">
        <span className="absolute top-2 left-2 z-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          {offerTypeLabels[special.offerType]}
        </span>
        <MediaImage
          resource={special.cardImage}
          fill
          imgClassName="object-contain"
          size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>
      <h2 className="font-bold text-primary text-lg mb-4">{special.title}</h2>
      <p className="mb-4 font-semibold">{special.subTitle}</p>
      <div className="flex flex-col mb-2">
        <span className="text-xs">Special Offer:</span>
        {special.specialOffer != null && (
          <span className="font-semibold text-secondary"> {formatZAR(special.specialOffer)}*</span>
        )}
      </div>
      <div className="flex flex-col mb-2">
        <span className="text-xs">Best saving:</span>
        {special.bestSaving != null && (
          <span className="font-semibold text-secondary"> {formatZAR(special.bestSaving)}*</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button className="rounded-full" size="sm">
          <Link href="/">Enquire Now</Link>
        </Button>
        <Button variant="outline" className="rounded-full" size="sm">
          <Link href={detailsHref}>Offer Details</Link>
        </Button>
      </div>
    </div>
  )
}

function SpecialsGrid({ specials }: { specials: Special[] }) {
  if (specials.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-8 text-center">
        No specials in this category.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {specials.map((special, index) => (
        <SpecialCard special={special} key={special.id ?? index} />
      ))}
    </div>
  )
}

function getSpecialsForTab(specials: Special[], tabId: string): Special[] {
  if (tabId === ALL_TAB_ID) return specials
  return specials.filter((special) => getCategoryId(special.category) === tabId)
}

function getSpecialCount(specials: Special[], tabId: string): number {
  return getSpecialsForTab(specials, tabId).length
}

export function SpecialsArchive({ categories, specials }: SpecialsArchiveProps) {
  const tabs = useMemo<TabItem[]>(
    () => [
      { id: ALL_TAB_ID, title: 'All' },
      ...categories.map((c) => ({ id: c.id, title: c.title })),
    ],
    [categories],
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedTab = tabs[selectedIndex] ?? tabs[0]
  const filteredSpecials = useMemo(
    () => (selectedTab ? getSpecialsForTab(specials, selectedTab.id) : specials),
    [specials, selectedTab],
  )

  if (!selectedTab) return null

  return (
    <section className="py-14 px-4">
      <div className="container mx-auto">
        {/* Mobile: accordion */}
        <div className="lg:hidden flex flex-col gap-6">
          <div className="border-b border-border">
            <div className="grid grid-cols-[1fr_auto] gap-4 px-4 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span>Categories</span>
              <span>Offers</span>
            </div>
            <Accordion type="single" collapsible={false} defaultValue={ALL_TAB_ID}>
              {tabs.map((tab) => (
                <AccordionItem key={tab.id} value={tab.id} className="border-b-0">
                  <AccordionTrigger className="group hover:no-underline w-full px-4 py-4 text-left transition-colors border-l-4 border-l-transparent data-[state=open]:bg-primary/5 data-[state=open]:border-l-primary hover:bg-muted/50 [&>svg]:text-muted-foreground group-data-[state=open]:[&>svg]:text-primary">
                    <span className="grid grid-cols-[1fr_auto] gap-4 flex-1 items-center">
                      <span className="font-semibold text-sm group-data-[state=open]:text-primary">
                        {tab.title}
                      </span>
                      <span className="text-sm font-medium whitespace-nowrap text-muted-foreground group-data-[state=open]:text-primary">
                        {getSpecialCount(specials, tab.id)}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-6">
                    <SpecialsGrid specials={getSpecialsForTab(specials, tab.id)} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Desktop: two-column layout */}
        <div className="hidden lg:grid grid-cols-[minmax(0,320px)_1fr] gap-12 items-start">
          <div className="border-b border-border">
            <ul className="divide-y divide-border">
              {tabs.map((tab, index) => {
                const isSelected = index === selectedIndex
                return (
                  <li key={tab.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedIndex(index)}
                      aria-pressed={isSelected}
                      className={`w-full grid grid-cols-[1fr_auto] gap-4 items-center px-4 py-4 text-left transition-colors border-l-4 ${
                        isSelected
                          ? 'bg-primary/5 border-l-primary text-primary'
                          : 'border-l-transparent hover:bg-muted/50'
                      }`}
                    >
                      <span className={`text-sm ${isSelected ? 'text-primary' : ''}`}>
                        {tab.title}
                      </span>
                      <span
                        className={`text-sm font-medium whitespace-nowrap ${
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        {getSpecialCount(specials, tab.id)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <SpecialsGrid specials={filteredSpecials} />
        </div>
      </div>
    </section>
  )
}
