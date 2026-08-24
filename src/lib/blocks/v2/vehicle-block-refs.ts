import type { BlockSlug } from 'payload'

/** Vehicle range template blocks — mount inside Section/Wrapper/Column (v2) only. */
export const vehicleV2ContentRefs: BlockSlug[] = [
  'vehicleHeroV2',
  'vehicleModelsV2',
  'vehicleColorsV2',
  'vehicleGalleryV2',
  'vehicleFeaturesV2',
  'vehicleFaqV2',
  'vehicleSpecialCategoriesV2',
]

/** Vehicle model template blocks — mount inside Section/Wrapper/Column (v2) only. */
export const vehicleModelV2ContentRefs: BlockSlug[] = [
  'vehicleModelHeroV2',
  'vehicleModelHighlightsV2',
  'vehicleModelColorsV2',
  'vehicleModelSiblingsV2',
  'vehicleModelVariantsV2',
]

/** All vehicle-related v2 blocks for nesting. */
export const allVehicleV2ContentRefs: BlockSlug[] = [
  ...vehicleV2ContentRefs,
  ...vehicleModelV2ContentRefs,
]
