import { StockCard } from '@/lib/blocks/stock-archive-block/components/StockCard'
import type { MotorCityStockVehicle } from '@/lib/motor-city-stock/types'

type Props = {
  vehicles: MotorCityStockVehicle[]
  enquireUrl?: string
}

export function StockVehicleSimilar({ vehicles, enquireUrl = '/contact' }: Props) {
  if (vehicles.length === 0) return null

  return (
    <section className="bg-neutral-50 py-10 px-4">
      <div className="container mx-auto">
        <h2 className="mb-8 text-center text-2xl font-bold text-primary-900 md:text-3xl">
          Similar Results
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.map((vehicle) => (
            <StockCard key={vehicle.id} vehicle={vehicle} enquireUrl={enquireUrl} />
          ))}
        </div>
      </div>
    </section>
  )
}
