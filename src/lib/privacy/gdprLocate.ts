const gdprCountryCodes = new Set([
  // -----[ EU 28 ]-----
  'AT', // Austria
  'BE', // Belgium
  'BG', // Bulgaria
  'HR', // Croatia
  'CY', // Cyprus
  'CZ', // Czech Republic
  'DK', // Denmark
  'EE', // Estonia
  'FI', // Finland
  'FR', // France
  'DE', // Germany
  'GR', // Greece
  'HU', // Hungary
  'IE', // Ireland, Republic of (EIRE)
  'IT', // Italy
  'LV', // Latvia
  'LT', // Lithuania
  'LU', // Luxembourg
  'MT', // Malta
  'NL', // Netherlands
  'PL', // Poland
  'PT', // Portugal
  'RO', // Romania
  'SK', // Slovakia
  'SI', // Slovenia
  'ES', // Spain
  'SE', // Sweden
  'GB', // United Kingdom (Great Britain)

  // -----[ Outermost Regions (OMR) ]------
  'GF', // French Guiana
  'GP', // Guadeloupe
  'MQ', // Martinique
  'ME', // Montenegro
  'YT', // Mayotte
  'RE', // Réunion
  'MF', // Saint Martin

  // -----[ Special Cases: Part of EU ]-----
  'GI', // Gibraltar
  'AX', // Åland Islands

  // -----[ Overseas Countries and Territories (OCT) ]-----
  'PM', // Saint Pierre and Miquelon
  'GL', // Greenland
  'BL', // Saint Bartelemey
  'SX', // Sint Maarten
  'AW', // Aruba
  'CW', // Curacao
  'WF', // Wallis and Futuna
  'PF', // French Polynesia
  'NC', // New Caledonia
  'TF', // French Southern Territories
  'AI', // Anguilla
  'BM', // Bermuda
  'IO', // British Indian Ocean Territory
  'VG', // Virgin Islands, British
  'KY', // Cayman Islands
  'FK', // Falkland Islands (Malvinas)
  'MS', // Montserrat
  'PN', // Pitcairn
  'SH', // Saint Helena
  'GS', // South Georgia and the South Sandwich Islands
  'TC', // Turks and Caicos Islands

  // -----[ Microstates ]-----
  'AD', // Andorra
  'LI', // Liechtenstein
  'MC', // Monaco
  'SM', // San Marino
  'VA', // Vatican City

  // -----[ Other ]-----
  'JE', // Jersey
  'GG', // Guernsey
])

const VISITOR_COUNTRY_HEADERS = [
  'cf-ipcountry',
  'x-country-code',
  'x-vercel-ip-country',
] as const

/**
 * Normalize a visitor country header value.
 * Returns null for missing / placeholder codes (e.g. Cloudflare "XX").
 */
export function normalizeVisitorCountryCode(
  value: string | null | undefined,
): string | null {
  if (!value) return null

  const normalized = value.trim().toUpperCase()
  if (!normalized || normalized === 'XX' || normalized === 'T1') return null

  return normalized
}

/**
 * Read visitor country from common reverse-proxy headers.
 * Never infer from server region — this app is hosted in the EU while most
 * visitors are in South Africa.
 */
export function getVisitorCountryFromHeaders(headers: Headers): string | null {
  for (const headerName of VISITOR_COUNTRY_HEADERS) {
    const country = normalizeVisitorCountryCode(headers.get(headerName))
    if (country) return country
  }

  return null
}

/**
 * Whether GDPR-style cookie consent is required for a visitor country.
 * Unknown country defaults to false (ZA-majority audience on a VPS without geo).
 */
export function isGdprCountry(countryCode: string | null = null): boolean {
  if (!countryCode) return false

  return gdprCountryCodes.has(countryCode)
}

export function resolveVisitorGdprStatus(headers: Headers): {
  country: string | null
  isGDPR: boolean
} {
  const country = getVisitorCountryFromHeaders(headers)

  return {
    country,
    isGDPR: isGdprCountry(country),
  }
}
