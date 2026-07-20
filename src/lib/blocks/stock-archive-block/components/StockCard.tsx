import { Cog, Fuel, Gauge, MapPin } from 'lucide-react'
import Link from 'next/link'
import { MediaImage } from '@/components/ui/media-image'
import { Button } from '@/components/ui/button'
import { buildStockVehiclePath } from '@/lib/stock-vehicle/paths'
import {
  buildEnquireUrl,
  formatMileageCompact,
  formatPrice,
  formatTransmissionShort,
  FUEL_TYPE_LABELS,
  getStockImageUrl,
  getTaxonomyLabel,
  getVehicleDisplayName,
  getVehiclePrice,
  type StockArchiveVehicle,
} from '../utils'

type Props = {
  vehicle: StockArchiveVehicle
  enquireUrl: string
}

function SpecItem({ icon: Icon, label }: { icon: typeof Gauge; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 text-center">
      <Icon className="size-4 text-neutral-500" strokeWidth={1.5} />
      <span className="text-xs text-neutral-500">{label}</span>
    </div>
  )
}

export function StockCard({ vehicle, enquireUrl }: Props) {
  const image = getStockImageUrl(vehicle.media)
  const title = getVehicleDisplayName(vehicle)
  const price = getVehiclePrice(vehicle)
  const enquireHref = buildEnquireUrl(enquireUrl, title)
  const detailsHref = buildStockVehiclePath(vehicle)

  const fuelTypeLabel = getTaxonomyLabel(vehicle.fuelType)
  const fuelLabel = FUEL_TYPE_LABELS[fuelTypeLabel?.toLowerCase() ?? ''] ?? fuelTypeLabel ?? '—'

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={detailsHref}
        className="relative block aspect-[16/10] w-full overflow-hidden bg-neutral-100"
      >
        {image ? (
          <MediaImage
            resource={image}
            alt={title}
            fill
            imgClassName="object-cover"
            size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
            quality={100}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            No image
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="px-4 pt-4 pb-3">
          <Link href={detailsHref}>
            <h3
              className="line-clamp-2 min-h-12 text-base font-bold text-primary-900 hover:underline"
              title={title}
            >
              {title}
            </h3>
          </Link>
        </div>

        <div className="flex items-center bg-secondary px-4 py-3 text-light-50">
          <span className="flex-1 text-lg font-bold">{formatPrice(price)}</span>
        </div>

        <div className="flex px-4 py-4">
          <SpecItem icon={Gauge} label={formatMileageCompact(vehicle.mileage)} />
          <SpecItem icon={Cog} label={formatTransmissionShort(vehicle.transmission)} />
          <SpecItem icon={Fuel} label={fuelLabel} />
        </div>

        <div className="mt-auto flex gap-2 px-4 pb-4">
          <Button
            asChild
            variant="outline"
            className="flex-1 rounded-lg border-primary text-primary hover:bg-primary/5"
          >
            <Link href={enquireHref}>Enquire Now</Link>
          </Button>
          <Button
            asChild
            className="flex-1 rounded-lg bg-primary text-light-50 hover:bg-primary/90"
          >
            <Link href={detailsHref}>View Details</Link>
          </Button>
        </div>

        {vehicle.region && (
          <div className="flex items-center justify-center gap-1.5 border-t border-neutral-200 px-4 py-3">
            <MapPin className="size-3.5 shrink-0 text-neutral-500" strokeWidth={1.5} />
            <span className="text-xs text-neutral-500">{vehicle.region}</span>
          </div>
        )}
      </div>
    </article>
  )
}
