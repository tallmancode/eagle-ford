import { StockCard } from './StockCard'
import type { StockArchiveVehicle } from '../utils'

type Props = {
  vehicles: StockArchiveVehicle[]
  enquireUrl: string
}

export function StockArchiveGrid({ vehicles, enquireUrl }: Props) {
  if (vehicles.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-light-50 p-12 text-center">
        <p className="text-neutral-600">No vehicles match your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <StockCard key={vehicle.id} vehicle={vehicle} enquireUrl={enquireUrl} />
      ))}
    </div>
  )
}
