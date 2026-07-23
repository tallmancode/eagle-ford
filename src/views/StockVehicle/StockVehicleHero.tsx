'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { MediaImage } from '@/components/ui/media-image'
import {
  formatPrice,
  getVehicleDisplayName,
  getVehiclePrice,
} from '@/lib/blocks/stock-archive-block/utils'
import type { MotorCityStockVehicle } from '@/lib/motor-city-stock/types'
import { getStockGalleryImages, getStockHeroImage } from '@/lib/stock-vehicle/media'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatCalculatorPrice } from '@/lib/blocks/finance-calculator-block/formatCalculatorPrice'

type Props = {
  vehicle: MotorCityStockVehicle
}

export function StockVehicleHero({ vehicle }: Props) {
  const images = getStockGalleryImages(vehicle.media)
  const heroImage = getStockHeroImage(vehicle.media)
  const [activeIndex, setActiveIndex] = useState(0)

  const title = getVehicleDisplayName(vehicle)
  const subtitle = vehicle.modelRange?.trim() || null
  const price = getVehiclePrice(vehicle)
  const conditionLabel =
    vehicle.newUsed === 'NEW' ? 'NEW' : vehicle.newUsed === 'USED' ? 'USED' : null

  const activeImage = images[activeIndex] ?? heroImage

  return (
    <section className="bg-neutral-50">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-200">
            {activeImage?.url ? (
              <MediaImage
                resource={activeImage.url}
                alt={title}
                fill
                imgClassName="object-cover"
                size="(max-width: 1024px) 100vw, 50vw"
                priority
                quality={75}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-400">
                No image
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow"
                  onClick={() =>
                    setActiveIndex((index) => (index > 0 ? index - 1 : images.length - 1))
                  }
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow"
                  onClick={() =>
                    setActiveIndex((index) => (index < images.length - 1 ? index + 1 : 0))
                  }
                  aria-label="Next image"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {conditionLabel && (
              <span className="inline-flex w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-light-50">
                {conditionLabel}
              </span>
            )}

            <div>
              <p className="text-sm font-medium text-neutral-500">Price</p>
              <p className="text-3xl font-bold text-primary-900 md:text-4xl">
                {formatPrice(price)}
              </p>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">{title}</h1>
              {subtitle && <p className="mt-2 text-lg text-neutral-600">{subtitle}</p>}
            </div>

            {vehicle.monthlyRepayment != null && vehicle.monthlyRepayment > 0 && (
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <p className="text-sm font-medium text-neutral-500">Est. Finance From</p>
                <p className="text-2xl font-bold text-primary-900">
                  {formatCalculatorPrice(Math.round(vehicle.monthlyRepayment))}
                  {vehicle.repaymentTerm ? (
                    <span className="text-base font-normal text-neutral-500">
                      {' '}
                      / {vehicle.repaymentTerm} months
                    </span>
                  ) : null}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="flex-1 rounded-lg bg-primary text-light-50 hover:bg-primary/90"
              >
                <Link href="#enquire">Enquire Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 rounded-lg border-primary text-primary"
              >
                <Link href="#finance">Finance Calculator</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
