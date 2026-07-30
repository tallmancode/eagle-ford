import Image from 'next/image'
import Link from 'next/link'
import { generateNavHref, getNavLinkTarget } from '@/lib/fields/navigation/resolveNavHref'
import {
  SocialIconSvg,
  getSocialIconHref,
  isNativeLinkPlatform,
  SOCIAL_ICONS,
} from '@/lib/fields/social-icons'
import { getMediaUrl } from '@/lib/utils/getMediaUrl'
import type { Footer, Media, NavLinks } from '@/payload-types'

const columnHeadingClass = 'text-white text-sm font-bold uppercase tracking-widest mb-4'
const linkClass =
  'text-gray-300 hover:text-white text-sm leading-relaxed transition-colors duration-200'

type NavLink = NonNullable<NavLinks>[number]

function FooterLink({
  link,
  className,
  fallbackLabel,
}: {
  link: NavLink
  className?: string
  fallbackLabel?: string
}) {
  const href = generateNavHref(link)
  if (!href || href === '#') return null

  const target = getNavLinkTarget(link)
  const opensNewTab = target === '_blank'
  const label = link.label?.trim() ? link.label : fallbackLabel

  if (!label) return null

  if (opensNewTab) {
    return (
      <a href={href} target={target} rel="noopener noreferrer" className={className}>
        {label}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

function renderStars(rating: number): string {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty)
}

export const SiteFooter = ({ footer }: { footer: Footer }) => {
  const columns = footer.columns ?? []

  return (
    <footer className="bg-primary text-white">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {columns.map((col) => {
            if (col.blockType === 'linksColumn') {
              return (
                <div key={col.id}>
                  <h5 className={columnHeadingClass}>{col.heading}</h5>
                  <ul className="space-y-2">
                    {(col.links ?? []).map((link) => (
                      <li key={link.id}>
                        <FooterLink link={link} className={linkClass} />
                      </li>
                    ))}
                  </ul>
                </div>
              )
            }

            if (col.blockType === 'socialColumn') {
              return (
                <div key={col.id}>
                  <h5 className={columnHeadingClass}>{col.heading}</h5>
                  <ul className="space-y-3">
                    {(col.socials ?? []).map((social) => {
                      const label = SOCIAL_ICONS[social.platform]?.label ?? social.platform
                      const href = getSocialIconHref(social.platform, social.url)
                      const isNative = isNativeLinkPlatform(social.platform)
                      const iconEl = (
                        <SocialIconSvg
                          platform={social.platform}
                          size={20}
                          iconStyle={social.iconStyle}
                        />
                      )
                      return (
                        <li key={social.id}>
                          {isNative ? (
                            <a
                              href={href}
                              aria-label={label}
                              className={`${linkClass} flex items-center gap-3`}
                            >
                              {iconEl}
                              <span>{label}</span>
                            </a>
                          ) : (
                            <Link
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${linkClass} flex items-center gap-3`}
                            >
                              {iconEl}
                              <span>{label}</span>
                            </Link>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            }

            if (col.blockType === 'badgeColumn') {
              const logoMedia =
                col.logoImage && typeof col.logoImage === 'object' ? (col.logoImage as Media) : null
              const badgeMedia =
                col.badgeImage && typeof col.badgeImage === 'object'
                  ? (col.badgeImage as Media)
                  : null

              return (
                <div key={col.id} className="flex flex-col items-start gap-4">
                  {logoMedia && (
                    <Image
                      src={getMediaUrl(logoMedia.url)}
                      alt={logoMedia.alt ?? 'Logo'}
                      width={logoMedia.width ?? 112}
                      height={logoMedia.height ?? 60}
                      className="w-28 brightness-0 invert"
                    />
                  )}

                  {col.badgeEnabled &&
                    (badgeMedia ? (
                      <Image
                        src={getMediaUrl(badgeMedia.url)}
                        alt={badgeMedia.alt ?? 'Dealership badge'}
                        width={badgeMedia.width ?? 160}
                        height={badgeMedia.height ?? 80}
                        className="w-full max-w-[160px]"
                      />
                    ) : (
                      <div className="bg-white rounded-lg px-4 py-3 flex flex-col items-center gap-1 w-full max-w-[160px]">
                        {(col.badgeTitle || col.badgeSubtitle) && (
                          <p className="text-[#071a2e] text-xs font-bold uppercase tracking-wider text-center leading-tight">
                            {col.badgeTitle}
                            {col.badgeTitle && col.badgeSubtitle && <br />}
                            {col.badgeSubtitle}
                          </p>
                        )}
                        {col.rating != null && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[#071a2e] font-bold text-sm">{col.rating}</span>
                            <div className="flex text-yellow-400 text-sm">
                              {renderStars(col.rating)
                                .split('')
                                .map((s, i) => (
                                  <span key={i}>{s}</span>
                                ))}
                            </div>
                          </div>
                        )}
                        {col.googleReviewUrl ? (
                          <a
                            href={col.googleReviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="See our Google reviews"
                          >
                            <GoogleLogo />
                          </a>
                        ) : (
                          <GoogleLogo />
                        )}
                      </div>
                    ))}
                </div>
              )
            }

            return null
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
          <p>
            {footer.copyrightText ??
              `© Eagle Ford ${new Date().getFullYear()}. All rights reserved.`}
          </p>
          {(() => {
            const barLink = footer.bottomBarLink?.[0]
            if (!barLink) return null
            return (
              <FooterLink
                link={barLink}
                fallbackLabel="Privacy Policy"
                className="hover:text-white transition-colors duration-200"
              />
            )
          })()}
        </div>
      </div>
    </footer>
  )
}

function GoogleLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 272 92"
      className="w-16 mt-1"
      aria-label="Google"
    >
      <path
        fill="#4285F4"
        d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18S71.25 59.95 71.25 47.18c0-12.86 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S81 39.2 81 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
      />
      <path
        fill="#EA4335"
        d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.86 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
      />
      <path
        fill="#FBBC05"
        d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"
      />
      <path fill="#4285F4" d="M225 3v65h-9.5V3h9.5z" />
      <path
        fill="#34A853"
        d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
      />
      <path
        fill="#EA4335"
        d="M35.29 41.41V32h31.96c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.46.36 15.03 16.32-.43 35.55-.43c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.74.01z"
      />
    </svg>
  )
}
