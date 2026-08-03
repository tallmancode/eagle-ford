import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  PRICE_CURRENCY,
  buildJsonLdGraph,
  getCmsPageJsonLd,
  getDealershipJsonLd,
  getFaqPageJsonLd,
  getSpecialOfferJsonLd,
  getStockVehicleJsonLd,
  getVariantPriceStats,
  getVehicleJsonLd,
  getWebSiteJsonLd,
} from '@/lib/seo/dealershipJsonLd'

describe('dealershipJsonLd builders', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SERVER_URL = 'https://www.eagleford.co.za'
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('builds AutoDealer from Settings contact when provided', () => {
    const jsonLd = getDealershipJsonLd({
      phone: '010 440 0510',
      email: 'sales@eagleford.co.za',
      operationHours: 'Mon – Fri: 08:00 – 17:00 | Sat: 08:00 – 12:30',
      address: {
        street: '229 Corlett Dr',
        suburb: 'Bramley',
        city: 'Johannesburg',
        province: 'Gauteng',
        postCode: '2090',
        mapsLink: 'https://maps.app.goo.gl/example',
      },
    })

    expect(jsonLd['@type']).toBe('AutoDealer')
    expect(jsonLd.telephone).toBe('010 440 0510')
    expect(jsonLd.openingHours).toBe('Mon – Fri: 08:00 – 17:00 | Sat: 08:00 – 12:30')
    expect(jsonLd.brand).toMatchObject({ '@type': 'Brand', name: 'Ford' })
    expect(jsonLd.address).toMatchObject({
      '@type': 'PostalAddress',
      streetAddress: '229 Corlett Dr, Bramley',
      addressLocality: 'Johannesburg',
      postalCode: '2090',
    })
    expect(jsonLd.sameAs).toEqual(['https://maps.app.goo.gl/example'])
  })

  it('emits WebSite with absolute site URL', () => {
    const jsonLd = getWebSiteJsonLd()
    expect(jsonLd['@type']).toBe('WebSite')
    expect(jsonLd.url).toBe('https://www.eagleford.co.za')
  })

  it('omits offers when vehicle has no price', () => {
    const jsonLd = getVehicleJsonLd({
      name: 'Ranger',
      path: '/vehicles/ranger',
    })

    expect(jsonLd['@type']).toBe('Vehicle')
    expect(jsonLd.offers).toBeUndefined()
  })

  it('emits AggregateOffer for range prices', () => {
    const jsonLd = getVehicleJsonLd({
      name: 'Ranger',
      path: '/vehicles/ranger',
      lowPrice: 549900,
      highPrice: 999900,
      offerCount: 5,
    })

    expect(jsonLd.offers).toMatchObject({
      '@type': 'AggregateOffer',
      lowPrice: 549900,
      highPrice: 999900,
      offerCount: 5,
      priceCurrency: PRICE_CURRENCY,
    })
  })

  it('emits Offer for a single variant price', () => {
    const jsonLd = getVehicleJsonLd({
      name: 'Ranger 2.0 SiT',
      path: '/vehicles/ranger/20-sit',
      price: 549900,
    })

    expect(jsonLd.offers).toMatchObject({
      '@type': 'Offer',
      price: 549900,
      priceCurrency: PRICE_CURRENCY,
      availability: 'https://schema.org/InStock',
    })
  })

  it('computes variant price stats', () => {
    expect(getVariantPriceStats([{ price: 100 }, { price: 50 }, { price: null }])).toEqual({
      lowPrice: 50,
      highPrice: 100,
      offerCount: 2,
    })
    expect(getVariantPriceStats([{ price: null }])).toBeNull()
  })

  it('builds FAQPage only when Q&A pairs exist', () => {
    expect(getFaqPageJsonLd([{ question: 'Q?', answer: '' }])).toBeNull()
    expect(
      getFaqPageJsonLd([
        { question: 'What is the starting price?', answer: 'From R 549 900.' },
      ]),
    ).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the starting price?',
          acceptedAnswer: { '@type': 'Answer', text: 'From R 549 900.' },
        },
      ],
    })
  })

  it('maps contact and service CMS pages', () => {
    const contact = getCmsPageJsonLd({
      slug: 'contact-us',
      name: 'Contact Us',
      path: '/contact-us',
    })
    expect(contact['@type']).toEqual(['WebPage', 'ContactPage'])

    const service = getCmsPageJsonLd({
      slug: 'service',
      name: 'Service',
      path: '/service',
      description: 'Book a service',
    })
    expect(service['@graph']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ '@type': 'WebPage', name: 'Service' }),
        expect.objectContaining({ '@type': 'Service', serviceType: 'Vehicle servicing' }),
      ]),
    )

    const parts = getCmsPageJsonLd({
      slug: 'parts-accessories',
      name: 'Parts & Accessories',
      path: '/parts-accessories',
    })
    expect(parts['@graph']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ '@type': 'Service', serviceType: 'Genuine parts' }),
      ]),
    )
  })

  it('maps collection CMS pages for vehicles archive', () => {
    const vehicles = getCmsPageJsonLd({
      slug: 'vehicles',
      name: 'Vehicles',
      path: '/vehicles',
    })
    expect(vehicles['@type']).toEqual(['WebPage', 'CollectionPage'])
  })

  it('emits special Offer only when price is present', () => {
    const withPrice = getSpecialOfferJsonLd({
      name: 'Ranger Special',
      path: '/specials/passenger-specials?special=ranger',
      price: 549900,
    })
    expect(withPrice.mainEntity).toMatchObject({
      '@type': 'Offer',
      price: 549900,
      priceCurrency: PRICE_CURRENCY,
    })

    const withoutPrice = getSpecialOfferJsonLd({
      name: 'Service promo',
      path: '/specials/service-offers?special=oil',
    })
    expect(withoutPrice.mainEntity).toBeUndefined()
  })

  it('emits Car Offer for showroom stock with specialPrice preference', () => {
    const jsonLd = getStockVehicleJsonLd({
      name: '2024 Ford Ranger',
      path: '/showroom/ABC-123',
      price: 499900,
      brandName: 'Ford',
      mileage: 12000,
    })

    expect(jsonLd['@type']).toBe('Car')
    expect(jsonLd.offers).toMatchObject({
      '@type': 'Offer',
      price: 499900,
      priceCurrency: PRICE_CURRENCY,
    })
    expect(jsonLd.mileageFromOdometer).toMatchObject({
      '@type': 'QuantitativeValue',
      value: 12000,
      unitCode: 'KMT',
    })
  })

  it('builds a @graph document without nested @context', () => {
    const graph = buildJsonLdGraph(
      getWebSiteJsonLd(),
      getVehicleJsonLd({ name: 'Ranger', path: '/vehicles/ranger', price: 549900 }),
      null,
    )

    expect(graph['@context']).toBe('https://schema.org')
    expect(graph['@graph']).toHaveLength(2)
    expect((graph['@graph'] as Record<string, unknown>[])[0]['@context']).toBeUndefined()
  })
})
