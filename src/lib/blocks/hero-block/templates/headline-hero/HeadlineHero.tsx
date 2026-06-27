import type { Hero } from '@/payload-types'
import { renderTextWithColorTags } from '@/lib/blocks/heading-block/utils/renderTextWithColorTags'

export const HeadlineHero: React.FC<Hero> = (props) => {
  const { headlineHeroContent } = props

  if (!headlineHeroContent?.mainHeading) return null

  const { mainHeading, subHeading } = headlineHeroContent

  return (
    <section className="relative flex min-h-[100svh] w-full items-center bg-light-50">
      <div className="container relative z-10 px-4 py-20">
        <div className="flex max-w-5xl flex-col items-start text-left">
          <h1 className="text-2xl font-bold leading-tight text-dark-950 sm:text-3xl md:text-4xl lg:text-5xl">
            {renderTextWithColorTags(mainHeading)}
          </h1>

          {subHeading && (
            <p className="mt-6 max-w-3xl text-lg text-dark-600 md:mt-8 md:text-xl">{subHeading}</p>
          )}
        </div>
      </div>
    </section>
  )
}
