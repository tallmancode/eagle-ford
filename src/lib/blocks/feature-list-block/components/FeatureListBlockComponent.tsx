import type { FeatureList } from '@/payload-types'
import { CheckCircle2 } from 'lucide-react'
import React from 'react'

export const FeatureListBlockComponent: React.FC<FeatureList> = ({ features }) => {
  if (!features || features.length === 0) return null

  return (
    <ul className="space-y-6">
      {features.map((feature, index) => (
        <li key={feature.id ?? index} className="flex gap-4">
          <CheckCircle2 className="size-6 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
