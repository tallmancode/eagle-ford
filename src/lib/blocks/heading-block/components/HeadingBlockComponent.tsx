import type { Heading } from '@/payload-types'
import { HeadingMappings } from '@/lib/blocks/heading-block/headingMappings'

export type HeadingKey = keyof typeof HeadingMappings

export const HeadingBlockComponent: React.FC<Heading> = (props) => {
  const { template } = props

  if (!template || !(template in HeadingMappings)) {
    console.warn(
      `Heading template "${template}" not found in HeadingMappings. Available templates:`,
      Object.keys(HeadingMappings),
    )
    return null
  }

  const HeadingToRender = HeadingMappings[template as HeadingKey]

  return <HeadingToRender {...props} />
}
