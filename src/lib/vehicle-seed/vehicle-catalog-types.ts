export type ColourDef = {
  colourName: string
  colourNote?: string
  colourImageUrl?: string
  colourImageAlt?: string
}

export type FeatureDef = {
  featureTitle: string
  featureDescription: string
  featureImageUrl?: string
  featureImageAlt?: string
}

export type GalleryDef = { imageUrl: string; imageAlt: string }
export type FaqDef = { question: string; answer: string }
export type SpecHighlightDef = { value: string; label: string }
export type EngineOptionDef = { name: string; engineType: string }

export type VariantDef = {
  name: string
  slug: string
  price: number
  highlights: string[]
  featureImageUrl?: string
  featureImageAlt?: string
}

export type ModelDef = {
  name: string
  slug: string
  badge?: 'newly-launched' | 'coming-soon' | 'limited'
  tagline?: string
  description?: string
  features?: FeatureDef[]
  colours?: ColourDef[]
  heroImageUrl?: string
  heroImageAlt?: string
  featureImageUrl?: string
  featureImageAlt?: string
  gallery?: GalleryDef[]
  faqs?: FaqDef[]
  specHighlights?: SpecHighlightDef[]
  engineOptions?: EngineOptionDef[]
  brochureUrl?: string
  brochureAlt?: string
  showInMegaMenu?: boolean
  sortOrder?: number
  variants: VariantDef[]
}

export type VehicleDef = {
  name: string
  slug: string
  badge?: 'newly-launched' | 'coming-soon' | 'limited'
  categorySlug: string
  startingPrice: number
  description: string
  features: FeatureDef[]
  colours: ColourDef[]
  heroImageUrl: string
  heroImageAlt: string
  featureImageUrl: string
  featureImageAlt: string
  gallery: GalleryDef[]
  brochureUrl?: string
  brochureAlt?: string
  pageUrl?: string
  faqs: FaqDef[]
  specHighlights?: SpecHighlightDef[]
  engineOptions?: EngineOptionDef[]
  models: ModelDef[]
}

export type CategoryDef = {
  title: string
  slug: string
  sortOrder: number
}
