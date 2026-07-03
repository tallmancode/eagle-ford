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
  StatsBlock,
  HoursTabs,
  Faq,
  ContactFooter,
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
import { ImageBlockComponent } from '@/lib/blocks/image-block/components/ImageBlockComponent'
import { HoursTabsBlockComponent } from '@/lib/blocks/hours-tabs-block/components/HoursTabsBlockComponent'
import { FaqBlockComponent } from '@/lib/blocks/faq-block/components/FaqBlockComponent'
import { ContactFooterBlockComponent } from '@/lib/blocks/contact-footer-block/components/ContactFooterBlockComponent'

type BlockComponentMap = {
  section: Section
  sectionInner: SectionInner
  heading: Heading
  hero: Hero
  'rich-text': RichText
  'feature-list': FeatureList
  formBlock: FormBlockType
  'contact-info': ContactInfo
  'icon-text': IconText
  'cta-button': CtaButton
  'why-cards': WhyCards
  map: Map
  'team-grid': TeamGrid
  'image-block': ImageBlock
  'cta-cards': CtaCards
  statsBlock: StatsBlock
  'hours-tabs': HoursTabs
  faq: Faq
  'contact-footer': ContactFooter
}

type WithMeta<T> = T & { meta?: unknown }

const blockComponents: {
  [K in keyof BlockComponentMap]: React.ComponentType<WithMeta<BlockComponentMap[K]>>
} = {
  section: SectionBlock,
  sectionInner: SectionBlock as unknown as React.ComponentType<WithMeta<SectionInner>>,
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
  'why-cards': WhyCardsBlockComponent,
  map: MapBlockComponent as unknown as React.ComponentType<WithMeta<Map>>,
  'team-grid': TeamGridBlockComponent,
  'image-block': ImageBlockComponent,
  'cta-cards': CtaCardsBlockComponent,
  statsBlock: StatsBlockComponent,
  'hours-tabs': HoursTabsBlockComponent,
  faq: FaqBlockComponent,
  'contact-footer': ContactFooterBlockComponent as unknown as React.ComponentType<
    WithMeta<ContactFooter>
  >,
} as const

type Blocks = Config['blocks']

type BlockTypes = Blocks[keyof Blocks]
type BlockComponentKey = keyof typeof blockComponents

export function renderBlock(block: BlockTypes, index: number, meta?: unknown): React.ReactNode {
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

export const RenderBlocks: React.FC<{ blocks: BlockTypes[] | null | undefined; meta?: unknown }> = (
  props,
) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>{blocks.map((block, index) => renderBlock(block, index, props.meta))}</Fragment>
    )
  }

  return null
}
