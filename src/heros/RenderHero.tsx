import React from 'react'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'
import type { PageHeroProps } from '@/heros/types'

const heroes: Record<string, React.FC<PageHeroProps>> = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero as React.FC<PageHeroProps>,
  mediumImpact: MediumImpactHero,
}

export const RenderHero: React.FC<PageHeroProps> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
