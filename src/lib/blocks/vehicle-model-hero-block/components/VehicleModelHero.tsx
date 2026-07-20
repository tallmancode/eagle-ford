import React from 'react'
import Link from 'next/link'

import { MediaImage } from '@/components/ui/media-image'
import { Button } from '@/components/ui/button'
import type { Vehicle, VehicleModel } from '@/payload-types'
import { formatPrice } from '@/lib/utils/formatPrice'
import { getModelHeroImage } from '@/lib/utils/vehicleModel'

type VehicleModelHeroProps = {
  vehicle: Vehicle
  model: VehicleModel
}

export function VehicleModelHero({ vehicle, model }: VehicleModelHeroProps) {
  const heroImage = getModelHeroImage(model, vehicle)

  return (
    <section className="relative w-full overflow-hidden min-h-[420px] md:min-h-[560px]">
      {heroImage && (
        <MediaImage
          resource={heroImage}
          fill
          imgClassName="object-cover object-center"
          priority
          maxWidth={1920}
          size="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
      <div className="relative z-10 container mx-auto flex flex-col justify-end py-20 px-4 min-h-[420px] md:min-h-[560px]">
        <p className="text-white/70 text-sm uppercase tracking-widest mb-2">{vehicle.name}</p>
        <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          {model.name}
        </h1>
        <div className="mb-6">
          <p className="text-white/80 text-sm uppercase tracking-wide mb-1">Retail Price From</p>
          <p className="text-white text-3xl md:text-4xl font-bold">{formatPrice(model.price)}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a href="#enquire">
            <Button className="rounded-full bg-white text-black hover:bg-white/90 font-semibold">
              Enquire Now
            </Button>
          </a>
          <Link href={`/vehicles/${vehicle.slug}`}>
            <Button
              variant="outline"
              className="rounded-full border-white text-white bg-transparent hover:bg-white/10"
            >
              View {vehicle.name}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
