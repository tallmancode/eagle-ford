'use client'

import React from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Vehicle } from '@/payload-types'

type FaqItem = NonNullable<Vehicle['faqs']>[number]

type VehicleFaqProps = {
  faqs: FaqItem[]
}

export function VehicleFaq({ faqs }: VehicleFaqProps) {
  if (faqs.length === 0) return null

  return (
    <section className="py-14 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-primary text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.id ?? i} value={`faq-${faq.id ?? i}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
