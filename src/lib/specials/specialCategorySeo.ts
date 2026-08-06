/** Fallback meta descriptions for special category pages (no CMS meta fields today). */

const LOCATION = 'at Eagle Ford in Sandton, Johannesburg'

const SPECIAL_CATEGORY_SEO_FALLBACKS: { slug: string; description: string }[] = [
  {
    slug: 'ranger-double-cab-specials',
    description: `Current Ford Ranger Double Cab specials and finance deals ${LOCATION}. Compare savings and enquire online.`,
  },
  {
    slug: 'ranger-super-cab-specials',
    description: `Ford Ranger Super Cab offers ${LOCATION}. View payment-from deals and book a consultation.`,
  },
  {
    slug: 'ranger-single-cab-specials',
    description: `Ford Ranger Single Cab specials ${LOCATION}. Work-ready bakkie deals with local dealer support.`,
  },
  {
    slug: 'territory-specials',
    description: `Ford Territory SUV specials ${LOCATION}. Limited offers on Ambiente, Trend and Titanium.`,
  },
  {
    slug: 'everest-specials',
    description: `Ford Everest specials ${LOCATION}. Savings on Active, Sport, Wildtrak and Platinum trims.`,
  },
  {
    slug: 'ranger-raptor-specials',
    description: `Ford Ranger Raptor specials ${LOCATION}. High-performance bakkie deals — enquire at Eagle Ford.`,
  },
  {
    slug: 'mustang-specials',
    description: `Ford Mustang GT and Dark Horse offers ${LOCATION}. Current performance car specials.`,
  },
  {
    slug: 'transit-custom-specials',
    description: `Ford Transit Custom commercial specials ${LOCATION}. Van deals for business buyers.`,
  },
  {
    slug: 'tourneo-custom-specials',
    description: `Ford Tourneo Custom specials ${LOCATION}. People-mover offers with finance options.`,
  },
]

export function getSpecialCategorySeoDescription(slug: string): string | undefined {
  return SPECIAL_CATEGORY_SEO_FALLBACKS.find((entry) => entry.slug === slug)?.description
}
