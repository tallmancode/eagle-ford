import { heroOptions } from '@/lib/blocks/hero-block/heroOptions'

export type HeroTemplatePreview = {
  src: string
  alt: string
}

export const heroTemplatePreviews: Record<string, HeroTemplatePreview> = Object.fromEntries(
  heroOptions.map(({ value, label }) => [
    value,
    {
      src: `/blocks/hero-templates/${value}.png`,
      alt: `${label} preview`,
    },
  ]),
)

export const getHeroTemplatePreview = (template?: string | null): HeroTemplatePreview | null => {
  if (!template) return null
  return heroTemplatePreviews[template] ?? null
}
