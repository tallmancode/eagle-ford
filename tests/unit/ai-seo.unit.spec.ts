import { describe, expect, it } from 'vitest'

import { extractPageContent } from '@/lib/ai-seo/extractPageContent'
import { parseSeoJson } from '@/lib/ai-seo/parseSeoJson'
import { estimateCostUsd, resolveModelRates } from '@/lib/ai-seo/pricing'
import { parseBudgetUsd, resolveMonthlyBudgetUsd } from '@/lib/ai-seo/config'
import { fallbackSeoDescription, fallbackSeoTitle } from '@/lib/ai-seo/fallbacks'

const lexical = (text: string) => ({
  root: {
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text }],
      },
    ],
  },
})

describe('extractPageContent', () => {
  it('flattens nested section/content blocks and Lexical copy', () => {
    const extracted = extractPageContent({
      title: 'Book a Service',
      slug: 'service',
      section: [
        {
          blockType: 'section',
          gridCols: '2',
          backgroundColor: '#0a0a0a',
          content: [
            {
              blockType: 'heading',
              heading: 'Workshop hours',
            },
            {
              blockType: 'rich-text',
              content: lexical('OEM-trained technicians in Bramley.'),
            },
          ],
        },
      ],
    })

    expect(extracted.truncated).toBe(false)
    expect(extracted.text).toContain('Page title: Book a Service')
    expect(extracted.text).toContain('Slug: service')
    expect(extracted.text).toContain('[section]')
    expect(extracted.text).toContain('[heading]')
    expect(extracted.text).toContain('Workshop hours')
    expect(extracted.text).toContain('[rich-text]')
    expect(extracted.text).toContain('OEM-trained technicians in Bramley.')
    expect(extracted.text).not.toContain('#0a0a0a')
    expect(extracted.text).not.toContain('gridCols')
  })

  it('skips layout keys, urls, and mongo-like ids', () => {
    const extracted = extractPageContent({
      title: 'Contact',
      slug: 'contact',
      section: [
        {
          blockType: 'section',
          id: '64b0c0c0c0c0c0c0c0c0c0c0',
          content: [
            {
              blockType: 'cta-cards',
              url: 'https://example.com/ignored',
              items: [{ label: 'Call sales', id: 'abc' }],
            },
          ],
        },
      ],
    })

    expect(extracted.text).toContain('Call sales')
    expect(extracted.text).not.toContain('64b0c0c0c0c0c0c0c0c0c0c0')
    expect(extracted.text).not.toContain('https://example.com/ignored')
  })

  it('truncates to the max character budget', () => {
    const extracted = extractPageContent(
      {
        title: 'Long page',
        slug: 'long',
        section: [
          {
            blockType: 'section',
            content: [{ blockType: 'rich-text', content: lexical('A'.repeat(500)) }],
          },
        ],
      },
      80,
    )

    expect(extracted.truncated).toBe(true)
    expect(extracted.text).toContain('[Content truncated for length]')
    expect(extracted.text.length).toBeLessThan(500)
  })
})

describe('parseSeoJson', () => {
  it('parses a plain JSON object', () => {
    expect(parseSeoJson('{"title":"Hello | Eagle Motor City","description":"A description that is long enough."}')).toEqual(
      {
        title: 'Hello | Eagle Motor City',
        description: 'A description that is long enough.',
      },
    )
  })

  it('parses fenced JSON and rejects missing fields', () => {
    expect(
      parseSeoJson('```json\n{"title":"T","description":"D"}\n```'),
    ).toEqual({ title: 'T', description: 'D' })
    expect(parseSeoJson('{"title":"only"}')).toBeNull()
    expect(parseSeoJson('not json')).toBeNull()
  })
})

describe('pricing and budget', () => {
  it('estimates cost from model rates', () => {
    expect(resolveModelRates('claude-sonnet-4-5').inputPerMTok).toBe(3)
    expect(estimateCostUsd({ model: 'claude-sonnet-4-5', inputTokens: 1_000_000, outputTokens: 0 })).toBe(3)
    expect(estimateCostUsd({ model: 'claude-haiku-4-5', inputTokens: 0, outputTokens: 1_000_000 })).toBe(5)
  })

  it('resolves monthly budget from env then CMS then default', () => {
    expect(parseBudgetUsd('12.5')).toBe(12.5)
    expect(parseBudgetUsd(-1)).toBeNull()
    const previous = process.env.AI_SEO_MONTHLY_BUDGET_USD
    delete process.env.AI_SEO_MONTHLY_BUDGET_USD
    expect(resolveMonthlyBudgetUsd(40)).toBe(40)
    expect(resolveMonthlyBudgetUsd(undefined)).toBe(25)
    process.env.AI_SEO_MONTHLY_BUDGET_USD = '10'
    expect(resolveMonthlyBudgetUsd(40)).toBe(10)
    if (previous == null) delete process.env.AI_SEO_MONTHLY_BUDGET_USD
    else process.env.AI_SEO_MONTHLY_BUDGET_USD = previous
  })
})

describe('SEO fallbacks', () => {
  it('uses the page title and default or extracted description', () => {
    expect(fallbackSeoTitle({ title: ' Service ' })).toBe('Service')
    expect(fallbackSeoTitle({})).toBe('')
    expect(fallbackSeoDescription({ excerpt: 'Short excerpt' })).toBe('Short excerpt')
    expect(fallbackSeoDescription({})).toContain('trusted Ford dealer')
  })
})
