import React from 'react'

import { SpecialsArchive } from '@/lib/blocks/specials-archive-block/components/SpecialsArchive'
import type { SpecialCategory } from '@/payload-types'

type VehicleSpecialCategoriesProps = {
  categories: SpecialCategory[]
}

export function VehicleSpecialCategories({ categories }: VehicleSpecialCategoriesProps) {
  return <SpecialsArchive categories={categories} />
}
