'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import type { Heading } from '@/payload-types'
import { renderTextWithColorTags } from '../../utils/renderTextWithColorTags'
import {
  alignmentMap,
  colorMap,
  fontWeightMap,
  headingTagMap,
  sizeMap,
} from '../heading-template-utils'

type SwipeHeadingAnimationProps = {
  text: React.ReactNode
  className: string
  as: keyof typeof headingTagMap
  barColor: string
}

const swipeTransition = {
  duration: 1.2,
  times: [0, 0.45, 0.55, 1],
  ease: 'easeInOut' as const,
}

function SwipeHeadingAnimation({ text, className, as, barColor }: SwipeHeadingAnimationProps) {
  const [hasMounted, setHasMounted] = useState(false)
  const HeadingTag = headingTagMap[as] ?? 'h2'

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // SSR and pre-animation: preserve layout without revealing text.
  if (!hasMounted) {
    return (
      <HeadingTag className={`inline-block opacity-0 ${className}`} aria-hidden="true">
        {text}
      </HeadingTag>
    )
  }

  return (
    <HeadingTag className={`relative inline-block ${className}`}>
      <motion.span
        className="relative z-0"
        initial={{ opacity: 0 }}
        whileInView={{
          opacity: [0, 0, 0, 1],
          transition: swipeTransition,
        }}
        viewport={{ once: true, amount: 0.3 }}
      >
        {text}
      </motion.span>
      <motion.div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: barColor }}
        initial={{ scaleX: 0, transformOrigin: 'left center' }}
        whileInView={{
          scaleX: [0, 1, 1, 0],
          transformOrigin: ['left center', 'left center', 'right center', 'right center'],
          transition: swipeTransition,
        }}
        viewport={{ once: true, amount: 0.3 }}
        aria-hidden="true"
      />
    </HeadingTag>
  )
}

export const SwipeHeading: React.FC<Heading> = (props) => {
  const content = props.swipeHeadingContent
  if (!content?.heading) return null

  const {
    heading,
    barColor: barColorSetting,
    headingTag = 'h2',
    size = 'lg',
    alignment = 'center',
    color = 'primary',
    fontWeight = 'bold',
    uppercase: uppercaseSetting,
  } = content

  const barColor = barColorSetting ?? '#000000'
  const uppercase = uppercaseSetting ?? true
  const colors = colorMap[color ?? 'primary'] ?? colorMap.primary
  const sizes = sizeMap[size ?? 'lg'] ?? sizeMap.lg
  const alignmentClass = alignmentMap[alignment ?? 'center'] ?? alignmentMap.center

  const headingClassName = [
    fontWeightMap[fontWeight ?? 'bold'] ?? fontWeightMap.bold,
    'leading-tight',
    sizes.heading,
    colors.heading,
    uppercase ? 'uppercase' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`mb-8 flex w-full flex-col ${alignmentClass}`}>
      <SwipeHeadingAnimation
        text={renderTextWithColorTags(heading)}
        className={headingClassName}
        as={headingTag ?? 'h2'}
        barColor={barColor}
      />
    </div>
  )
}
