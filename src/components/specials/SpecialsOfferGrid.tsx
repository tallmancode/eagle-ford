'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SpecialOfferCard from '@/components/specials/SpecialOfferCard'
import {
  FILTER_TABS,
  SPECIAL_SECTIONS,
  getOffersByFilter,
  groupOffersBySection,
  type FilterValue,
} from '@/lib/data/specialsData'

export default function SpecialsOfferGrid() {
  return (
    <section className="container mx-auto py-6 px-4">
      <Tabs defaultValue="all">
        <div className="overflow-x-auto pb-2 mb-8">
          <TabsList variant="line" className="w-full min-w-max justify-start">
            {FILTER_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {FILTER_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <OfferSections filter={tab.value} />
          </TabsContent>
        ))}
      </Tabs>

      <p className="text-xs text-muted-foreground text-center mt-10">
        * Terms and conditions apply. Prices and savings are indicative and subject to change.
      </p>
    </section>
  )
}

function OfferSections({ filter }: { filter: FilterValue }) {
  const offers = getOffersByFilter(filter)
  const grouped = groupOffersBySection(offers)

  if (offers.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-16">
        No specials in this category at the moment.
      </p>
    )
  }

  const sectionsToRender =
    filter === 'all'
      ? SPECIAL_SECTIONS.filter((section) => grouped.has(section.id))
      : SPECIAL_SECTIONS.filter((section) => grouped.has(section.id))

  return (
    <div className="space-y-14">
      {sectionsToRender.map((section) => {
        const sectionOffers = grouped.get(section.id)
        if (!sectionOffers?.length) return null

        return (
          <div key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-primary text-2xl md:text-3xl font-bold mb-6">{section.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sectionOffers.map((offer) => (
                <SpecialOfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
