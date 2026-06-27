import type { Hero, NavLinks } from '@/payload-types'
import { MediaImage } from '@/components/ui/media-image'
import { generateNavHref } from '@/lib/fields/navigation/resolveNavHref'
import Link from 'next/link'

type NavLink = NonNullable<NavLinks>[number]

const CtaLinkButton: React.FC<{ link: NavLink }> = ({ link }) => {
  const { type, label, target } = link

  if (type === 'dropdown') return null

  const href = type === 'custom' ? link.url : generateNavHref(link)
  if (!href) return null

  const buttonLabel = label?.trim()
  if (!buttonLabel) return null

  const className =
    'inline-flex items-center justify-center rounded-lg border border-primary-500 px-6 py-2.5 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-500/10'

  if (type === 'custom' && target && target !== '_self') {
    return (
      <a href={href} target={target} rel="noopener noreferrer" className={className}>
        {buttonLabel}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {buttonLabel}
    </Link>
  )
}

export const CtaHero: React.FC<Hero> = (props) => {
  const { ctaHeroContent } = props

  if (!ctaHeroContent?.image || !ctaHeroContent.heading) return null

  const { image, heading, paragraph, cta } = ctaHeroContent
  const navLink = cta?.[0]

  return (
    <section className="relative min-h-[28rem] w-full overflow-hidden bg-dark-950 lg:min-h-[32rem]">
      <div className="absolute inset-0">
        <MediaImage
          resource={image}
          fill
          imgClassName="object-cover object-center lg:object-right"
          priority
          loading="eager"
        />
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-r from-dark-950 from-30% via-dark-950/85 to-dark-950/20 lg:from-25% lg:via-dark-950/70 lg:to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-500/15"
        aria-hidden
      />

      <div className="container relative z-10 flex min-h-[28rem] items-center py-12 lg:min-h-[32rem] lg:py-16">
        <div className="w-full max-w-xl border-l-4 border-primary-500 pl-6 md:max-w-2xl md:pl-8 lg:w-5/12">
          <h2 className="mb-4 text-2xl font-bold leading-tight text-light-50 sm:text-3xl lg:text-4xl">
            {heading}
          </h2>
          {paragraph && (
            <p className="mb-6 text-base leading-relaxed text-light-200 md:text-lg">{paragraph}</p>
          )}
          {navLink && <CtaLinkButton link={navLink} />}
        </div>
      </div>
    </section>
  )
}
