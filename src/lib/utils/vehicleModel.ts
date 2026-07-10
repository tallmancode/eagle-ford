import type { Media, Vehicle, VehicleModel } from '@/payload-types'

export function getVehicleModelPath(vehicleSlug: string, modelSlug: string): string {
  return `/vehicles/${vehicleSlug}/${modelSlug}`
}

export function getModelImage(
  model: VehicleModel,
  vehicle?: Pick<Vehicle, 'featureImage' | 'heroImage'> | null,
): string | Media | null {
  return (
    model.featureImage ?? model.heroImage ?? vehicle?.featureImage ?? vehicle?.heroImage ?? null
  )
}

export function getModelHeroImage(
  model: VehicleModel,
  vehicle?: Pick<Vehicle, 'heroImage' | 'featureImage'> | null,
): string | Media | null {
  return (
    model.heroImage ?? model.featureImage ?? vehicle?.heroImage ?? vehicle?.featureImage ?? null
  )
}

type ModelColour = NonNullable<NonNullable<VehicleModel['colours']>[number]>

export function getModelColours(
  model: VehicleModel,
  vehicle?: Pick<Vehicle, 'colours'> | null,
): ModelColour[] {
  if (model.colours && model.colours.length > 0) {
    return model.colours
  }
  return (vehicle?.colours as ModelColour[] | null | undefined) ?? []
}
