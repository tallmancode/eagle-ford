import { Hero } from '@/payload-types'
import { HeroGridBackground } from '@/lib/blocks/hero-block/components/HeroGridBackground'
import { MediaImage } from '@/components/ui/media-image'

export const DictionaryHero: React.FC<Hero> = (props) => {
  const { dictionaryHeroContent } = props

  if (!dictionaryHeroContent) return null
  const { mainImage, mainHeading, subHeading, definitions, exampleText } = dictionaryHeroContent
  return (
    <div className="relative overflow-hidden">
      <div className="flex relative z-10 container">
        <div className="pt-20 md:w-6/12 lg:w-5/12 xl:w-4/12 lg:flex justify-center flex-col h-[80vh] px-4 z-20 relative bg-dark-950">
          <div className="z-20">
            {mainHeading && (
              <div className="mb-4">
                <h1 className="text-2xl inline-block sm:text-3xl md:text-4xl lg:text-5xl  text-center text-light-200 uppercase font-semibold leading-7 md:leading-10">
                  {mainHeading}
                </h1>
                <span className="ml-4 italic font-bold">(Noun)</span>
              </div>
            )}

            {subHeading && <h2 className="italic mb-4 text-dark-400">{subHeading}</h2>}
            <div className="[counter-reset:section] pl-8 relative mb-4">
              {definitions &&
                definitions.map((definition, index) => (
                  <p
                    key={index}
                    className="before:absolute before:text-dark-400/30 before:text-3xl py-3 before:left-2 text-left before:[counter-increment:section] before:content-[counter(section)'.'] before:font-bold before:mr-2"
                  >
                    {definition.text}
                  </p>
                ))}
            </div>
            {exampleText && <p className="italic text-dark-400">{exampleText}</p>}
          </div>
          <HeroGridBackground className="z-10" />
        </div>
      </div>
      {mainImage && (
        <div className="absolute inset-0">
          <MediaImage resource={mainImage} fill imgClassName="object-cover object-right" />
        </div>
      )}
    </div>
  )
}
