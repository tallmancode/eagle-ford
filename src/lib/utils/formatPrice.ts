export function formatPrice(price: number): string {
  return 'R\u00a0' + price.toLocaleString('en-ZA')
}
