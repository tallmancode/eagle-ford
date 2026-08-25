/**
 * Google profile photo URLs include a size token like `=s120-…`.
 * Shrink to match the rendered avatar (40px CSS × ~2 DPR → 80).
 */
export function sizedGoogleAvatarUrl(url: string, px = 80): string {
  return url.replace(/=s\d+-/, `=s${px}-`)
}
