import type { BenefitsGrid, Media } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { MediaImage } from '@/components/ui/media-image'
import { resolveLinkFieldHref } from '@/lib/utils/resolveLinkFieldHref'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import React from 'react'

const columnClasses: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
}

type BenefitItem = NonNullable<BenefitsGrid['items']>[number]

function BenefitCard({ item }: { item: BenefitItem }) {
  const image = item.image && typeof item.image === 'object' ? (item.image as Media) : null

  if (!image) return null

  const resolvedLink = resolveLinkFieldHref(item.link)
  const newTabProps = resolvedLink?.openInNewTab
    ? { rel: 'noopener noreferrer', target: '_blank' as const }
    : {}

  return (
    <div className="bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div className="relative aspect-[4/3] w-full">
        <MediaImage
          resource={image}
          alt={item.imageAlt ?? undefined}
          fill
          imgClassName="object-cover"
          size="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-6 flex flex-col flex-1 gap-4">
        <h3 className="text-primary text-xl font-semibold text-center">{item.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed text-center flex-1">
          {item.description}
        </p>
        {resolvedLink && (
          <Button variant="outline" className="rounded-full w-full" asChild>
            <Link href={resolvedLink.href} {...newTabProps}>
              {item.link?.label ?? 'For more info'}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

export const BenefitsGridBlockComponent: React.FC<BenefitsGrid> = ({ columns = '3', items }) => {
  if (!items || items.length === 0) return null

  const gridClass = columnClasses[columns ?? '3'] ?? columnClasses['3']

  return (
    <div className={cn('grid gap-6', gridClass)}>
      {items.map((item, index) => (
        <BenefitCard key={item.id ?? index} item={item} />
      ))}
    </div>
  )
}
