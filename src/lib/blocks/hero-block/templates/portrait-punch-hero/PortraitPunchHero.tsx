import type { Hero } from '@/payload-types'
import { MediaImage } from '@/components/ui/media-image'
import { cn } from '@/lib/utils/cn'

const overlayColorMap: Record<string, string> = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  black: 'bg-black',
  white: 'bg-white',
}

export const PortraitPunchHero: React.FC<Hero> = (props) => {
  const { portraitPunchHeroContent } = props

  if (!portraitPunchHeroContent?.image || !portraitPunchHeroContent.heading) return null

  const { heading, subheading, image, overlayColor, overlayOpacity } = portraitPunchHeroContent

  const resolvedOverlayColor = overlayColor ?? 'none'
  const opacity = Math.min(100, Math.max(0, overlayOpacity ?? 30))
  const overlayClass =
    resolvedOverlayColor !== 'none' && opacity > 0 ? overlayColorMap[resolvedOverlayColor] : null

  const headingClassName =
    'text-4xl font-bold leading-tight text-neutral-950 sm:text-5xl lg:text-6xl'
  const subheadingClassName =
    'mt-6 max-w-prose text-base leading-relaxed text-neutral-900 sm:text-lg lg:max-w-2xl'

  const textContent = (
    <>
      <h1 className={headingClassName}>{heading}</h1>
      {subheading && <p className={subheadingClassName}>{subheading}</p>}
    </>
  )

  return (
    <section className="relative w-full overflow-hidden bg-light-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[calc(100vh-var(--header-height))]">
        <div className="relative min-h-[75vh] lg:min-h-[unset] z-12">
          <div className=" flex items-center lg:absolute lg:-right-1/4 h-full lg:justify-end">
            <div className="w-100">{textContent}</div>
          </div>
        </div>
        <div className="lg:flex items-center">
          <div className="relative w-full min-h-120 lg:max-w-100 lg:mr-auto">
            <div className="relative h-full">
              <MediaImage
                resource={image}
                imgClassName="w-full h-auto object-cover lg:object-contain lg:object-center"
                priority
                loading="eager"
              />
              {overlayClass && (
                <div
                  aria-hidden
                  className={cn('pointer-events-none absolute inset-0 z-10', overlayClass)}
                  style={{ opacity: opacity / 100 }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
