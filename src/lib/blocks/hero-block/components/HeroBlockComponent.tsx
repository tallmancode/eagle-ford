import type { Hero, Media } from '@/payload-types'
import { HeroMappings } from '@/lib/blocks/hero-block/heroMappings'
import { getMediaUrl } from '@/lib/utils/getMediaUrl'
import { preload } from 'react-dom'

export type HeroKey = keyof typeof HeroMappings

const DEVICE_WIDTHS = [640, 750, 828, 1080, 1200, 1920]
const LCP_QUALITY = 75

function buildNextImageSrcset(relativePath: string): string {
  return DEVICE_WIDTHS.map(
    (w) => `/_next/image?url=${encodeURIComponent(relativePath)}&w=${w}&q=${LCP_QUALITY} ${w}w`,
  ).join(', ')
}

function getLcpImagePath(props: Hero): string | null {
  if (props.template === 'carousel') {
    const carouselContent = props.carouselHeroContent
    if (!carouselContent) return null

    const slides =
      carouselContent.carouselTemplate === 'standard'
        ? carouselContent.standardCarouselContent?.slides
        : carouselContent.overlayCarouselContent?.slides

    const firstSlide = slides?.[0]
    if (!firstSlide) return null
    const image = firstSlide.image
    if (image && typeof image === 'object') {
      return getMediaUrl((image as Media).url, (image as Media).updatedAt) || null
    }
  }
  return null
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
  const lcpPath = getLcpImagePath(props)
  if (lcpPath) {
    preload(`/_next/image?url=${encodeURIComponent(lcpPath)}&w=828&q=${LCP_QUALITY}`, {
      as: 'image',
      imageSrcSet: buildNextImageSrcset(lcpPath),
      imageSizes: '100vw',
      fetchPriority: 'high',
    })
  }

  const HeroToRender = HeroMappings[template as HeroKey]

  return <HeroToRender {...props} />
}
