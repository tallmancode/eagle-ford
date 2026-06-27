import type { Hero } from '@/payload-types'
import { MediaImage } from '@/components/ui/media-image'

const alignmentClasses = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
}

export const OverlayBanner: React.FC<Hero> = (props) => {
  const { bannerHeroContent } = props
  const content = bannerHeroContent?.overlayBannerContent

  if (!content?.image) return null

  const { image, heading, subheading, alignment = 'left', darkOverlay = true } = content

  return (
    <section className="relative w-full overflow-hidden">
      <MediaImage resource={image} imgClassName="w-full h-auto block" priority loading="eager" />

      {darkOverlay && <div className="absolute inset-0 bg-dark-950/50" aria-hidden />}

      {(heading || subheading) && (
        <div className="absolute inset-0 flex items-center">
          <div
            className={`container flex flex-col gap-3 px-4 ${alignmentClasses[alignment as keyof typeof alignmentClasses] ?? alignmentClasses.left}`}
          >
            {heading && (
              <h2 className="text-2xl font-bold text-light-50 sm:text-3xl md:text-4xl lg:text-5xl">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="max-w-2xl text-base text-light-200 md:text-lg">{subheading}</p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
