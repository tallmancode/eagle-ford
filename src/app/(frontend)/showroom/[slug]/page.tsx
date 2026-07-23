import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { DEFAULT_OG_DESCRIPTION, formatPageTitle } from '@/constants/site'
import { CRAWLER_ROBOTS } from '@/constants/crawlerPolicy'
import { StockArchiveError } from '@/lib/blocks/stock-archive-block/components/StockArchiveError'
import { getTaxonomySlug } from '@/lib/blocks/stock-archive-block/utils'
import { getCachedStock } from '@/lib/motor-city-stock/getCachedStock'
import { getCachedStockVehicle } from '@/lib/motor-city-stock/getCachedStockVehicle'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'
import { getVehicleQuoteForm } from '@/lib/stock-vehicle/getVehicleQuoteForm'
import { buildStockVehiclePath, getStockVehicleCmsIdFromSlug } from '@/lib/stock-vehicle/paths'
import { getStockHeroImage } from '@/lib/stock-vehicle/media'
import { StockVehicleDetail } from '@/views/StockVehicle/StockVehicleDetail'
import { getStockVehiclePageTitle } from '@/views/StockVehicle/StockVehicleSpecs'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'
import { mergeOpenGraph } from '@/lib/utils/mergeOpenGraph'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

async function getSimilarVehicles(
  vehicle: NonNullable<Awaited<ReturnType<typeof getCachedStockVehicle>>>,
) {
  const bodyType = getTaxonomySlug(vehicle.bodyType)
  if (!bodyType) return []

  try {
    const response = await getCachedStock({
      bodyType,
      limit: 5,
      page: 1,
    })

    return response.docs.filter((item) => item.cmsId !== vehicle.cmsId).slice(0, 4)
  } catch {
    return []
  }
}

export default async function ShowroomVehiclePage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const cmsId = getStockVehicleCmsIdFromSlug(decodedSlug)

  if (!cmsId) {
    notFound()
  }

  let vehicle: Awaited<ReturnType<typeof getCachedStockVehicle>>
  let enquiryForm: Awaited<ReturnType<typeof getVehicleQuoteForm>>

  try {
    ;[vehicle, enquiryForm] = await Promise.all([
      getCachedStockVehicle(cmsId),
      getVehicleQuoteForm(),
    ])
  } catch (error) {
    if (error instanceof MotorCityStockError) {
      return <StockArchiveError />
    }
    throw error
  }

  if (!vehicle) {
    notFound()
  }

  const similarVehicles = await getSimilarVehicles(vehicle)

  return (
    <StockVehicleDetail
      vehicle={vehicle}
      similarVehicles={similarVehicles}
      enquiryForm={enquiryForm}
    />
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const cmsId = getStockVehicleCmsIdFromSlug(decodedSlug)

  if (!cmsId) {
    return { title: formatPageTitle('Vehicle'), robots: CRAWLER_ROBOTS }
  }

  try {
    const vehicle = await getCachedStockVehicle(cmsId)
    if (!vehicle) {
      return { title: formatPageTitle('Vehicle'), robots: CRAWLER_ROBOTS }
    }

    const title = formatPageTitle(getStockVehiclePageTitle(vehicle))
    const heroImage = getStockHeroImage(vehicle.media)
    const path = buildStockVehiclePath(vehicle)
    const serverUrl = getServerSideURL()
    const description = `${getStockVehiclePageTitle(vehicle)} available at Eagle Ford Johannesburg. ${DEFAULT_OG_DESCRIPTION}`

    return {
      title,
      description,
      robots: CRAWLER_ROBOTS,
      alternates: {
        canonical: `${serverUrl}${path}`,
      },
      openGraph: mergeOpenGraph({
        title,
        description,
        url: path,
        images: heroImage?.url ? [{ url: heroImage.url }] : undefined,
      }),
    }
  } catch (error) {
    if (error instanceof MotorCityStockError) {
      return { title: formatPageTitle('Vehicle'), robots: CRAWLER_ROBOTS }
    }
    throw error
  }
}
