import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { formatZAR } from '@/lib/utils/formatZAR'
import { getOfferTypeLabel, type SpecialOffer } from '@/lib/data/specialsData'

type SpecialOfferCardProps = {
  offer: SpecialOffer
}

export default function SpecialOfferCard({ offer }: SpecialOfferCardProps) {
  const badgeLabel = offer.sectionLabel ?? getOfferTypeLabel(offer.offerType)

  return (
    <article className="bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] bg-muted/30 p-4">
        <Image
          src={offer.image}
          alt={offer.variantName}
          fill
          className="object-contain p-2"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {offer.vehicleLine}
          </p>
          <h3 className="font-semibold text-foreground leading-snug">{offer.variantName}</h3>
        </div>

        <span className="inline-flex self-start text-xs font-medium uppercase tracking-wide text-primary bg-primary/10 px-2.5 py-1 rounded-full">
          {badgeLabel}
        </span>

        <div className="space-y-1 mt-auto">
          {offer.offerType === 'price-point' && offer.specialOffer != null && (
            <>
              <p className="text-sm text-muted-foreground">
                Special Offer:{' '}
                <span className="font-bold text-foreground text-base">
                  {formatZAR(offer.specialOffer)}*
                </span>
              </p>
              {offer.bestSaving != null && (
                <p className="text-sm text-muted-foreground">
                  Best Saving:{' '}
                  <span className="font-semibold text-foreground">
                    {formatZAR(offer.bestSaving)}*
                  </span>
                </p>
              )}
            </>
          )}

          {offer.offerType === 'payment' && offer.paymentFrom != null && (
            <p className="text-sm text-muted-foreground">
              From{' '}
              <span className="font-bold text-foreground text-base">
                {formatZAR(offer.paymentFrom)}*pm
              </span>
            </p>
          )}

          {offer.offerType === 'service' && (
            <p className="text-sm text-muted-foreground">Contact us for current pricing</p>
          )}
        </div>

        <Button asChild className="w-full rounded-full mt-2">
          <a href="#">View Offer</a>
        </Button>
      </div>
    </article>
  )
}
