import type { SpecialCategory, SpecialsArchive } from '@/payload-types'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { SpecialsArchive as SpecialsArchiveView } from './SpecialsArchive'

function getCategoryId(category: string | SpecialCategory): string {
  return typeof category === 'object' ? category.id : category
}

export async function SpecialsArchiveBlockComponent(_props: SpecialsArchive) {
  const payload = await getPayload({ config: configPromise })

  const [specialsResult, categoriesResult] = await Promise.all([
    payload.find({
      collection: 'specials',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      depth: 1,
    }),
    payload.find({
      collection: 'special-categories',
      sort: 'sortOrder',
      draft: false,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      depth: 0,
    }),
  ])

  const specials = specialsResult.docs
  if (specials.length === 0) return null

  const categoryIdsWithSpecials = new Set(
    specials.map((special) => getCategoryId(special.category)),
  )

  const categories = categoriesResult.docs.filter((category) =>
    categoryIdsWithSpecials.has(category.id),
  )

  return <SpecialsArchiveView categories={categories} specials={specials} />
}
