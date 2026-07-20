import type { FeatureRows } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { lucideIconMap } from '@/lib/fields/lucide-icons'
import { resolveLinkFieldHref } from '@/lib/utils/resolveLinkFieldHref'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const FeatureRowsBlockComponent: React.FC<FeatureRows> = ({ rows }) => {
  if (!rows || rows.length === 0) return null

  return (
    <ul className="border-y border-border divide-y divide-border list-none m-0 p-0">
      {rows.map((row, index) => {
        const Icon = lucideIconMap[row.icon]
        const resolvedLink = resolveLinkFieldHref(row.link)
        const number = String(index + 1).padStart(2, '0')

        const newTabProps = resolvedLink?.openInNewTab
          ? { rel: 'noopener noreferrer', target: '_blank' as const }
          : {}

        return (
          <li
            key={row.id ?? index}
            className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:gap-6"
          >
            <div className="flex items-center gap-4 shrink-0">
              <div className="size-10 border border-secondary flex items-center justify-center shrink-0">
                {Icon && <Icon className="size-5 text-secondary" strokeWidth={1.5} />}
              </div>
              <span className="text-secondary font-medium tabular-nums">{number}</span>
              <h3 className="font-semibold text-light-50 text-lg lg:hidden">{row.title}</h3>
            </div>

            <h3 className="hidden lg:block font-semibold text-light-50 text-lg shrink-0 min-w-[12rem] max-w-[16rem]">
              {row.title}
            </h3>

            <p className="text-light-50 text-sm leading-relaxed flex-1 min-w-0">
              {row.description}
            </p>

            {resolvedLink && (
              <Button
                variant="outline"
                className="rounded-none w-fit shrink-0 uppercase tracking-wide"
                asChild
              >
                <Link href={resolvedLink.href} {...newTabProps}>
                  Explore
                  <ChevronRight className="size-4 ml-1" />
                </Link>
              </Button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
