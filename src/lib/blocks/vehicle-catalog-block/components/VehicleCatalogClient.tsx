'use client'

import React from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { MediaImage } from '@/components/ui/media-image'
import { formatPrice } from '@/lib/utils/formatPrice'
import type { Media, VehicleCategory } from '@/payload-types'

export type VehicleCatalogItem = {
  id: string
  name: string
  slug: string
  badge?: ('newly-launched' | 'coming-soon' | 'limited') | null
  featureImage: string | Media | null
  categorySlug: string
  startingPrice?: number | null
  priceDisclaimer?: string | null
}

const badgeLabels: Record<string, string> = {
  'newly-launched': 'Newly Launched',
  'coming-soon': 'Coming Soon',
  limited: 'Limited',
}

function VehicleCatalogCard({ vehicle }: { vehicle: VehicleCatalogItem }) {
  return (
    <div className="flex h-full flex-col items-center bg-card rounded-lg shadow-sm p-4 border border-border/40">
      <div className="relative w-full aspect-[3/2] mb-3">
        <MediaImage
          resource={vehicle.featureImage}
          fill
          imgClassName="object-contain"
          size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <h3 className="uppercase text-primary font-bold text-center text-sm leading-tight">
        {vehicle.name}
      </h3>
      {vehicle.badge && (
        <span className="mt-1 text-xs uppercase text-muted-foreground text-center">
          {badgeLabels[vehicle.badge] ?? vehicle.badge}
        </span>
      )}
      {vehicle.startingPrice != null && (
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Starting From {formatPrice(vehicle.startingPrice)}
        </p>
      )}
      {vehicle.priceDisclaimer && (
        <p className="mt-1 text-xs text-muted-foreground/80 text-center leading-snug">
          {vehicle.priceDisclaimer}
        </p>
      )}
      <div className="mt-auto w-full pt-4">
        <Button asChild className="w-full rounded-full">
          <Link href={`/vehicles/${vehicle.slug}`}>Explore Vehicle</Link>
        </Button>
      </div>
    </div>
  )
}

type Props = {
  heading?: string | null
  categories: Pick<VehicleCategory, 'id' | 'title' | 'slug'>[]
  vehicles: VehicleCatalogItem[]
}

function VehicleGrid({ vehicles }: { vehicles: VehicleCatalogItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCatalogCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  )
}

export function VehicleCatalogClient({ heading, categories, vehicles }: Props) {
  return (
    <div>
      {heading && <h2 className="text-2xl text-muted-foreground mb-6">{heading}</h2>}
      <Tabs defaultValue="all">
        <TabsList variant="line" className="mb-6 flex flex-wrap h-auto gap-x-1">
          <TabsTrigger value="all">All Vehicles</TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.slug}>
              {cat.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <VehicleGrid vehicles={vehicles} />
        </TabsContent>

        {categories.map((cat) => {
          const filtered = vehicles.filter((v) => v.categorySlug === cat.slug)
          return (
            <TabsContent key={cat.id} value={cat.slug}>
              <VehicleGrid vehicles={filtered} />
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
