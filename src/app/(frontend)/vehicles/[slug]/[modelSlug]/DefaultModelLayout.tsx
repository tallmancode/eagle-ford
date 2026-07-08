import React from 'react'

import type { Vehicle, VehicleModel } from '@/payload-types'
import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import { VehicleModelHero } from '@/lib/blocks/vehicle-model-hero-block/components/VehicleModelHero'
import { VehicleModelHighlights } from '@/lib/blocks/vehicle-model-highlights-block/components/VehicleModelHighlights'
import { VehicleColors } from '@/lib/blocks/vehicle-colors-block/components/VehicleColors'
import { VehicleModelSiblings } from '@/lib/blocks/vehicle-model-siblings-block/components/VehicleModelSiblings'
import { getModelColours } from '@/lib/utils/vehicleModel'
import { ModelEnquireSection } from './ModelEnquireSection'

type DefaultModelLayoutProps = {
  vehicle: Vehicle
  model: VehicleModel
  siblingModels: VehicleModel[]
}

export function DefaultModelLayout({ vehicle, model, siblingModels }: DefaultModelLayoutProps) {
  const colours = getModelColours(model, vehicle)

  return (
    <>
      <VehicleModelHero vehicle={vehicle} model={model} />
      <VehicleModelHighlights model={model} />
      {colours.length > 0 && <VehicleColors vehicleName={model.name} colours={colours} />}
      <VehicleModelSiblings vehicle={vehicle} currentModel={model} models={siblingModels} />
      <ModelEnquireSection vehicleName={vehicle.name} modelName={model.name} />
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
