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
      className="group flex flex-col items-center bg-light-50 rounded-lg shadow-card border border-border/40 hover:shadow-lg transition-shadow"
    >
      <div className="w-full overflow-hidden rounded-t-lg mb-3">
        <MediaImage
          resource={vehicle.featureImage}
          imgClassName="w-full h-auto"
          maxWidth={600}
          size="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="px-4 pb-4 flex flex-col">
        <h3 className="uppercase text-primary font-bold text-center text-sm leading-tight">
          {vehicle.name}
        </h3>
        {vehicle.badge && (
          <span className="mt-1 text-xs text-muted-foreground text-center">
            {badgeLabels[vehicle.badge] ?? vehicle.badge}
          </span>
        )}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
