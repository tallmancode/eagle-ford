import {
  defaultLayoutVisibilityValue,
  emptyFlexLayoutValue,
  emptyLayoutSpacingValue,
} from '@/lib/fields/layout-field/utils/layout-utils'
import { htmlToLexicalRoot } from '@/lib/specials-seed/lexical'
import type { OfferType } from '@/lib/specials/constants'
import { formatZAR } from '@/lib/utils/formatZAR'
import type { Section } from '@/payload-types'

type BuildSpecialContentInput = {
  title: string
  /** Optional; when omitted, synthesized from pricing fields */
  subheading?: string | null
  /** Optional; when omitted, synthesized from pricing + standard T&Cs */
  bodyHtml?: string | null
  detailImageId: string
  formId: string
  /** Frontend path to vehicle or model page, e.g. /vehicles/next-level-ranger/... */
  modelHref?: string | null
  offerType?: OfferType | Extract<OfferType, 'price-point' | 'payment'>
  specialOffer?: number | null
  bestSaving?: number | null
  paymentFrom?: number | null
}

function synthesizePricingContent(input: {
  offerType?: string
  specialOffer?: number | null
  bestSaving?: number | null
  paymentFrom?: number | null
}): { subheading: string | null; bodyHtml: string } {
  const lines: string[] = []

  if (input.offerType === 'payment' && input.paymentFrom != null) {
    const line = `From ${formatZAR(input.paymentFrom)}*pm`
    lines.push(`<p><strong>${line}</strong></p>`)
    return {
      subheading: line,
      bodyHtml: `${lines.join('')}<p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>`,
    }
  }

  if (input.offerType === 'price-point') {
    if (input.specialOffer != null) {
      const line = `Special Offer: ${formatZAR(input.specialOffer)}*`
      lines.push(`<p><strong>${line}</strong></p>`)
    }
    if (input.bestSaving != null) {
      lines.push(`<p><strong>Best Saving: ${formatZAR(input.bestSaving)}*</strong></p>`)
    }
    const subheading =
      input.specialOffer != null ? `Special Offer: ${formatZAR(input.specialOffer)}*` : null
    return {
      subheading,
      bodyHtml: `${lines.join('')}<p><br></p><p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p><p>All including 6 year / 90 000 km Service Plan.</p>`,
    }
  }

  return {
    subheading: null,
    bodyHtml:
      '<p>Terms and conditions apply.</p><p><br></p><p>All subject to finance approval Ford Credit.</p>',
  }
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
  subheading: subheadingInput,
  bodyHtml: bodyHtmlInput,
  detailImageId,
  formId,
  modelHref,
  offerType,
  specialOffer,
  bestSaving,
  paymentFrom,
}: BuildSpecialContentInput): { section: Section[] } {
  const synthesized = synthesizePricingContent({
    offerType,
    specialOffer,
    bestSaving,
    paymentFrom,
  })
  const subheading = subheadingInput ?? synthesized.subheading
  const bodyHtml = bodyHtmlInput?.trim() ? bodyHtmlInput : synthesized.bodyHtml

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
