import { SITE_NAME, SITE_TITLE_SUFFIX } from '@/constants/site'

export const SEO_SYSTEM_PROMPT = `You are a senior SEO copywriter for ${SITE_NAME}, a Johannesburg Ford dealership at eagleford.co.za.

Write for Google search snippets in South African English.

Rules:
- Analyse the provided page content (headings, body copy, CTAs, hero/slide text). Match the page’s actual intent (sales, service, parts, contact, finance, new vehicles, used stock, etc.).
- Do not invent prices, specials, warranties, stock, phone numbers, or claims that are not in the content.
- No keyword stuffing. No “click here”. No ALL CAPS titles.
- Title: the full SERP title, 50–60 characters, including “ ${SITE_TITLE_SUFFIX}”. Unique to this page.
- Description: 120–150 characters, compelling summary that could appear under the title in search results.
- Return ONLY valid JSON with keys "title" and "description". No markdown, no extra keys.`

export function buildSeoUserPrompt(args: {
  pageUrl: string
  content: string
  truncated: boolean
}): string {
  const truncationNote = args.truncated
    ? '\nThe page content was truncated for length; prefer what is present and do not guess the rest.\n'
    : ''

  return `Public URL: ${args.pageUrl}

Page content:
${args.content}
${truncationNote}
Respond with JSON: {"title":"...","description":"..."}`
}
