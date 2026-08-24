import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { Button } from '@/components/ui/button'
import { resolveLinkFieldHref } from '@/lib/utils/resolveLinkFieldHref'
import { cn } from '@/lib/utils/cn'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

type ContactInfoV2Props = {
  heading?: string | null
  phone: string
  email: string
  addressLine1: string
  addressLine2?: string | null
  businessHours?: Array<{ id?: string | null; label: string; hours: string }> | null
  ctaButtons?: Array<{ id?: string | null; link?: Parameters<typeof resolveLinkFieldHref>[0] }> | null
  showBorder?: boolean | null
  styles?: StyleValues | null
  blockType?: string
  id?: string | null
}

export function ContactInfoV2BlockComponent(props: ContactInfoV2Props) {
  const {
    heading,
    phone,
    email,
    addressLine1,
    addressLine2,
    businessHours,
    ctaButtons,
    showBorder = true,
    styles,
  } = props

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={cn(
        'space-y-6 rounded-2xl bg-card p-8 shadow-sm',
        showBorder && 'border',
        className,
      )}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <h2 className="text-2xl font-bold text-primary">{heading ?? 'Get in Touch'}</h2>

      <div className="flex items-start gap-3">
        <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <p className="mb-0.5 text-xs uppercase tracking-wide text-muted-foreground">
            Contact Us Today
          </p>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="text-lg font-semibold transition-colors hover:text-primary"
            data-gtm-cta="call-now"
            data-gtm-cta-location="contact-info-v2-block"
          >
            {phone}
          </a>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <p className="mb-0.5 text-xs uppercase tracking-wide text-muted-foreground">Email</p>
          <a
            href={`mailto:${email}`}
            className="text-base font-medium transition-colors hover:text-primary"
            data-gtm-cta="email-now"
            data-gtm-cta-location="contact-info-v2-block"
          >
            {email}
          </a>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <p className="mb-0.5 text-xs uppercase tracking-wide text-muted-foreground">Address</p>
          <p className="text-base font-medium">{addressLine1}</p>
          {addressLine2 ? <p className="text-sm text-muted-foreground">{addressLine2}</p> : null}
        </div>
      </div>

      {businessHours && businessHours.length > 0 ? (
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="mb-0.5 text-xs uppercase tracking-wide text-muted-foreground">
              Business Hours
            </p>
            {businessHours.map((row, index) => (
              <p key={row.id ?? index} className="text-sm font-medium">
                {row.label}: {row.hours}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      {ctaButtons && ctaButtons.length > 0 ? (
        <div className="mt-2 flex flex-col gap-2">
          {ctaButtons.map((btn, index) => {
            const resolved = resolveLinkFieldHref(btn.link)
            if (!resolved) return null
            const newTabProps = resolved.openInNewTab
              ? { target: '_blank' as const, rel: 'noopener noreferrer' }
              : {}
            return (
              <Button
                key={btn.id ?? index}
                variant="outline"
                className="h-12 w-full rounded-full px-6 text-base"
                asChild
              >
                <Link
                  href={resolved.href}
                  {...newTabProps}
                  data-gtm-cta="contact-info-cta"
                  data-gtm-cta-location="contact-info-v2-block"
                >
                  {btn.link && 'label' in btn.link ? (btn.link as { label?: string }).label : null}
                </Link>
              </Button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
