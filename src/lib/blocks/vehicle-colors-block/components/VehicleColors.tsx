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
    <section className="py-14 px-4">
      <div className="container mx-auto">
        <h2 className="text-primary text-3xl font-bold text-center mb-10">{vehicleName} Colours</h2>

        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-4 bg-muted flex items-center justify-center">
          {colours[selectedColour]?.colourSwatch ? (
            <MediaImage
              resource={colours[selectedColour].colourSwatch}
              imgClassName="w-auto h-auto max-w-full max-h-full object-contain"
              size="(max-width: 768px) 100vw, 1280px"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-lg">{colours[selectedColour]?.colourName}</p>
            </div>
          )}
        </div>

        <p className="text-center font-semibold mb-0.5">{colours[selectedColour]?.colourName}</p>
        {colours[selectedColour]?.colourNote && (
          <p className="text-center text-sm text-muted-foreground mb-6">
            ({colours[selectedColour].colourNote})
          </p>
        )}
        {!colours[selectedColour]?.colourNote && <div className="mb-6" />}

        <div className="flex flex-wrap justify-center gap-3">
          {colours.map((colour, i) => (
            <button
              key={colour.id ?? i}
              onClick={() => setSelectedColour(i)}
              className="group flex flex-col items-center gap-1.5 focus:outline-none"
              title={colour.colourName}
              aria-pressed={selectedColour === i}
              aria-label={colour.colourName}
            >
              <div
                className={`relative w-16 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedColour === i
                    ? 'border-primary shadow-md scale-110'
                    : 'border-transparent hover:border-muted-foreground/40'
                }`}
              >
                {colour.colourSwatch ? (
                  <MediaImage
                    resource={colour.colourSwatch}
                    fill
                    imgClassName="object-cover object-center"
                    size="64px"
                  />
                ) : (
                  <div className="w-full h-full bg-muted-foreground/20 flex items-center justify-center">
                    <span className="text-[7px] text-center px-0.5 leading-tight text-muted-foreground">
                      {colour.colourName}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground text-center max-w-[64px] leading-tight">
                {colour.colourName}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
