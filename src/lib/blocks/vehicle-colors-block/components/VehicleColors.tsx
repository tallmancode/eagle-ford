'use client'

import React, { useState } from 'react'

import type { Vehicle } from '@/payload-types'
import { MediaImage } from '@/components/ui/media-image'

type ColourItem = NonNullable<NonNullable<Vehicle['colours']>[number]>

type VehicleColorsProps = {
  vehicleName: string
  colours: ColourItem[]
}

export function VehicleColors({ vehicleName, colours }: VehicleColorsProps) {
  const [selectedColour, setSelectedColour] = useState(0)

  if (colours.length === 0) {
    return null
  }

  return (
    <section className="px-4 py-14">
      <div className="container mx-auto">
        <h2 className="mb-10 text-center text-3xl font-bold text-primary">{vehicleName} Colours</h2>

        <div className="relative mx-auto mb-4 aspect-[16/10] w-full max-w-3xl overflow-hidden rounded-2xl bg-muted sm:aspect-[16/9]">
          {colours[selectedColour]?.colourSwatch ? (
            <div className="absolute inset-3 sm:inset-5 md:inset-6">
              <MediaImage
                resource={colours[selectedColour].colourSwatch}
                fill
                imgClassName="object-contain object-center"
                size="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-lg text-muted-foreground">{colours[selectedColour]?.colourName}</p>
            </div>
          )}
        </div>

        <p className="mb-0.5 text-center font-semibold">{colours[selectedColour]?.colourName}</p>
        {colours[selectedColour]?.colourNote && (
          <p className="mb-6 text-center text-sm text-muted-foreground">
            ({colours[selectedColour].colourNote})
          </p>
        )}
        {!colours[selectedColour]?.colourNote && <div className="mb-6" />}

        <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
          {colours.map((colour, i) => (
            <button
              key={colour.id ?? i}
              onClick={() => setSelectedColour(i)}
              className="group flex flex-col items-center gap-2 focus:outline-none"
              title={colour.colourName}
              aria-pressed={selectedColour === i}
              aria-label={colour.colourName}
            >
              <div
                className={`relative h-16 w-28 overflow-hidden rounded-lg border-2 transition-all duration-200 sm:h-20 sm:w-36 ${
                  selectedColour === i
                    ? 'scale-105 border-primary shadow-md'
                    : 'border-transparent hover:border-muted-foreground/40'
                }`}
              >
                {colour.colourSwatch ? (
                  <MediaImage
                    resource={colour.colourSwatch}
                    fill
                    imgClassName="object-cover object-center"
                    size="144px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted-foreground/20">
                    <span className="px-1 text-center text-[10px] leading-tight text-muted-foreground">
                      {colour.colourName}
                    </span>
                  </div>
                )}
              </div>
              <span className="max-w-[7rem] text-center text-xs leading-tight text-muted-foreground sm:max-w-[9rem]">
                {colour.colourName}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
