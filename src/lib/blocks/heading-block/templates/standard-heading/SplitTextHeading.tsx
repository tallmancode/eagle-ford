'use client'

import { useEffect, useState } from 'react'
import { motion, type Variants } from 'motion/react'
import { headingTagMap } from '../heading-template-utils'

type SplitTextHeadingProps = {
  text: string
  className: string
  as: keyof typeof headingTagMap
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: '1em' },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

export function SplitTextHeading({ text, className, as }: SplitTextHeadingProps) {
  const [hasMounted, setHasMounted] = useState(false)
  const HeadingTag = headingTagMap[as] ?? 'h2'
  const words = text.split(' ')

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // SSR and hydration must render identical static markup.
  if (!hasMounted) {
    return <HeadingTag className={className}>{text}</HeadingTag>
  }

  return (
    <HeadingTag className={className}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
      >
        {words.map((word, index) => (
          <motion.span key={`${word}-${index}`} variants={wordVariants} className="inline-block">
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        ))}
      </motion.span>
    </HeadingTag>
  )
}
