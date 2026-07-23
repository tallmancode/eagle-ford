import React from 'react'

import type { Form, Vehicle, VehicleModel, VehicleVariant } from '@/payload-types'
import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import { VehicleModelHero } from '@/lib/blocks/vehicle-model-hero-block/components/VehicleModelHero'
import { VehicleModelHighlights } from '@/lib/blocks/vehicle-model-highlights-block/components/VehicleModelHighlights'
import { VehicleColors } from '@/lib/blocks/vehicle-colors-block/components/VehicleColors'
import { VehicleModelSiblings } from '@/lib/blocks/vehicle-model-siblings-block/components/VehicleModelSiblings'
import { VehicleModelVariants } from '@/lib/blocks/vehicle-model-variants-block/components/VehicleModelVariants'
import { VehicleEnquireSection } from '@/lib/vehicles/components/VehicleEnquireSection'
import { getModelColours, getModelStartingPrice } from '@/lib/utils/vehicleModel'

type ModelWithPricing = VehicleModel & {
  startingPrice?: number | null
}

type DefaultModelLayoutProps = {
  vehicle: Vehicle
  model: VehicleModel
  variants: VehicleVariant[]
  siblingModels: ModelWithPricing[]
  enquiryForm: Form | null
}

export function DefaultModelLayout({
  vehicle,
  model,
  variants,
  siblingModels,
  enquiryForm,
}: DefaultModelLayoutProps) {
  const colours = getModelColours(model, vehicle)
  const startingPrice = getModelStartingPrice(variants)

  return (
    <>
      <VehicleModelHero vehicle={vehicle} model={model} startingPrice={startingPrice} />
      <VehicleModelHighlights model={model} />
      {colours.length > 0 && <VehicleColors vehicleName={model.name} colours={colours} />}
      <VehicleModelVariants vehicle={vehicle} model={model} variants={variants} />
      <VehicleModelSiblings vehicle={vehicle} currentModel={model} models={siblingModels} />
      {enquiryForm && (
        <VehicleEnquireSection
          form={enquiryForm}
          vehicleName={vehicle.name}
          modelName={model.name}
        />
      )}
      <RenderBlocks
        blocks={model.content?.section ?? null}
        meta={{
          vehicle,
          vehicleModel: model,
          contextValues: { vehicleName: vehicle.name, modelName: model.name },
        }}
      />
    </>
  )
}
