import type { Hero } from '@/payload-types'
import { CarouselMappings } from '@/lib/blocks/hero-block/templates/carousel-hero/carouselMappings'

export type CarouselKey = keyof typeof CarouselMappings

export const CarouselHero: React.FC<Hero> = (props) => {
  const { carouselHeroContent } = props
  const carouselTemplate = carouselHeroContent?.carouselTemplate

  if (!carouselTemplate || !(carouselTemplate in CarouselMappings)) {
    console.warn(
      `Carousel template "${carouselTemplate}" not found in CarouselMappings. Available templates:`,
      Object.keys(CarouselMappings),
    )
    return null
  }

  const CarouselToRender = CarouselMappings[carouselTemplate as CarouselKey]

  return <CarouselToRender {...props} />
}

export default CarouselHero
