import type { MotorCityStockVehicle } from '@/lib/motor-city-stock/types'

type Props = {
  vehicle: MotorCityStockVehicle
}

export function StockVehicleFeatures({ vehicle }: Props) {
  const hasFeatures = Boolean(vehicle.features?.trim())
  const hasComments = Boolean(vehicle.comments?.trim())

  if (!hasFeatures && !hasComments) return null

  return (
    <section className="bg-neutral-50 py-10 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        {hasFeatures && (
          <div>
            <h2 className="mb-4 text-2xl font-bold text-primary-900">Additional Information</h2>
            <p className="whitespace-pre-line text-neutral-600">{vehicle.features}</p>
          </div>
        )}

        {hasComments && (
          <div>
            <h2 className="mb-4 text-2xl font-bold text-primary-900">Dealer&apos;s Comments</h2>
            <p className="whitespace-pre-line text-neutral-600">{vehicle.comments}</p>
          </div>
        )}
      </div>
    </section>
  )
}
