import { SectionBlock } from '@/lib/blocks/section-block/SectionBlock'
import { SectionInnerBlock } from '@/lib/blocks/section-block/SectionInnerBlock'
import { SectionV2Block } from '@/lib/blocks/v2/section-block/SectionBlockConfig'
import { WrapperV2Block } from '@/lib/blocks/v2/wrapper-block/WrapperBlockConfig'
import { ColumnV2Block } from '@/lib/blocks/v2/column-block/ColumnBlockConfig'
import { HeadingV2Block } from '@/lib/blocks/v2/heading-block/HeadingBlockConfig'
import { EyebrowV2Block } from '@/lib/blocks/v2/eyebrow-block/EyebrowBlockConfig'
import { HeadingTextV2Block } from '@/lib/blocks/v2/heading-text-block/HeadingTextBlockConfig'
import { SubheadingV2Block } from '@/lib/blocks/v2/subheading-block/SubheadingBlockConfig'
import { RichTextV2Block } from '@/lib/blocks/v2/rich-text-block/RichTextBlockConfig'
import { ButtonV2Block } from '@/lib/blocks/v2/button-block/ButtonBlockConfig'
import { CardV2Block } from '@/lib/blocks/v2/card-block/CardBlockConfig'
import { AccordionV2Block } from '@/lib/blocks/v2/accordion-block/AccordionBlockConfig'
import { ImageV2Block } from '@/lib/blocks/v2/image-block/ImageBlockConfig'
import { SeparatorV2Block } from '@/lib/blocks/v2/separator-block/SeparatorBlockConfig'
import { FormV2Block } from '@/lib/blocks/v2/form-block/FormBlockConfig'
import { IconV2Block } from '@/lib/blocks/v2/icon-block/IconBlockConfig'
import { VideoV2Block } from '@/lib/blocks/v2/video-block/VideoBlockConfig'
import { QuoteV2Block } from '@/lib/blocks/v2/quote-block/QuoteBlockConfig'
import { SpacerV2Block } from '@/lib/blocks/v2/spacer-block/SpacerBlockConfig'
import { HeroV2Block } from '@/lib/blocks/v2/hero-block/HeroBlockConfig'
import { MapV2Block } from '@/lib/blocks/v2/map-block/MapBlockConfig'
import { FaqV2Block } from '@/lib/blocks/v2/faq-block/FaqBlockConfig'
import { StockArchiveV2Block } from '@/lib/blocks/v2/stock-archive-block/StockArchiveBlockConfig'
import { CarouselV2Block } from '@/lib/blocks/v2/carousel-block/CarouselBlockConfig'
import { SpecialsArchiveV2Block } from '@/lib/blocks/v2/specials-archive-block/SpecialsArchiveBlockConfig'
import { VehicleCatalogV2Block } from '@/lib/blocks/v2/vehicle-catalog-block/VehicleCatalogBlockConfig'
import { GalleryV2Block } from '@/lib/blocks/v2/gallery-block/GalleryBlockConfig'
import { RowBlock } from '@/lib/blocks/row-block/RowBlock'
import { HeroBlock } from '@/lib/blocks/hero-block/HeroBlock'
import { HeadingBlock } from '@/lib/blocks/heading-block/HeadingBlock'
import { RichTextBlock } from '@/lib/blocks/rich-text-block/RichTextBlock'
import { FeatureListBlock } from '@/lib/blocks/feature-list-block/FeatureListBlock'
import { FeatureRowsBlock } from '@/lib/blocks/feature-rows-block/FeatureRowsBlock'
import { FormBlock } from '@/lib/blocks/form-block/FormBlock'
import { ContactInfoBlock } from '@/lib/blocks/contact-info-block/ContactInfoBlock'
import { IconTextBlock } from '@/lib/blocks/icon-text-block/IconTextBlock'
import { CtaButtonBlock } from '@/lib/blocks/cta-button-block/CtaButtonBlock'
import { WhyCardsBlock } from '@/lib/blocks/why-cards-block/WhyCardsBlock'
import { MapBlock } from '@/lib/blocks/map-block/MapBlock'
import { TeamGridBlock } from '@/lib/blocks/team-grid-block/TeamGridBlock'
import { ImageBlock } from '@/lib/blocks/image-block/ImageBlock'
import { FixedBackgroundBlock } from '@/lib/blocks/fixed-background-block/FixedBackgroundBlock'
import { CtaCardsBlock } from '@/lib/blocks/cta-cards-block/CtaCardsBlock'
import { ImageCardsBlock } from '@/lib/blocks/image-cards-block/ImageCardsBlock'
import { StatsBlock } from '@/lib/blocks/stats-block/StatsBlock'
import { HoursTabsBlock } from '@/lib/blocks/hours-tabs-block/HoursTabsBlock'
import { FaqBlock } from '@/lib/blocks/faq-block/FaqBlock'
import { ContactFooterBlock } from '@/lib/blocks/contact-footer-block/ContactFooterBlock'
import { FeatureGridBlock } from '@/lib/blocks/feature-grid-block/FeatureGridBlock'
import { BenefitsBlock } from '@/lib/blocks/benefits-block/BenefitsBlock'
import { PopupCardsBlock } from '@/lib/blocks/popup-cards-block/PopupCardsBlock'
import { FinanceCalculatorBlock } from '@/lib/blocks/finance-calculator-block/FinanceCalculatorBlock'
import { BackButtonBlock } from '@/lib/blocks/back-button-block/BackButtonBlock'
import { BenefitsGridBlock } from '@/lib/blocks/benefits-grid-block/BenefitsGridBlock'
import { SpecialsArchiveBlock } from '@/lib/blocks/specials-archive-block/SpecialsArchiveBlock'
import { StockArchiveBlock } from '@/lib/blocks/stock-archive-block/StockArchiveBlock'
import { PartnersBlock } from '@/lib/blocks/partners-block/PartnersBlock'
import { ReviewsBlock } from '@/lib/blocks/reviews-block/ReviewsBlock'
import { VehicleTabsBlock } from '@/lib/blocks/vehicle-tabs-block/VehicleTabsBlock'
import { VehicleCatalogBlock } from '@/lib/blocks/vehicle-catalog-block/VehicleCatalogBlock'
import { VehicleHeroBlock } from '@/lib/blocks/vehicle-hero-block/VehicleHeroBlock'
import { VehicleModelsBlock } from '@/lib/blocks/vehicle-models-block/VehicleModelsBlock'
import { VehicleFaqBlock } from '@/lib/blocks/vehicle-faq-block/VehicleFaqBlock'
import { VehicleColorsBlock } from '@/lib/blocks/vehicle-colors-block/VehicleColorsBlock'
import { VehicleGalleryBlock } from '@/lib/blocks/vehicle-gallery-block/VehicleGalleryBlock'
import { VehicleFeaturesBlock } from '@/lib/blocks/vehicle-features-block/VehicleFeaturesBlock'
import { VehicleSpecialCategoriesBlock } from '@/lib/blocks/vehicle-special-categories-block/VehicleSpecialCategoriesBlock'
import { VehicleModelHeroBlock } from '@/lib/blocks/vehicle-model-hero-block/VehicleModelHeroBlock'
import { VehicleModelHighlightsBlock } from '@/lib/blocks/vehicle-model-highlights-block/VehicleModelHighlightsBlock'
import { VehicleModelColorsBlock } from '@/lib/blocks/vehicle-model-colors-block/VehicleModelColorsBlock'
import { VehicleModelSiblingsBlock } from '@/lib/blocks/vehicle-model-siblings-block/VehicleModelSiblingsBlock'
import { VehicleModelVariantsBlock } from '@/lib/blocks/vehicle-model-variants-block/VehicleModelVariantsBlock'

const Blocks = [
  SectionBlock,
  SectionInnerBlock,
  SectionV2Block,
  WrapperV2Block,
  ColumnV2Block,
  HeadingV2Block,
  EyebrowV2Block,
  HeadingTextV2Block,
  SubheadingV2Block,
  RichTextV2Block,
  ButtonV2Block,
  CardV2Block,
  AccordionV2Block,
  ImageV2Block,
  SeparatorV2Block,
  FormV2Block,
  IconV2Block,
  VideoV2Block,
  QuoteV2Block,
  SpacerV2Block,
  HeroV2Block,
  MapV2Block,
  FaqV2Block,
  StockArchiveV2Block,
  CarouselV2Block,
  SpecialsArchiveV2Block,
  VehicleCatalogV2Block,
  GalleryV2Block,
  RowBlock,
  HeroBlock,
  HeadingBlock,
  RichTextBlock,
  FeatureListBlock,
  FeatureRowsBlock,
  FormBlock,
  ContactInfoBlock,
  IconTextBlock,
  CtaButtonBlock,
  WhyCardsBlock,
  MapBlock,
  TeamGridBlock,
  ImageBlock,
  FixedBackgroundBlock,
  CtaCardsBlock,
  ImageCardsBlock,
  StatsBlock,
  HoursTabsBlock,
  FaqBlock,
  ContactFooterBlock,
  FeatureGridBlock,
  BenefitsBlock,
  PopupCardsBlock,
  FinanceCalculatorBlock,
  BackButtonBlock,
  BenefitsGridBlock,
  SpecialsArchiveBlock,
  StockArchiveBlock,
  PartnersBlock,
  ReviewsBlock,
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
]

export default Blocks
