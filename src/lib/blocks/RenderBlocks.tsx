import type {
  Section,
  SectionInner,
  SectionV2,
  WrapperV2,
  ColumnV2,
  HeadingV2,
  EyebrowV2,
  HeadingTextV2,
  SubheadingV2,
  RichTextV2,
  ButtonV2,
  CardV2,
  AccordionV2,
  ImageV2,
  SeparatorV2,
  FormV2,
  IconV2,
  VideoV2,
  QuoteV2,
  SpacerV2,
  HeroV2,
  MapV2,
  FaqV2,
  StockArchiveV2,
  CarouselV2,
  SpecialsArchiveV2,
  VehicleCatalogV2,
  GalleryV2,
  Config,
  Heading,
  Hero,
  RichText,
  FeatureList,
  FeatureRows,
  FormBlockType,
  ContactInfoBlock,
  IconText,
  CtaButton,
  WhyCards,
  Map,
  TeamGrid,
  ImageBlock,
  FixedBackgroundBlockType,
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
  Reviews,
  Row,
  VehicleTabsBlock,
  VehicleCatalogBlock,
  VehicleHeroBlock,
  VehicleModelsBlock,
  VehicleFaqBlock,
  VehicleColorsBlock,
  VehicleGalleryBlock,
  VehicleFeaturesBlock,
  VehicleSpecialCategoriesBlock,
  VehicleModelHeroBlock,
  VehicleModelHighlightsBlock,
  VehicleModelColorsBlock,
  VehicleModelSiblingsBlock,
  VehicleModelVariantsBlock,
} from '@/payload-types'
import { SectionBlock } from '@/lib/blocks/section-block/components/SectionBlockComponent'
import { SectionV2BlockComponent } from '@/lib/blocks/v2/section-block/components/SectionBlockComponent'
import { WrapperV2BlockComponent } from '@/lib/blocks/v2/wrapper-block/components/WrapperBlockComponent'
import { ColumnV2BlockComponent } from '@/lib/blocks/v2/column-block/components/ColumnBlockComponent'
import { HeadingV2BlockComponent } from '@/lib/blocks/v2/heading-block/components/HeadingBlockComponent'
import { EyebrowV2BlockComponent } from '@/lib/blocks/v2/eyebrow-block/components/EyebrowBlockComponent'
import { HeadingTextV2BlockComponent } from '@/lib/blocks/v2/heading-text-block/components/HeadingTextBlockComponent'
import { SubheadingV2BlockComponent } from '@/lib/blocks/v2/subheading-block/components/SubheadingBlockComponent'
import { RichTextV2BlockComponent } from '@/lib/blocks/v2/rich-text-block/components/RichTextBlockComponent'
import { ButtonV2BlockComponent } from '@/lib/blocks/v2/button-block/components/ButtonBlockComponent'
import { CardV2BlockComponent } from '@/lib/blocks/v2/card-block/components/CardBlockComponent'
import { AccordionV2BlockComponent } from '@/lib/blocks/v2/accordion-block/components/AccordionBlockComponent'
import { ImageV2BlockComponent } from '@/lib/blocks/v2/image-block/components/ImageBlockComponent'
import { SeparatorV2BlockComponent } from '@/lib/blocks/v2/separator-block/components/SeparatorBlockComponent'
import { FormV2BlockComponent } from '@/lib/blocks/v2/form-block/components/FormBlockComponent'
import { IconV2BlockComponent } from '@/lib/blocks/v2/icon-block/components/IconBlockComponent'
import { VideoV2BlockComponent } from '@/lib/blocks/v2/video-block/components/VideoBlockComponent'
import { QuoteV2BlockComponent } from '@/lib/blocks/v2/quote-block/components/QuoteBlockComponent'
import { SpacerV2BlockComponent } from '@/lib/blocks/v2/spacer-block/components/SpacerBlockComponent'
import { HeroV2BlockComponent } from '@/lib/blocks/v2/hero-block/components/HeroBlockComponent'
import { MapV2BlockComponent } from '@/lib/blocks/v2/map-block/components/MapBlockComponent'
import { FaqV2BlockComponent } from '@/lib/blocks/v2/faq-block/components/FaqBlockComponent'
import { StockArchiveV2BlockComponent } from '@/lib/blocks/v2/stock-archive-block/components/StockArchiveBlockComponent'
import { CarouselV2BlockComponent } from '@/lib/blocks/v2/carousel-block/components/CarouselBlockComponent'
import { SpecialsArchiveV2BlockComponent } from '@/lib/blocks/v2/specials-archive-block/components/SpecialsArchiveBlockComponent'
import { VehicleCatalogV2BlockComponent } from '@/lib/blocks/v2/vehicle-catalog-block/components/VehicleCatalogBlockComponent'
import { GalleryV2BlockComponent } from '@/lib/blocks/v2/gallery-block/components/GalleryBlockComponent'
import React, { Fragment } from 'react'
import { HeadingBlockComponent } from '@/lib/blocks/heading-block/components/HeadingBlockComponent'
import { HeroBlock } from '@/lib/blocks/hero-block/components/HeroBlockComponent'
import { RichTextBlockComponent } from '@/lib/blocks/rich-text-block/components/RichTextBlockComponent'
import { FeatureListBlockComponent } from '@/lib/blocks/feature-list-block/components/FeatureListBlockComponent'
import { FeatureRowsBlockComponent } from '@/lib/blocks/feature-rows-block/components/FeatureRowsBlockComponent'
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
import { FixedBackgroundBlockComponent } from '@/lib/blocks/fixed-background-block/components/FixedBackgroundBlockComponent'
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
import { ReviewsBlockComponent } from '@/lib/blocks/reviews-block/components/ReviewsBlockComponent'
import { RowBlockComponent } from '@/lib/blocks/row-block/components/RowBlockComponent'
import { VehicleTabsBlockComponent } from '@/lib/blocks/vehicle-tabs-block/components/VehicleTabsBlockComponent'
import { VehicleCatalogBlockComponent } from '@/lib/blocks/vehicle-catalog-block/components/VehicleCatalogBlockComponent'
import { VehicleHeroBlockComponent } from '@/lib/blocks/vehicle-hero-block/components/VehicleHeroBlockComponent'
import { VehicleModelsBlockComponent } from '@/lib/blocks/vehicle-models-block/components/VehicleModelsBlockComponent'
import { VehicleFaqBlockComponent } from '@/lib/blocks/vehicle-faq-block/components/VehicleFaqBlockComponent'
import { VehicleColorsBlockComponent } from '@/lib/blocks/vehicle-colors-block/components/VehicleColorsBlockComponent'
import { VehicleGalleryBlockComponent } from '@/lib/blocks/vehicle-gallery-block/components/VehicleGalleryBlockComponent'
import { VehicleFeaturesBlockComponent } from '@/lib/blocks/vehicle-features-block/components/VehicleFeaturesBlockComponent'
import { VehicleSpecialCategoriesBlockComponent } from '@/lib/blocks/vehicle-special-categories-block/components/VehicleSpecialCategoriesBlockComponent'
import { VehicleModelHeroBlockComponent } from '@/lib/blocks/vehicle-model-hero-block/components/VehicleModelHeroBlockComponent'
import { VehicleModelHighlightsBlockComponent } from '@/lib/blocks/vehicle-model-highlights-block/components/VehicleModelHighlightsBlockComponent'
import { VehicleModelColorsBlockComponent } from '@/lib/blocks/vehicle-model-colors-block/components/VehicleModelColorsBlockComponent'
import { VehicleModelSiblingsBlockComponent } from '@/lib/blocks/vehicle-model-siblings-block/components/VehicleModelSiblingsBlockComponent'
import { VehicleModelVariantsBlockComponent } from '@/lib/blocks/vehicle-model-variants-block/components/VehicleModelVariantsBlockComponent'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import {
  getBetterEditorBlockProps,
  type BetterEditorBlockProps,
} from '@/lib/blocks/betterEditor'

type BlockComponentMap = {
  section: Section
  sectionInner: SectionInner
  sectionV2: SectionV2
  wrapperV2: WrapperV2
  columnV2: ColumnV2
  headingV2: HeadingV2
  eyebrowV2: EyebrowV2
  headingTextV2: HeadingTextV2
  subheadingV2: SubheadingV2
  richTextV2: RichTextV2
  buttonV2: ButtonV2
  cardV2: CardV2
  accordionV2: AccordionV2
  imageV2: ImageV2
  separatorV2: SeparatorV2
  formV2: FormV2
  iconV2: IconV2
  videoV2: VideoV2
  quoteV2: QuoteV2
  spacerV2: SpacerV2
  heroV2: HeroV2
  mapV2: MapV2
  faqV2: FaqV2
  stockArchiveV2: StockArchiveV2
  carouselV2: CarouselV2
  specialsArchiveV2: SpecialsArchiveV2
  vehicleCatalogV2: VehicleCatalogV2
  galleryV2: GalleryV2
  row: Row
  heading: Heading
  hero: Hero
  'rich-text': RichText
  'feature-list': FeatureList
  'feature-rows': FeatureRows
  formBlock: FormBlockType
  'contact-info': ContactInfoBlock
  'icon-text': IconText
  'cta-button': CtaButton
  'back-button': BackButton
  'why-cards': WhyCards
  map: Map
  'team-grid': TeamGrid
  'image-block': ImageBlock
  fixedBackgroundBlock: FixedBackgroundBlockType
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
  reviews: Reviews
  'vehicle-tabs': VehicleTabsBlock
  'vehicle-catalog': VehicleCatalogBlock
  'vehicle-hero': VehicleHeroBlock
  'vehicle-models': VehicleModelsBlock
  'vehicle-faq': VehicleFaqBlock
  'vehicle-colors': VehicleColorsBlock
  'vehicle-gallery': VehicleGalleryBlock
  'vehicle-features': VehicleFeaturesBlock
  'vehicle-special-categories': VehicleSpecialCategoriesBlock
  'vehicle-model-hero': VehicleModelHeroBlock
  'vehicle-model-highlights': VehicleModelHighlightsBlock
  'vehicle-model-colors': VehicleModelColorsBlock
  'vehicle-model-siblings': VehicleModelSiblingsBlock
  'vehicle-model-variants': VehicleModelVariantsBlock
}

type WithMeta<T> = T & { meta?: BlockRenderMeta } & BetterEditorBlockProps

const blockComponents: {
  [K in keyof BlockComponentMap]: React.ComponentType<WithMeta<BlockComponentMap[K]>>
} = {
  section: SectionBlock,
  sectionInner: SectionBlock as unknown as React.ComponentType<WithMeta<SectionInner>>,
  sectionV2: SectionV2BlockComponent,
  wrapperV2: WrapperV2BlockComponent,
  columnV2: ColumnV2BlockComponent,
  headingV2: HeadingV2BlockComponent,
  eyebrowV2: EyebrowV2BlockComponent,
  headingTextV2: HeadingTextV2BlockComponent,
  subheadingV2: SubheadingV2BlockComponent,
  richTextV2: RichTextV2BlockComponent,
  buttonV2: ButtonV2BlockComponent,
  cardV2: CardV2BlockComponent,
  accordionV2: AccordionV2BlockComponent,
  imageV2: ImageV2BlockComponent,
  separatorV2: SeparatorV2BlockComponent,
  formV2: FormV2BlockComponent as unknown as React.ComponentType<WithMeta<FormV2>>,
  iconV2: IconV2BlockComponent,
  videoV2: VideoV2BlockComponent,
  quoteV2: QuoteV2BlockComponent,
  spacerV2: SpacerV2BlockComponent,
  heroV2: HeroV2BlockComponent,
  mapV2: MapV2BlockComponent,
  faqV2: FaqV2BlockComponent,
  stockArchiveV2: StockArchiveV2BlockComponent as unknown as React.ComponentType<
    WithMeta<StockArchiveV2>
  >,
  carouselV2: CarouselV2BlockComponent,
  specialsArchiveV2: SpecialsArchiveV2BlockComponent as unknown as React.ComponentType<
    WithMeta<SpecialsArchiveV2>
  >,
  vehicleCatalogV2: VehicleCatalogV2BlockComponent as unknown as React.ComponentType<
    WithMeta<VehicleCatalogV2>
  >,
  galleryV2: GalleryV2BlockComponent,
  row: RowBlockComponent,
  heading: HeadingBlockComponent,
  hero: HeroBlock,
  'rich-text': RichTextBlockComponent,
  'feature-list': FeatureListBlockComponent,
  'feature-rows': FeatureRowsBlockComponent,
  formBlock: FormBlockComponent as unknown as React.ComponentType<WithMeta<FormBlockType>>,
  'contact-info': ContactInfoBlockComponent as unknown as React.ComponentType<
    WithMeta<ContactInfoBlock>
  >,
  'icon-text': IconTextBlockComponent as unknown as React.ComponentType<WithMeta<IconText>>,
  'cta-button': CtaButtonBlockComponent,
  'back-button': BackButtonBlockComponent,
  'why-cards': WhyCardsBlockComponent,
  map: MapBlockComponent as unknown as React.ComponentType<WithMeta<Map>>,
  'team-grid': TeamGridBlockComponent,
  'image-block': ImageBlockComponent,
  fixedBackgroundBlock: FixedBackgroundBlockComponent,
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
  reviews: ReviewsBlockComponent,
  'vehicle-tabs': VehicleTabsBlockComponent,
  'vehicle-catalog': VehicleCatalogBlockComponent,
  'vehicle-hero': VehicleHeroBlockComponent,
  'vehicle-models': VehicleModelsBlockComponent,
  'vehicle-faq': VehicleFaqBlockComponent,
  'vehicle-colors': VehicleColorsBlockComponent,
  'vehicle-gallery': VehicleGalleryBlockComponent,
  'vehicle-features': VehicleFeaturesBlockComponent,
  'vehicle-special-categories': VehicleSpecialCategoriesBlockComponent,
  'vehicle-model-hero': VehicleModelHeroBlockComponent,
  'vehicle-model-highlights': VehicleModelHighlightsBlockComponent,
  'vehicle-model-colors': VehicleModelColorsBlockComponent,
  'vehicle-model-siblings': VehicleModelSiblingsBlockComponent,
  'vehicle-model-variants': VehicleModelVariantsBlockComponent,
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
      return (
        <Block key={key} {...block} meta={meta} {...getBetterEditorBlockProps(block)} />
      )
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
