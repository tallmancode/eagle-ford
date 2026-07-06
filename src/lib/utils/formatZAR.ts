export function formatZAR(amount: number): string {
  return `R${amount.toLocaleString('en-ZA').replace(/,/g, ' ')}`
}
