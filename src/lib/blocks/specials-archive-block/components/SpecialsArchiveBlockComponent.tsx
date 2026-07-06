import type { Special, SpecialsArchive } from '@/payload-types'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { MediaImage } from '@/components/ui/media-image'
import { formatZAR } from '@/lib/utils/formatZAR'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function SpecialCard({ special }: { special: Special }) {
  return (
    <div className={'bg-light-200 shadow-card rounded-lg p-2'}>
      <h2 className={'font-bold text-primary text-xl mb-4'}>{special.title}</h2>
      <div className="relative aspect-[4/3] w-full mb-4">
        <MediaImage
          resource={special.cardImage}
          fill
          imgClassName="object-cover"
          size="(max-width: 768px) 100vw, 33vw"
        />
      </div>
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
          <Link href={`/specials/${special.slug}`}>Offer Details</Link>
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
    <div className={'grid grid-cols-3 gap-2'}>
      {specials.docs.map((special, index) => (
        <SpecialCard special={special} key={special.id ?? index}></SpecialCard>
      ))}
    </div>
  )
}
