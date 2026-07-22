import Link from 'next/link'
import { MediaImage } from '@/components/ui/media-image'
import { formatPrice } from '@/lib/utils/formatPrice'
import type { VehicleMegaMenuItem } from '@/lib/data/vehicleMegaMenuTypes'
import { cn } from '@/lib/utils/cn'

type VehicleMegaMenuCardProps = {
  item: VehicleMegaMenuItem
  className?: string
  onNavigate?: () => void
}

export function VehicleMegaMenuCard({ item, className, onNavigate }: VehicleMegaMenuCardProps) {
  const showDisclaimer = Boolean(item.priceDisclaimer)
  const href = item.modelSlug
    ? `/vehicles/${item.slug}/${item.modelSlug}`
    : `/vehicles/${item.slug}`

  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      <Link href={href} className="group flex w-full flex-col items-center" onClick={onNavigate}>
        <div className="relative mb-3 aspect-[3/2] w-full">
          <MediaImage
            resource={item.featureImage}
            fill
            imgClassName="object-contain transition-transform group-hover:scale-105"
            size="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
          />
        </div>
        <span className="text-sm font-bold leading-tight text-foreground">{item.name}</span>
      </Link>
      {item.startingPrice != null && (
        <span className="mt-1 text-xs text-muted-foreground">
          Starting From {formatPrice(item.startingPrice)}
          {showDisclaimer ? '*' : ''}
        </span>
      )}
    </div>
  )
}
