import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { formatPageTitle } from '@/constants/site'
import { getTaxonomySlug } from '@/lib/blocks/stock-archive-block/utils'
import { getCachedStock } from '@/lib/motor-city-stock/getCachedStock'
import { getCachedStockVehicle } from '@/lib/motor-city-stock/getCachedStockVehicle'
import { getVehicleQuoteForm } from '@/lib/stock-vehicle/getVehicleQuoteForm'
import { buildStockVehiclePath, getStockVehicleCmsIdFromSlug } from '@/lib/stock-vehicle/paths'
import { getStockHeroImage } from '@/lib/stock-vehicle/media'
import { StockVehicleDetail } from '@/views/StockVehicle/StockVehicleDetail'
import { getStockVehiclePageTitle } from '@/views/StockVehicle/StockVehicleSpecs'

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

  const response = await getCachedStock({
    bodyType,
    limit: 5,
    page: 1,
  })

  return response.docs.filter((item) => item.cmsId !== vehicle.cmsId).slice(0, 4)
}

export default async function ShowroomVehiclePage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const cmsId = getStockVehicleCmsIdFromSlug(decodedSlug)

  if (!cmsId) {
    notFound()
  }

  const [vehicle, enquiryForm] = await Promise.all([
    getCachedStockVehicle(cmsId),
    getVehicleQuoteForm(),
  ])

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
    return { title: formatPageTitle('Vehicle') }
  }

  const vehicle = await getCachedStockVehicle(cmsId)
  if (!vehicle) {
    return { title: formatPageTitle('Vehicle') }
  }

  const title = formatPageTitle(getStockVehiclePageTitle(vehicle))
  const heroImage = getStockHeroImage(vehicle.media)
  const url = buildStockVehiclePath(vehicle)

  return {
    title,
    openGraph: {
      title,
      url,
      images: heroImage?.url ? [{ url: heroImage.url }] : undefined,
    },
  }
}
