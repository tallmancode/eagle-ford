'use client'

import type { PopupCards } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import { CheckCircle2 } from 'lucide-react'
import React from 'react'
import { richTextConverters } from '@/components/rich-text/richTextConverters'
import { cn } from '@/lib/utils/cn'

type PopupSection = NonNullable<NonNullable<PopupCards['cards']>[number]['popupSections']>[number]

function SectionLabel({ label }: { label?: string | null }) {
  if (!label) return null

  return (
    <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-2">
      {label}
    </p>
  )
}

export function PopupCardSection({ section }: { section: PopupSection }) {
  const wrapperClass = cn(section.showDivider && 'border-t pt-4')

  if (section.style === 'text') {
    return (
      <div className={wrapperClass}>
        <SectionLabel label={section.label} />
        {section.text && <p className="font-medium">{section.text}</p>}
      </div>
    )
  }

  if (section.style === 'checkList') {
    const items = section.items ?? []
    if (items.length === 0) return null

    return (
      <div className={wrapperClass}>
        <SectionLabel label={section.label} />
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={item.id ?? index} className="flex gap-3 text-sm">
              <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (section.style === 'numberedList') {
    const items = section.items ?? []
    if (items.length === 0) return null

    return (
      <div className={wrapperClass}>
        <SectionLabel label={section.label} />
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={item.id ?? index} className="flex gap-3 text-sm text-muted-foreground">
              <span className="size-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (section.style === 'richText') {
    if (!section.content) return null

    return (
      <div className={wrapperClass}>
        <SectionLabel label={section.label} />
        <div className="text-sm text-muted-foreground leading-relaxed">
          <ConvertRichText
            converters={richTextConverters}
            data={section.content as SerializedEditorState}
          />
        </div>
      </div>
    )
  }

  return null
}
