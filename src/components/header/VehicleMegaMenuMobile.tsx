'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { VehicleMegaMenuCard } from '@/components/header/VehicleMegaMenuCard'
import type { VehicleMegaMenuData } from '@/lib/data/vehicleMegaMenuTypes'
import { getMegaMenuDataForMode } from '@/lib/data/vehicleMegaMenuTypes'
import { cn } from '@/lib/utils/cn'

type VehicleMegaMenuMobileProps = {
  data: VehicleMegaMenuData
  displayMode?: 'vehicles' | 'models' | null
  onNavigate?: () => void
}

export function VehicleMegaMenuMobile({
  data,
  displayMode,
  onNavigate,
}: VehicleMegaMenuMobileProps) {
  const menuData = getMegaMenuDataForMode(data, displayMode)
  const { categories, items } = menuData
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const activeCategoryData = useMemo(
    () => categories.find((cat) => cat.slug === activeCategory),
    [categories, activeCategory],
  )

  const activeItems = useMemo(
    () => (activeCategory ? items.filter((item) => item.categorySlug === activeCategory) : []),
    [items, activeCategory],
  )

  if (!categories.length) {
    return <p className="px-3 py-2 text-muted-foreground">No vehicles available.</p>
  }

  if (activeCategory && activeCategoryData) {
    return (
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className="flex items-center gap-2 text-xl font-semibold text-secondary"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
          {activeCategoryData.title}
        </button>
        <div className="grid grid-cols-2 gap-4">
          {activeItems.map((item) => (
            <VehicleMegaMenuCard key={item.id} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => setActiveCategory(category.slug)}
          className={cn(
            'flex items-center justify-between border-b border-border/40 px-3 py-4 text-left text-xl font-semibold text-secondary',
          )}
        >
          <span>{category.title}</span>
          <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
        </button>
      ))}
    </div>
  )
}
