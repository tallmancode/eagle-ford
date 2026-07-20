'use client'

import { useMemo, useRef, useState } from 'react'
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
  const lastActiveCategoryRef = useRef<string | null>(null)
  const backButtonRef = useRef<HTMLButtonElement>(null)
  const categoryListRef = useRef<HTMLDivElement>(null)

  if (activeCategory) {
    lastActiveCategoryRef.current = activeCategory
  }

  const showingItems = Boolean(activeCategory)
  const categorySlugForItems = activeCategory ?? lastActiveCategoryRef.current

  const activeCategoryData = useMemo(
    () => categories.find((cat) => cat.slug === categorySlugForItems),
    [categories, categorySlugForItems],
  )

  const activeItems = useMemo(
    () =>
      categorySlugForItems
        ? items.filter((item) => item.categorySlug === categorySlugForItems)
        : [],
    [items, categorySlugForItems],
  )

  const openCategory = (slug: string) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setActiveCategory(slug)
    queueMicrotask(() => backButtonRef.current?.focus())
  }

  const closeCategory = () => {
    const slug = activeCategory
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setActiveCategory(null)
    queueMicrotask(() => {
      const button = categoryListRef.current?.querySelector<HTMLButtonElement>(
        `[data-category-slug="${slug}"]`,
      )
      button?.focus()
    })
  }

  if (!categories.length) {
    return <p className="px-3 py-2 text-muted-foreground">No vehicles available.</p>
  }

  return (
    <div className="grid">
      <div
        className={cn(
          'col-start-1 row-start-1 grid transition-[grid-template-rows,opacity] duration-300 ease-out',
          showingItems
            ? 'pointer-events-none grid-rows-[0fr] opacity-0'
            : 'grid-rows-[1fr] opacity-100',
        )}
        inert={showingItems ? true : undefined}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            ref={categoryListRef}
            className={cn(
              'flex flex-col transition-transform duration-300 ease-out',
              showingItems ? '-translate-x-2' : 'translate-x-0',
            )}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                data-category-slug={category.slug}
                onClick={() => openCategory(category.slug)}
                className="flex items-center justify-between border-b border-border/40 px-3 py-4 text-left text-xl font-semibold text-secondary"
              >
                <span>{category.title}</span>
                <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={cn(
          'col-start-1 row-start-1 grid transition-[grid-template-rows,opacity] duration-300 ease-out',
          showingItems
            ? 'grid-rows-[1fr] opacity-100'
            : 'pointer-events-none grid-rows-[0fr] opacity-0',
        )}
        inert={showingItems ? undefined : true}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              'flex flex-col gap-4 transition-transform duration-300 ease-out',
              showingItems ? 'translate-x-0' : 'translate-x-2',
            )}
          >
            {activeCategoryData && (
              <>
                <button
                  ref={backButtonRef}
                  type="button"
                  onClick={closeCategory}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
