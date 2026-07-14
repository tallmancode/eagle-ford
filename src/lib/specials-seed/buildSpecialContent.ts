import {
  defaultLayoutVisibilityValue,
  emptyFlexLayoutValue,
  emptyLayoutSpacingValue,
} from '@/lib/fields/layout-field/utils/layout-utils'
import { htmlToLexicalRoot } from '@/lib/specials-seed/lexical'
import type { Section } from '@/payload-types'

type BuildSpecialContentInput = {
  title: string
  subheading: string | null
  bodyHtml: string
  detailImageId: string
  formId: string
  /** Frontend path to vehicle or model page, e.g. /vehicles/next-level-ranger/... */
  modelHref?: string | null
}

const defaultSectionInnerLayout = {
  backgroundColor: 'none' as const,
  backgroundStyle: 'none' as const,
  container: false,
  verticalAlign: 'top' as const,
  layout: {
    spacing: emptyLayoutSpacingValue(),
    flex: emptyFlexLayoutValue(),
    visibility: defaultLayoutVisibilityValue(),
  },
  accessibility: { landmark: '' as const, ariaHidden: false },
}

function standardHeading(heading: string, subheading?: string | null, size: 'lg' | 'md' = 'lg') {
  return {
    blockType: 'heading' as const,
    template: 'standard' as const,
    standardHeadingContent: {
      tag: { style: 'filled' as const, color: 'neutral' as const },
      heading,
      splitTextAnimation: false,
      subheading: subheading ?? undefined,
      headingTag: 'h2' as const,
      size,
      alignment: size === 'md' ? ('center' as const) : ('left' as const),
      color: 'primary' as const,
      fontWeight: 'bold' as const,
      uppercase: false,
    },
  }
}

export function buildSpecialContent({
  title,
  subheading,
  bodyHtml,
  detailImageId,
  formId,
  modelHref,
}: BuildSpecialContentInput): { section: Section[] } {
  const ctaButtons = [
    {
      blockType: 'cta-button' as const,
      label: 'Enquire Now',
      icon: 'mail',
      linkType: 'url' as const,
      variant: 'default' as const,
      url: 'mailto:sales@eagleford.co.za',
      newTab: false,
      size: 'default' as const,
      align: 'left' as const,
    },
    ...(modelHref
      ? [
          {
            blockType: 'cta-button' as const,
            label: 'View Model',
            icon: 'car',
            linkType: 'url' as const,
            variant: 'secondary' as const,
            url: modelHref,
            newTab: false,
            size: 'default' as const,
            align: 'left' as const,
          },
        ]
      : []),
    {
      blockType: 'cta-button' as const,
      label: 'All Specials',
      icon: 'dollar-sign',
      linkType: 'url' as const,
      variant: 'outline' as const,
      url: '/specials',
      newTab: false,
      size: 'default' as const,
      align: 'left' as const,
    },
  ]

  // Seed builders intentionally omit optional Payload defaults/IDs; cast to collection types.
  const contentSection = {
    blockType: 'section' as const,
    backgroundColor: 'none' as const,
    backgroundStyle: 'none' as const,
    container: true,
    gridCols: '2' as const,
    showDivider: false,
    dividerColor: 'primary' as const,
    accessibility: { landmark: 'region' as const, ariaHidden: false },
    content: [
      {
        blockType: 'sectionInner' as const,
        ...defaultSectionInnerLayout,
        content: [
          {
            blockType: 'image-block' as const,
            image: detailImageId,
            cornerRadius: 'none' as const,
            aspectRatio: 'auto' as const,
            shadow: 'none' as const,
          },
        ],
      },
      {
        blockType: 'sectionInner' as const,
        ...defaultSectionInnerLayout,
        content: [
          standardHeading(title, subheading),
          {
            blockType: 'rich-text' as const,
            content: htmlToLexicalRoot(bodyHtml),
          },
          {
            blockType: 'row' as const,
            container: false,
            align: 'left' as const,
            verticalAlign: 'center' as const,
            gap: 'md' as const,
            wrap: true,
            accessibility: { landmark: '' as const, ariaHidden: false },
            content: ctaButtons,
          },
        ],
      },
    ],
  }

  const formSection = {
    blockType: 'section' as const,
    backgroundColor: 'none' as const,
    backgroundStyle: 'none' as const,
    container: true,
    gridCols: '1' as const,
    showDivider: false,
    accessibility: { landmark: 'region' as const, ariaHidden: false },
    content: [
      standardHeading(
        'Want to know more ',
        'Fill in your details below and our sales team will get in touch',
        'md',
      ),
      {
        blockType: 'sectionInner' as const,
        ...defaultSectionInnerLayout,
        content: [
          {
            blockType: 'formBlock' as const,
            form: formId,
          },
        ],
      },
    ],
  }

  return { section: [contentSection, formSection] as Section[] }
}
