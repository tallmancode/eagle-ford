import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'

import { StockArchiveError } from '@/lib/blocks/stock-archive-block/components/StockArchiveError'
import { getTaxonomyLabel, getTaxonomySlug } from '@/lib/blocks/stock-archive-block/utils'
import { getFinanceCalculatorDefaults } from '@/lib/blocks/finance-calculator-block/getFinanceCalculatorDefaults'
import { getCachedStock } from '@/lib/motor-city-stock/getCachedStock'
import { getCachedStockVehicle } from '@/lib/motor-city-stock/getCachedStockVehicle'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'
import { getShowroomQuoteForm } from '@/lib/stock-vehicle/getVehicleQuoteForm'
import { buildStockVehiclePath, getStockVehicleCmsIdFromSlug } from '@/lib/stock-vehicle/paths'
import { getStockHeroImage } from '@/lib/stock-vehicle/media'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import { buildDocumentMetadata } from '@/lib/seo/buildDocumentMetadata'
import {
  buildJsonLdGraph,
  getBreadcrumbJsonLd,
  getStockVehicleJsonLd,
  getWebPageJsonLd,
} from '@/lib/seo/dealershipJsonLd'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { StockVehicleDetail } from '@/views/StockVehicle/StockVehicleDetail'
import { getStockVehiclePageTitle } from '@/views/StockVehicle/StockVehicleSpecs'
import type { Setting } from '@/payload-types'

/** Stock detail pages — align with Motor City stock cache TTL. */
export const revalidate = 300

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
  } catch (error) {
    Sentry.captureException(error, {
      tags: { area: 'showroom', phase: 'similar-vehicles' },
      extra: { bodyType, cmsId: vehicle.cmsId },
    })
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
  let enquiryForm: Awaited<ReturnType<typeof getShowroomQuoteForm>>
  let settings: Setting

  try {
    ;[vehicle, enquiryForm, settings] = await Promise.all([
      getCachedStockVehicle(cmsId),
      getShowroomQuoteForm(),
      getCachedGlobal('settings', 1) as Promise<Setting>,
    ])
  } catch (error) {
    if (error instanceof MotorCityStockError) {
      Sentry.captureException(error, {
        tags: { area: 'showroom', phase: 'load-vehicle' },
        extra: { cmsId, slug: decodedSlug },
        level: 'warning',
      })
      return <StockArchiveError />
    }
    Sentry.captureException(error, {
      tags: { area: 'showroom', phase: 'load-vehicle' },
      extra: { cmsId, slug: decodedSlug },
    })
    throw error
  }

  if (!vehicle) {
    notFound()
  }

  const similarVehicles = await getSimilarVehicles(vehicle)
  const calculatorDefaults = getFinanceCalculatorDefaults(settings)
  const pageTitle = getStockVehiclePageTitle(vehicle)
  const heroImage = getStockHeroImage(vehicle.media)
  const vehiclePath = buildStockVehiclePath(vehicle)
  const year = vehicle.year ? `${vehicle.year} ` : ''
  const description =
    vehicle.comments?.trim() ||
    `${year}${pageTitle} available at Eagle Ford in Sandton. View specs, photos and enquire online.`
  const offerPrice =
    typeof vehicle.specialPrice === 'number' && Number.isFinite(vehicle.specialPrice)
      ? vehicle.specialPrice
      : typeof vehicle.price === 'number' && Number.isFinite(vehicle.price)
        ? vehicle.price
        : null

  return (
    <>
      <JsonLd
        data={buildJsonLdGraph(
          getWebPageJsonLd({
            name: pageTitle,
            description,
            path: vehiclePath,
            imageUrl: heroImage?.url,
          }),
          getStockVehicleJsonLd({
            name: pageTitle,
            description,
            path: vehiclePath,
            imageUrl: heroImage?.url,
            price: offerPrice,
            brandName: getTaxonomyLabel(vehicle.brand),
            model: vehicle.model,
            vehicleModelDate: vehicle.year,
            mileage: vehicle.mileage,
            sku: vehicle.stockNoDisplay ?? vehicle.stockNo ?? vehicle.cmsId,
            color: vehicle.colour,
          }),
          getBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Showroom', path: '/showroom' },
            { name: pageTitle, path: vehiclePath },
          ]),
        )}
      />
      <StockVehicleDetail
        vehicle={vehicle}
        similarVehicles={similarVehicles}
        enquiryForm={enquiryForm}
        calculatorDefaults={calculatorDefaults}
      />
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const cmsId = getStockVehicleCmsIdFromSlug(decodedSlug)
  const fallbackPath = `/showroom/${decodedSlug}`

  if (!cmsId) {
    return buildDocumentMetadata({ title: 'Vehicle', path: fallbackPath })
  }

  try {
    const vehicle = await getCachedStockVehicle(cmsId)
    if (!vehicle) {
      return buildDocumentMetadata({ title: 'Vehicle', path: fallbackPath })
    }

    const pageTitle = getStockVehiclePageTitle(vehicle)
    const heroImage = getStockHeroImage(vehicle.media)
    const url = buildStockVehiclePath(vehicle)
    const year = vehicle.year ? `${vehicle.year} ` : ''
    const description = `${year}${pageTitle} available at Eagle Ford in Sandton. View specs, photos and enquire online.`

    return buildDocumentMetadata({
      title: pageTitle,
      description,
      path: url,
      imageUrl: heroImage?.url,
    })
  } catch (error) {
    if (error instanceof MotorCityStockError) {
      Sentry.captureException(error, {
        tags: { area: 'showroom', phase: 'generateMetadata' },
        extra: { cmsId, slug: decodedSlug },
        level: 'warning',
      })
      return buildDocumentMetadata({ title: 'Vehicle', path: fallbackPath })
    }
    Sentry.captureException(error, {
      tags: { area: 'showroom', phase: 'generateMetadata' },
      extra: { cmsId, slug: decodedSlug },
    })
    throw error
  }
}
