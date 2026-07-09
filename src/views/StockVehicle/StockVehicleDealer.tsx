import { MapPin, Phone } from 'lucide-react'

import type { MotorCityStockDealership, MotorCityStockVehicle } from '@/lib/motor-city-stock/types'

type Props = {
  vehicle: MotorCityStockVehicle
}

function getDealership(vehicle: MotorCityStockVehicle): MotorCityStockDealership | null {
  if (!vehicle.dealership || typeof vehicle.dealership === 'string') return null
  return vehicle.dealership
}

export function StockVehicleDealer({ vehicle }: Props) {
  const dealership = getDealership(vehicle)
  const phone = dealership?.phoneNumber ?? dealership?.cellNumber
  const region = dealership?.region ?? vehicle.region

  if (!dealership?.name && !phone && !region) return null

  return (
    <section className="py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-6 text-2xl font-bold text-primary-900">Dealership Information</h2>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          {dealership?.name && (
            <div className="mb-4">
              <p className="text-sm font-medium text-neutral-500">Dealership</p>
              <p className="text-lg font-semibold text-primary-900">{dealership.name}</p>
            </div>
          )}

          {region && (
            <div className="mb-4 flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-neutral-500" />
              <div>
                <p className="text-sm font-medium text-neutral-500">Region</p>
                <p className="text-neutral-700">{region}</p>
              </div>
            </div>
          )}

          {phone && (
            <div className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-neutral-500" />
              <div>
                <p className="text-sm font-medium text-neutral-500">Contact Number</p>
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="text-primary hover:underline"
                >
                  {phone}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
