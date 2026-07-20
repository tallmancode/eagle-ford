import type { Media, Partners } from '@/payload-types'
import { MediaImage } from '@/components/ui/media-image'
import React from 'react'

type PartnerItem = NonNullable<Partners['partners']>[number]

function PartnerCard({ partner }: { partner: PartnerItem }) {
  const logo = partner.logo && typeof partner.logo === 'object' ? (partner.logo as Media) : null

  if (!logo) return null

  return (
    <div className="flex w-56 h-36 items-center justify-center bg-white rounded-2xl shadow-sm border px-6">
      <MediaImage
        resource={logo}
        alt={partner.imageAlt ?? undefined}
        width={180}
        height={90}
        imgClassName="object-contain max-h-20"
        maxWidth={300}
        size="224px"
      />
    </div>
  )
}

export const PartnersBlockComponent: React.FC<Partners> = ({ partners }) => {
  if (!partners || partners.length === 0) return null

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {partners.map((partner, index) => (
        <PartnerCard key={partner.id ?? index} partner={partner} />
      ))}
    </div>
  )
}
