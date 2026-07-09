import {
  formatMileage,
  getTaxonomyLabel,
  getVehicleDisplayName,
} from '@/lib/blocks/stock-archive-block/utils'
import type { MotorCityStockVehicle } from '@/lib/motor-city-stock/types'

type Props = {
  vehicle: MotorCityStockVehicle
}

type SpecRow = {
  label: string
  value: string
}

function buildSpecRows(vehicle: MotorCityStockVehicle): SpecRow[] {
  const rows: SpecRow[] = []

  const addRow = (label: string, value: string | number | null | undefined) => {
    if (value === null || value === undefined || value === '') return
    rows.push({ label, value: String(value) })
  }

  addRow('Model', vehicle.modelRange ?? vehicle.model)
  addRow('Model Year', vehicle.year)
  addRow('Mileage', formatMileage(vehicle.mileage))
  addRow('Colour', vehicle.colour)
  addRow('Body Type', getTaxonomyLabel(vehicle.bodyType))
  addRow('Transmission', getTaxonomyLabel(vehicle.transmission))
  addRow('Fuel Type', getTaxonomyLabel(vehicle.fuelType))
  addRow('Stock No.', vehicle.stockNoDisplay ?? vehicle.stockNo)
  addRow('VIN', vehicle.vin)

  return rows
}

export function StockVehicleSpecs({ vehicle }: Props) {
  const rows = buildSpecRows(vehicle)

  if (rows.length === 0) return null

  return (
    <section className="py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-6 text-2xl font-bold text-primary-900">Vehicle Details</h2>
        <dl className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
          {rows.map((row) => (
            <div key={row.label} className="grid gap-1 px-5 py-4 sm:grid-cols-2 sm:gap-4">
              <dt className="text-sm font-semibold text-neutral-700">{row.label}</dt>
              <dd className="text-sm text-neutral-600">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function getStockVehiclePageTitle(vehicle: MotorCityStockVehicle): string {
  const condition = vehicle.newUsed === 'NEW' ? 'NEW' : vehicle.newUsed === 'USED' ? 'USED' : null
  const title = getVehicleDisplayName(vehicle)
  return condition ? `${condition} ${title}` : title
}
