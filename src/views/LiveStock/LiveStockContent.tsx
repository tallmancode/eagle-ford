import Link from 'next/link'
import { Banner } from '@payloadcms/ui/elements/Banner'
import { Gutter } from '@payloadcms/ui/elements/Gutter'
import { formatAdminURL } from 'payload/shared'

import { LIVE_STOCK_ADMIN_PATH } from '@/components/admin/sidebar/customNavLinks'
import { fetchStock } from '@/lib/motor-city-stock/fetchStock'
import type { FetchStockOptions } from '@/lib/motor-city-stock/types'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'

import './index.scss'

const baseClass = 'live-stock-view'
const adminRoute = '/admin'

type SearchParams = Record<string, string | string[] | undefined>

function adminStockPath(query = ''): string {
  return `${formatAdminURL({ adminRoute, path: LIVE_STOCK_ADMIN_PATH })}${query}`
}

function getParam(searchParams: SearchParams | undefined, key: string): string | undefined {
  const value = searchParams?.[key]
  return Array.isArray(value) ? value[0] : value
}

function buildQuery(
  searchParams: SearchParams | undefined,
  overrides: Record<string, string | null>,
) {
  const params = new URLSearchParams()

  const current = {
    newUsed: getParam(searchParams, 'newUsed'),
    page: getParam(searchParams, 'page'),
  }

  const next = { ...current, ...overrides }

  if (next.newUsed) params.set('newUsed', next.newUsed)
  if (next.page) params.set('page', next.page)

  const query = params.toString()
  return query ? `?${query}` : ''
}

function formatPrice(price?: number | null): string {
  if (typeof price !== 'number') return '—'
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(price)
}

function formatMileage(mileage?: number | null): string {
  if (typeof mileage !== 'number') return '—'
  return `${new Intl.NumberFormat('en-ZA').format(mileage)} km`
}

function getThumbUrl(media: { kind: string; url: string }[]): string | null {
  const thumb = media.find((item) => item.kind === 'thumb') ?? media[0]
  return thumb?.url ?? null
}

export async function LiveStockContent({ searchParams }: { searchParams?: SearchParams }) {
  const page = Number(getParam(searchParams, 'page') ?? '1')
  const newUsedParam = getParam(searchParams, 'newUsed')

  const fetchOptions: FetchStockOptions = {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: 25,
  }

  if (newUsedParam === 'NEW' || newUsedParam === 'USED') {
    fetchOptions.newUsed = newUsedParam
  }

  let errorMessage: string | null = null
  let stock = null

  try {
    stock = await fetchStock(fetchOptions)
  } catch (error) {
    errorMessage =
      error instanceof MotorCityStockError
        ? error.message
        : 'Failed to load stock from Eagle Motor City.'
  }

  return (
    <Gutter className={baseClass}>
      <div className={`${baseClass}__header`}>
        <div>
          <h1 className={`${baseClass}__title`}>Live Stock</h1>
          <p className={`${baseClass}__description`}>
            Vehicles synced from Eagle Motor City. Data is read-only and not stored in the Eagle
            Ford database.
          </p>
        </div>
      </div>

      {errorMessage ? (
        <Banner type="error">{errorMessage}</Banner>
      ) : (
        <>
          <div className={`${baseClass}__filters`}>
            <Link
              className={`${baseClass}__filter${!newUsedParam ? ` ${baseClass}__filter--active` : ''}`}
              href={adminStockPath()}
            >
              All
            </Link>
            <Link
              className={`${baseClass}__filter${newUsedParam === 'NEW' ? ` ${baseClass}__filter--active` : ''}`}
              href={adminStockPath(buildQuery(searchParams, { newUsed: 'NEW', page: null }))}
            >
              New
            </Link>
            <Link
              className={`${baseClass}__filter${newUsedParam === 'USED' ? ` ${baseClass}__filter--active` : ''}`}
              href={adminStockPath(buildQuery(searchParams, { newUsed: 'USED', page: null }))}
            >
              Used
            </Link>
          </div>

          <div className={`${baseClass}__meta`}>
            <span>
              {stock?.totalDocs ?? 0} vehicle{(stock?.totalDocs ?? 0) === 1 ? '' : 's'}
            </span>
            {stock?.dealerCode && <span>Dealer: {stock.dealerCode}</span>}
            {stock?.brandKey && <span>Brand key: {stock.brandKey}</span>}
          </div>

          {stock?.docs.length ? (
            <div className={`${baseClass}__table-wrap`}>
              <table className={`${baseClass}__table`}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Vehicle</th>
                    <th>Type</th>
                    <th>Year</th>
                    <th>Price</th>
                    <th>Mileage</th>
                    <th>Stock No.</th>
                  </tr>
                </thead>
                <tbody>
                  {stock.docs.map((vehicle) => {
                    const thumbUrl = getThumbUrl(vehicle.media)

                    return (
                      <tr key={vehicle.id}>
                        <td>
                          {thumbUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              alt={vehicle.title ?? vehicle.model ?? 'Vehicle'}
                              className={`${baseClass}__thumb`}
                              src={thumbUrl}
                            />
                          ) : (
                            <span className={`${baseClass}__no-image`}>—</span>
                          )}
                        </td>
                        <td>
                          <div className={`${baseClass}__vehicle-title`}>
                            {vehicle.title ??
                              `${vehicle.brand ?? ''} ${vehicle.model ?? ''}`.trim()}
                          </div>
                          <div className={`${baseClass}__vehicle-meta`}>
                            {[vehicle.brand, vehicle.model, vehicle.colour]
                              .filter(Boolean)
                              .join(' · ')}
                          </div>
                        </td>
                        <td>{vehicle.newUsed ?? '—'}</td>
                        <td>{vehicle.year ?? '—'}</td>
                        <td>{formatPrice(vehicle.specialPrice ?? vehicle.price)}</td>
                        <td>{formatMileage(vehicle.mileage)}</td>
                        <td>{vehicle.stockNoDisplay ?? vehicle.stockNo ?? '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Banner type="info">No vehicles found for the current filters.</Banner>
          )}

          {stock && (stock.hasPrevPage || stock.hasNextPage) && (
            <div className={`${baseClass}__pagination`}>
              {stock.hasPrevPage ? (
                <Link
                  className={`${baseClass}__page-link`}
                  href={adminStockPath(
                    buildQuery(searchParams, {
                      page: String(Math.max(1, (stock.page ?? 1) - 1)),
                    }),
                  )}
                >
                  Previous
                </Link>
              ) : (
                <span className={`${baseClass}__page-link ${baseClass}__page-link--disabled`}>
                  Previous
                </span>
              )}
              <span className={`${baseClass}__page-status`}>
                Page {stock.page ?? 1} of {stock.totalPages ?? 1}
              </span>
              {stock.hasNextPage ? (
                <Link
                  className={`${baseClass}__page-link`}
                  href={adminStockPath(
                    buildQuery(searchParams, {
                      page: String((stock.page ?? 1) + 1),
                    }),
                  )}
                >
                  Next
                </Link>
              ) : (
                <span className={`${baseClass}__page-link ${baseClass}__page-link--disabled`}>
                  Next
                </span>
              )}
            </div>
          )}
        </>
      )}
    </Gutter>
  )
}
