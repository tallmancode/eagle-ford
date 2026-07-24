'use client'

import React from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MediaImage } from '@/components/ui/media-image'
import type { Media, VehicleCategory } from '@/payload-types'

export type VehicleTabItem = {
  id: string
  name: string
  slug: string
  badge?: ('newly-launched' | 'coming-soon' | 'limited') | null
  featureImage: string | Media | null
  categorySlug: string
}

const badgeLabels: Record<string, string> = {
  'newly-launched': 'Newly Launched',
  'coming-soon': 'Coming Soon',
  limited: 'Limited',
}

function VehicleCard({ vehicle }: { vehicle: VehicleTabItem }) {
  return (
    <Link
      href={`/vehicles/${vehicle.slug}`}
      className="group flex h-full flex-col items-center bg-card rounded-lg shadow-sm p-4 border border-border/40 hover:shadow-md transition-shadow"
    >
      <div className="relative mb-3 aspect-[3/2] w-full shrink-0 overflow-hidden">
        {vehicle.featureImage ? (
          <MediaImage
            resource={vehicle.featureImage}
            fill
            imgClassName="object-contain object-center"
            size="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : null}
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-start">
        <h3 className="flex min-h-[2.5rem] items-end justify-center text-center text-sm font-bold leading-tight uppercase text-primary">
          {vehicle.name}
        </h3>
        <span className="mt-1 min-h-[1rem] text-center text-xs text-muted-foreground">
          {vehicle.badge ? (badgeLabels[vehicle.badge] ?? vehicle.badge) : '\u00A0'}
        </span>
      </div>
    </Link>
  )
}

type Props = {
  categories: Pick<VehicleCategory, 'id' | 'title' | 'slug'>[]
  vehicles: VehicleTabItem[]
}

export function VehicleTabsClient({ categories, vehicles }: Props) {
  return (
    <div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </TabsContent>

        {categories.map((cat) => {
          const filtered = vehicles.filter((v) => v.categorySlug === cat.slug)
          return (
            <TabsContent key={cat.id} value={cat.slug}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
