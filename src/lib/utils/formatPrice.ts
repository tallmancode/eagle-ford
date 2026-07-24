export function formatPrice(price: number | null | undefined): string {
  if (typeof price !== 'number' || Number.isNaN(price)) {
    return 'Price on request'
  }

  return 'R\u00a0' + price.toLocaleString('en-ZA')
}
