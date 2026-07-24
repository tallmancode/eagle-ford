import Link from 'next/link'
import React from 'react'

import { MediaImage } from '@/components/ui/media-image'
import { getSpecialCategoryPath } from '@/lib/specials/paths'
import type { SpecialCategory } from '@/payload-types'

type SpecialsArchiveProps = {
  categories: SpecialCategory[]
}

function CategoryCard({ category }: { category: SpecialCategory }) {
  const href = getSpecialCategoryPath(category.slug)
  const hasImage = Boolean(category.featureImage)

  return (
    <Link
      href={href}
      className="group bg-light-50 shadow-card block overflow-hidden rounded-lg transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {hasImage ? (
          <MediaImage
            resource={category.featureImage}
            fill
            imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
            maxWidth={900}
            size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10">
            <span className="text-sm font-medium text-primary/60">No image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold text-primary group-hover:underline">{category.title}</h2>
      </div>
    </Link>
  )
}

export function SpecialsArchive({ categories }: SpecialsArchiveProps) {
  if (categories.length === 0) return null

  return (
    <section className="py-14 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}
