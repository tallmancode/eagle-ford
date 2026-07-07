/**
 * Formats a local 10-digit phone number for display (3-3-4 grouping).
 * @param phone - Raw or partially formatted phone number.
 * @returns Formatted phone number, or the original value if not 10 digits.
 * @example
 *
 * formatPhoneNumber('0104400510') // '010 440 0510'
 * formatPhoneNumber('010 440 0510') // '010 440 0510'
 */
export const formatPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '')
  if (digits.length !== 10) return phone
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}
