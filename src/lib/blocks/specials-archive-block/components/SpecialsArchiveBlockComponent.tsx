import type { Special, SpecialsArchive } from '@/payload-types'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { MediaImage } from '@/components/ui/media-image'
import { formatZAR } from '@/lib/utils/formatZAR'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function SpecialCard({ special }: { special: Special }) {
  const detailsHref = `/specials/${special.slug}`

  return (
    <div className={'bg-light-200 shadow-card rounded-lg p-4'}>
      <h2 className={'font-bold text-primary text-xl mb-4'}>{special.title}</h2>
      <Link href={detailsHref} className="block relative aspect-square w-full mb-4">
        <MediaImage
          resource={special.cardImage}
          fill
          imgClassName="object-cover"
          size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>
      <p className={'mb-4 font-semibold'}>{special.subTitle}</p>
      <div className={'flex flex-col mb-4'}>
        <span className={'text-sm'}>{special.pricingLabel}</span>
        {special.specialOffer != null && (
          <span className={'text-lg font-bold'}>{formatZAR(special.specialOffer)}*</span>
        )}
      </div>
      <div className={'flex space-x-4'}>
        <Button className="rounded-full" size="sm">
          <Link href="/">Enquire Now</Link>
        </Button>
        <Button variant="outline" className="rounded-full" size="sm">
          <Link href={detailsHref}>Offer Details</Link>
        </Button>
      </div>
    </div>
  )
}

export async function SpecialsArchiveBlockComponent(_props: SpecialsArchive) {
  const payload = await getPayload({ config: configPromise })
  const specials = await payload.find({
    collection: 'specials',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
  })

  return (
    <div className={'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'}>
      {specials.docs.map((special, index) => (
        <SpecialCard special={special} key={special.id ?? index}></SpecialCard>
      ))}
    </div>
  )
}
