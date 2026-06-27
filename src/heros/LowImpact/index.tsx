import React from 'react'

import RichText from '@/components/RichText'

import type { PageHeroProps } from '@/heros/types'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Pick<PageHeroProps, 'richText'> & {
      children?: never
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
  return (
    <div className="container mt-16">
      <div className="max-w-[48rem]">
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}
