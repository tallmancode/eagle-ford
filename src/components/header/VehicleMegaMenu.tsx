'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { VehicleMegaMenuCard } from '@/components/header/VehicleMegaMenuCard'
import type { VehicleMegaMenuData } from '@/lib/data/vehicleMegaMenuTypes'
import { getMegaMenuDataForMode } from '@/lib/data/vehicleMegaMenuTypes'
import { cn } from '@/utilities/ui'

type VehicleMegaMenuProps = {
  data: VehicleMegaMenuData
  displayMode?: 'vehicles' | 'models' | null
}

export function VehicleMegaMenu({ data, displayMode }: VehicleMegaMenuProps) {
  const menuData = getMegaMenuDataForMode(data, displayMode)
  const { categories, items } = menuData

  const firstCategorySlug = categories[0]?.slug ?? ''
  const [activeCategory, setActiveCategory] = useState(firstCategorySlug)

  const activeItems = items.filter((item) => item.categorySlug === activeCategory)

  if (!categories.length) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">No vehicles available.</div>
    )
  }

  return (
    <div className="py-6">
      <div className="flex min-h-[280px] gap-0">
        <div
          role="tablist"
          aria-orientation="vertical"
          className="flex w-56 shrink-0 flex-col border-r border-border pr-4"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category.slug
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                id={`mega-menu-tab-${category.slug}`}
                aria-selected={isActive}
                aria-controls={`mega-menu-panel-${category.slug}`}
                onClick={() => setActiveCategory(category.slug)}
                className={cn(
                  'flex items-center justify-between border-b border-transparent px-2 py-3 text-left text-sm font-semibold transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span>{category.title}</span>
                <ChevronRight
                  className={cn(
                    'h-4 w-4 shrink-0',
                    isActive ? 'text-primary' : 'text-muted-foreground',
                  )}
                  aria-hidden
                />
              </button>
            )
          })}
        </div>

        <div
          role="tabpanel"
          id={`mega-menu-panel-${activeCategory}`}
          aria-labelledby={`mega-menu-tab-${activeCategory}`}
          className="flex-1 px-8"
        >
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {activeItems.map((item) => (
              <VehicleMegaMenuCard key={item.id} item={item} />
            ))}
          </div>
          {activeItems.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No vehicles in this category.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
