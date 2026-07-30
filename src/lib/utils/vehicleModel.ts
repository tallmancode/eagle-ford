import type { Media, Vehicle, VehicleModel, VehicleVariant } from '@/payload-types'

export function getVehicleModelPath(vehicleSlug: string, modelSlug: string): string {
  return `/vehicles/${vehicleSlug}/${modelSlug}`
}

export function getVehicleVariantHref(
  vehicleSlug: string,
  modelSlug: string,
  variantSlug: string,
): string {
  return `${getVehicleModelPath(vehicleSlug, modelSlug)}#variant-${variantSlug}`
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

export function getVariantImage(
  variant: VehicleVariant,
  model?: Pick<VehicleModel, 'featureImage' | 'heroImage'> | null,
  vehicle?: Pick<Vehicle, 'featureImage' | 'heroImage'> | null,
): string | Media | null {
  return (
    variant.featureImage ??
    variant.heroImage ??
    model?.featureImage ??
    model?.heroImage ??
    vehicle?.featureImage ??
    vehicle?.heroImage ??
    null
  )
}

type ModelColour = NonNullable<NonNullable<VehicleModel['colours']>[number]>
type VariantColour = NonNullable<NonNullable<VehicleVariant['colours']>[number]>

export function getModelColours(
  model: VehicleModel,
  vehicle?: Pick<Vehicle, 'colours'> | null,
): ModelColour[] {
  if (model.colours && model.colours.length > 0) {
    return model.colours
  }
  return (vehicle?.colours as ModelColour[] | null | undefined) ?? []
}

export function getVariantColours(
  variant: VehicleVariant,
  model?: Pick<VehicleModel, 'colours'> | null,
  vehicle?: Pick<Vehicle, 'colours'> | null,
): VariantColour[] {
  if (variant.colours && variant.colours.length > 0) {
    return variant.colours
  }
  return getModelColours((model ?? {}) as VehicleModel, vehicle) as VariantColour[]
}

export function getModelStartingPrice(variants: Pick<VehicleVariant, 'price'>[]): number | null {
  const prices = variants
    .map((variant) => variant.price)
    .filter((price) => typeof price === 'number')
  if (prices.length === 0) return null
  return Math.min(...prices)
}

export function resolveVehicleSlug(
  vehicle: VehicleModel['vehicle'] | Vehicle['id'] | Vehicle | string | null | undefined,
  vehicleById?: Map<string, Pick<Vehicle, 'slug'>>,
): string | null {
  if (!vehicle) return null
  if (typeof vehicle === 'object' && 'slug' in vehicle && vehicle.slug) {
    return vehicle.slug
  }
  const id = typeof vehicle === 'object' ? vehicle.id : vehicle
  return vehicleById?.get(id)?.slug ?? null
}
