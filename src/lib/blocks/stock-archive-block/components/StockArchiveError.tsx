'use client'

import Image from 'next/image'
import stockErrorImage from '@/assets/Media/error/stock-error.webp'
import { Button } from '@/components/ui/button'

export function StockArchiveError() {
  return (
    <section
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden min-h-[calc(100dvh-var(--site-header-height,7.5rem))]"
      aria-live="polite"
    >
      <Image
        src={stockErrorImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/55" aria-hidden />
      <div className="relative z-10 flex min-h-[calc(100dvh-var(--site-header-height,7.5rem))] flex-col items-center justify-center px-6 text-center">
        <p className="max-w-xl text-2xl font-medium text-white md:text-3xl">
          Something Went wrong. We are working on it.
        </p>
        <Button
          type="button"
          variant="white"
          size="lg"
          className="mt-8 rounded-full"
          onClick={() => window.location.reload()}
        >
          Reload page
        </Button>
      </div>
    </section>
  )
}
