import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import PartsEnquiryForm from '@/components/services/PartsEnquiryForm'

export const metadata: Metadata = {
  title: 'Parts & Accessories | Eagle Ford',
  description:
    'Getting genuine Ford parts has never been easier. Speak to our parts sales team for any parts enquiries for your make and model.',
}

export default function PartsAccessoriesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative w-full overflow-hidden">
        <Image
          src="/images/services/parts-accessories-hero.webp"
          alt="Ford mechanic working under a vehicle"
          width={1920}
          height={700}
          priority
          className="w-full object-cover max-h-[480px]"
          sizes="100vw"
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end pb-10 px-6 md:px-16">
          <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-md">
            Request a Part
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto py-12 max-w-3xl text-center">
        <h2 className="text-primary text-3xl md:text-4xl font-semibold mb-6">Request a Part</h2>
        <p className="text-base md:text-lg text-muted-foreground mb-4">
          Getting genuine Ford parts has never been easier. Speak to our parts sales team for any
          parts enquiries for your make and model. Our helpful team will supply you with only the
          best Ford parts and other vehicle accessories. Whatever you require for your Ford, we will
          find it for you.
        </p>
        <p className="text-base font-medium mb-8">
          Contact Us Today:{' '}
          <a href="tel:0105971555" className="text-primary hover:underline underline-offset-2">
            010 597 1555
          </a>
        </p>
        <Button asChild className="rounded-full px-10">
          <a href="#enquiry-form">Enquire Now</a>
        </Button>
      </section>

      {/* Enquiry Form */}
      <section id="enquiry-form" className="container mx-auto pb-16 max-w-3xl scroll-mt-24">
        <div className="border rounded-2xl p-6 md:p-10 shadow-sm bg-card">
          <h2 className="text-xl font-semibold mb-6">Enquiry Form</h2>
          <PartsEnquiryForm />
        </div>
      </section>
    </div>
  )
}
