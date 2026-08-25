import type { Hero, Media } from '@/payload-types'
import { HeroMappings } from '@/lib/blocks/hero-block/heroMappings'
import { FULL_BLEED_IMAGE_MAX_WIDTH, getOptimalMediaSize } from '@/lib/utils/getOptimalMediaSize'
import { preload } from 'react-dom'

export type HeroKey = keyof typeof HeroMappings

const DEVICE_WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2560, 3440]
/** Must match first-slide `quality` on Standard/Overlay carousel (avoid double-fetch). */
const LCP_QUALITY = 65
const MOBILE_MAX_WIDTH = 768
const MOBILE_MEDIA = '(max-width: 767px)'
const DESKTOP_MEDIA = '(min-width: 768px)'

function buildNextImageSrcset(relativePath: string): string {
  return DEVICE_WIDTHS.map(
    (w) => `/_next/image?url=${encodeURIComponent(relativePath)}&w=${w}&q=${LCP_QUALITY} ${w}w`,
  ).join(', ')
}

function resolveOptimizedPath(image: unknown, targetWidth: number): string | null {
  if (!image || typeof image !== 'object') return null
  return getOptimalMediaSize(image as Media, targetWidth)?.url || null
}

function getLcpSources(props: Hero): { desktop: string | null; mobile: string | null } {
  if (props.template === 'carousel') {
    const carouselContent = props.carouselHeroContent
    if (!carouselContent) return { desktop: null, mobile: null }

    const slides =
      carouselContent.carouselTemplate === 'standard'
        ? carouselContent.standardCarouselContent?.slides
        : carouselContent.overlayCarouselContent?.slides

    const firstSlide = slides?.[0]
    if (!firstSlide) return { desktop: null, mobile: null }

    return {
      desktop: resolveOptimizedPath(firstSlide.image, FULL_BLEED_IMAGE_MAX_WIDTH),
      mobile: resolveOptimizedPath(firstSlide.mobileImage, MOBILE_MAX_WIDTH),
    }
  }

  if (props.template === 'form') {
    return {
      desktop: resolveOptimizedPath(props.formHeroContent?.image, FULL_BLEED_IMAGE_MAX_WIDTH),
      mobile: null,
    }
  }

  return { desktop: null, mobile: null }
}

function preloadHeroImage(path: string, media?: string) {
  preload(`/_next/image?url=${encodeURIComponent(path)}&w=828&q=${LCP_QUALITY}`, {
    as: 'image',
    imageSrcSet: buildNextImageSrcset(path),
    imageSizes: '100vw',
    fetchPriority: 'high',
    ...(media ? { media } : {}),
  })
}

export const HeroBlock: React.FC<Hero> = (props) => {
  const { template } = props

  if (!template || !(template in HeroMappings)) {
    console.warn(
      `Hero template "${template}" not found in HeroMappings. Available templates:`,
      Object.keys(HeroMappings),
    )
    return null
  }

  // Emit an early <link rel="preload" fetchpriority="high"> for the LCP hero image.
  // preload() is a React 19 resource API that emits hints into the document <head>
  // from server components, ensuring the browser discovers the image before JS runs.
  const { desktop, mobile } = getLcpSources(props)
  if (mobile) {
    preloadHeroImage(mobile, MOBILE_MEDIA)
  }
  if (desktop) {
    preloadHeroImage(desktop, mobile ? DESKTOP_MEDIA : undefined)
  }

  const HeroToRender = HeroMappings[template as HeroKey]

  return <HeroToRender {...props} />
}
