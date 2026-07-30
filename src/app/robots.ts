import type { MetadataRoute } from 'next'

import { getRobotsRouteConfig } from '@/constants/crawlerPolicy'

export default function robots(): MetadataRoute.Robots {
  return getRobotsRouteConfig()
}
