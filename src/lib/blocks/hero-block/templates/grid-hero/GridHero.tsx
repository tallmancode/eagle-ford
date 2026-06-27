import type { Hero } from '@/payload-types'
import { HeroGridBackground } from '@/lib/blocks/hero-block/components/HeroGridBackground'

export const GridHero: React.FC<Hero> = (props) => {
  const { gridHeroContent } = props

  if (!gridHeroContent) return null

  const { mainHeading, subHeading, description } = gridHeroContent

  return (
    <div className="relative overflow-hidden bg-dark-950 min-h-[50vh] flex items-center">
      <HeroGridBackground className="z-0 bottom-0" />

      <div className="container relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center flex flex-col justify-center items-center">
          {mainHeading && (
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-dark-300">
              {mainHeading}
            </h1>
          )}

          {subHeading && (
            <p className="text-lg md:text-xl text-light-300 mb-4 max-w-2xl mx-auto">{subHeading}</p>
          )}

          {description && (
            <p className="text-base md:text-lg text-dark-400 mb-8 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
