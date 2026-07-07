import type { FormInputField } from '@/lib/blocks/form-block/utils/getFormSteps'

type FormBlockLayout = 'default' | 'hero'

export function normalizeFieldWidth(width?: number | null): number {
  const parsed = Number(width)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 100
}

export function resolveFieldWidth(
  field: FormInputField,
  layout?: FormBlockLayout,
): number | null | undefined {
  const cmsWidth = 'width' in field ? (field.width as number | null | undefined) : null

  if (field.blockType === 'upload') {
    return cmsWidth ?? 100
  }

  if (cmsWidth != null) {
    return cmsWidth
  }

  if (layout === 'hero' && field.blockType !== 'message') {
    return 50
  }

  return null
}

/** Width classes for the field row wrapper (flex child or nested grid item). */
export function getFieldLayoutClassName(
  width?: number | null,
  layout: FormBlockLayout = 'default',
): string {
  const w = normalizeFieldWidth(width)
  const isHero = layout === 'hero'

  if (w >= 100) {
    return isHero ? 'w-full lg:col-span-2' : 'w-full'
  }

  if (w >= 50) {
    return isHero ? 'w-full' : 'w-full md:w-[calc(50%-0.5rem)]'
  }

  if (w >= 33) {
    return isHero ? 'w-full' : 'w-full md:w-[calc(33.333%-0.667rem)]'
  }

  return isHero ? 'w-full' : 'w-full md:w-[calc(50%-0.5rem)]'
}
