import type {
  Section,
  SectionInner,
  Config,
  Heading,
  Hero,
  RichText,
  FeatureList,
  FormBlockType,
  ContactInfo,
  IconText,
  CtaButton,
  WhyCards,
  Map,
  TeamGrid,
  ImageBlock,
  CtaCards,
  ImageCards,
  StatsBlock,
  HoursTabs,
  Faq,
  ContactFooter,
  FeatureGrid,
  Benefits,
  PopupCards,
  FinanceCalculatorBlockType,
  BackButton,
  BenefitsGrid,
  SpecialsArchive,
  StockArchive,
  Partners,
  Row,
  VehicleTabsBlock,
  VehicleCatalogBlock,
  VehicleHeroBlock,
  VehicleModelsBlock,
  VehicleFaqBlock,
  VehicleColorsBlock,
  VehicleGalleryBlock,
  VehicleFeaturesBlock,
  VehicleModelHeroBlock,
  VehicleModelHighlightsBlock,
  VehicleModelColorsBlock,
  VehicleModelSiblingsBlock,
} from '@/payload-types'
import { SectionBlock } from '@/lib/blocks/section-block/components/SectionBlockComponent'
import React, { Fragment } from 'react'
import { HeadingBlockComponent } from '@/lib/blocks/heading-block/components/HeadingBlockComponent'
import { HeroBlock } from '@/lib/blocks/hero-block/components/HeroBlockComponent'
import { RichTextBlockComponent } from '@/lib/blocks/rich-text-block/components/RichTextBlockComponent'
import { FeatureListBlockComponent } from '@/lib/blocks/feature-list-block/components/FeatureListBlockComponent'
import { FormBlockComponent } from '@/lib/blocks/form-block/components/FormBlockComponent'
import { ContactInfoBlockComponent } from '@/lib/blocks/contact-info-block/components/ContactInfoBlockComponent'
import { IconTextBlockComponent } from '@/lib/blocks/icon-text-block/components/IconTextBlockComponent'
import { CtaButtonBlockComponent } from '@/lib/blocks/cta-button-block/components/CtaButtonBlockComponent'
import { WhyCardsBlockComponent } from '@/lib/blocks/why-cards-block/components/WhyCardsBlockComponent'
import { MapBlockComponent } from '@/lib/blocks/map-block/components/MapBlockComponent'
import { TeamGridBlockComponent } from '@/lib/blocks/team-grid-block/components/TeamGridBlockComponent'
import { StatsBlockComponent } from '@/lib/blocks/stats-block/components/StatsBlockComponent'
import { CtaCardsBlockComponent } from '@/lib/blocks/cta-cards-block/components/CtaCardsBlockComponent'
import { ImageCardsBlockComponent } from '@/lib/blocks/image-cards-block/components/ImageCardsBlockComponent'
import { ImageBlockComponent } from '@/lib/blocks/image-block/components/ImageBlockComponent'
import { HoursTabsBlockComponent } from '@/lib/blocks/hours-tabs-block/components/HoursTabsBlockComponent'
import { FaqBlockComponent } from '@/lib/blocks/faq-block/components/FaqBlockComponent'
import { ContactFooterBlockComponent } from '@/lib/blocks/contact-footer-block/components/ContactFooterBlockComponent'
import { FeatureGridBlockComponent } from '@/lib/blocks/feature-grid-block/components/FeatureGridBlockComponent'
import { BenefitsBlockComponent } from '@/lib/blocks/benefits-block/components/BenefitsBlockComponent'
import { PopupCardsBlockComponent } from '@/lib/blocks/popup-cards-block/components/PopupCardsBlockComponent'
import { FinanceCalculatorBlockComponent } from '@/lib/blocks/finance-calculator-block/components/FinanceCalculatorBlockComponent'
import { BackButtonBlockComponent } from '@/lib/blocks/back-button-block/components/BackButtonBlockComponent'
import { BenefitsGridBlockComponent } from '@/lib/blocks/benefits-grid-block/components/BenefitsGridBlockComponent'
import { SpecialsArchiveBlockComponent } from '@/lib/blocks/specials-archive-block/components/SpecialsArchiveBlockComponent'
import { StockArchiveBlockComponent } from '@/lib/blocks/stock-archive-block/components/StockArchiveBlockComponent'
import { PartnersBlockComponent } from '@/lib/blocks/partners-block/components/PartnersBlockComponent'
import { RowBlockComponent } from '@/lib/blocks/row-block/components/RowBlockComponent'
import { VehicleTabsBlockComponent } from '@/lib/blocks/vehicle-tabs-block/components/VehicleTabsBlockComponent'
import { VehicleCatalogBlockComponent } from '@/lib/blocks/vehicle-catalog-block/components/VehicleCatalogBlockComponent'
import { VehicleHeroBlockComponent } from '@/lib/blocks/vehicle-hero-block/components/VehicleHeroBlockComponent'
import { VehicleModelsBlockComponent } from '@/lib/blocks/vehicle-models-block/components/VehicleModelsBlockComponent'
import { VehicleFaqBlockComponent } from '@/lib/blocks/vehicle-faq-block/components/VehicleFaqBlockComponent'
import { VehicleColorsBlockComponent } from '@/lib/blocks/vehicle-colors-block/components/VehicleColorsBlockComponent'
import { VehicleGalleryBlockComponent } from '@/lib/blocks/vehicle-gallery-block/components/VehicleGalleryBlockComponent'
import { VehicleFeaturesBlockComponent } from '@/lib/blocks/vehicle-features-block/components/VehicleFeaturesBlockComponent'
import { VehicleModelHeroBlockComponent } from '@/lib/blocks/vehicle-model-hero-block/components/VehicleModelHeroBlockComponent'
import { VehicleModelHighlightsBlockComponent } from '@/lib/blocks/vehicle-model-highlights-block/components/VehicleModelHighlightsBlockComponent'
import { VehicleModelColorsBlockComponent } from '@/lib/blocks/vehicle-model-colors-block/components/VehicleModelColorsBlockComponent'
import { VehicleModelSiblingsBlockComponent } from '@/lib/blocks/vehicle-model-siblings-block/components/VehicleModelSiblingsBlockComponent'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'

type BlockComponentMap = {
  section: Section
  sectionInner: SectionInner
  row: Row
  heading: Heading
  hero: Hero
  'rich-text': RichText
  'feature-list': FeatureList
  formBlock: FormBlockType
  'contact-info': ContactInfo
  'icon-text': IconText
  'cta-button': CtaButton
  'back-button': BackButton
  'why-cards': WhyCards
  map: Map
  'team-grid': TeamGrid
  'image-block': ImageBlock
  'cta-cards': CtaCards
  'image-cards': ImageCards
  statsBlock: StatsBlock
  'hours-tabs': HoursTabs
  faq: Faq
  'contact-footer': ContactFooter
  'feature-grid': FeatureGrid
  benefits: Benefits
  'benefits-grid': BenefitsGrid
  'popup-cards': PopupCards
  financeCalculatorBlock: FinanceCalculatorBlockType
  'specials-archive': SpecialsArchive
  'stock-archive': StockArchive
  partners: Partners
  'vehicle-tabs': VehicleTabsBlock
  'vehicle-catalog': VehicleCatalogBlock
  'vehicle-hero': VehicleHeroBlock
  'vehicle-models': VehicleModelsBlock
  'vehicle-faq': VehicleFaqBlock
  'vehicle-colors': VehicleColorsBlock
  'vehicle-gallery': VehicleGalleryBlock
  'vehicle-features': VehicleFeaturesBlock
  'vehicle-model-hero': VehicleModelHeroBlock
  'vehicle-model-highlights': VehicleModelHighlightsBlock
  'vehicle-model-colors': VehicleModelColorsBlock
  'vehicle-model-siblings': VehicleModelSiblingsBlock
}

type WithMeta<T> = T & { meta?: BlockRenderMeta }

const blockComponents: {
  [K in keyof BlockComponentMap]: React.ComponentType<WithMeta<BlockComponentMap[K]>>
} = {
  section: SectionBlock,
  sectionInner: SectionBlock as unknown as React.ComponentType<WithMeta<SectionInner>>,
  row: RowBlockComponent,
  heading: HeadingBlockComponent,
  hero: HeroBlock,
  'rich-text': RichTextBlockComponent,
  'feature-list': FeatureListBlockComponent,
  formBlock: FormBlockComponent as unknown as React.ComponentType<WithMeta<FormBlockType>>,
  'contact-info': ContactInfoBlockComponent as unknown as React.ComponentType<
    WithMeta<ContactInfo>
  >,
  'icon-text': IconTextBlockComponent as unknown as React.ComponentType<WithMeta<IconText>>,
  'cta-button': CtaButtonBlockComponent,
  'back-button': BackButtonBlockComponent,
  'why-cards': WhyCardsBlockComponent,
  map: MapBlockComponent as unknown as React.ComponentType<WithMeta<Map>>,
  'team-grid': TeamGridBlockComponent,
  'image-block': ImageBlockComponent,
  'cta-cards': CtaCardsBlockComponent,
  'image-cards': ImageCardsBlockComponent,
  statsBlock: StatsBlockComponent,
  'hours-tabs': HoursTabsBlockComponent,
  faq: FaqBlockComponent,
  'contact-footer': ContactFooterBlockComponent as unknown as React.ComponentType<
    WithMeta<ContactFooter>
  >,
  'feature-grid': FeatureGridBlockComponent,
  benefits: BenefitsBlockComponent,
  'benefits-grid': BenefitsGridBlockComponent,
  'popup-cards': PopupCardsBlockComponent,
  financeCalculatorBlock: FinanceCalculatorBlockComponent,
  'specials-archive': SpecialsArchiveBlockComponent,
  'stock-archive': StockArchiveBlockComponent,
  partners: PartnersBlockComponent,
  'vehicle-tabs': VehicleTabsBlockComponent,
  'vehicle-catalog': VehicleCatalogBlockComponent,
  'vehicle-hero': VehicleHeroBlockComponent,
  'vehicle-models': VehicleModelsBlockComponent,
  'vehicle-faq': VehicleFaqBlockComponent,
  'vehicle-colors': VehicleColorsBlockComponent,
  'vehicle-gallery': VehicleGalleryBlockComponent,
  'vehicle-features': VehicleFeaturesBlockComponent,
  'vehicle-model-hero': VehicleModelHeroBlockComponent,
  'vehicle-model-highlights': VehicleModelHighlightsBlockComponent,
  'vehicle-model-colors': VehicleModelColorsBlockComponent,
  'vehicle-model-siblings': VehicleModelSiblingsBlockComponent,
} as const

type Blocks = Config['blocks']

type BlockTypes = Blocks[keyof Blocks]
type BlockComponentKey = keyof typeof blockComponents

export function renderBlock(
  block: BlockTypes,
  index: number,
  meta?: BlockRenderMeta,
): React.ReactNode {
  const { blockType } = block
  if (blockType && blockType in blockComponents) {
    const Block = blockComponents[block.blockType as BlockComponentKey] as React.ComponentType<
      WithMeta<typeof block>
    >

    if (Block) {
      const key = 'id' in block && block.id ? block.id : `${blockType}-${index}`
      return <Block {...block} meta={meta} key={key} />
    }
  }
  return null
}

export const RenderBlocks: React.FC<{
  blocks: BlockTypes[] | null | undefined
  meta?: BlockRenderMeta
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>{blocks.map((block, index) => renderBlock(block, index, props.meta))}</Fragment>
    )
  }

  return null
}
