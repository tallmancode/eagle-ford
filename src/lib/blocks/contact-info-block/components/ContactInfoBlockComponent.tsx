import type { ContactInfo } from '@/payload-types'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { backgroundColorToClass } from '@/lib/fields/background-color/backgroundColorUtils'
import { resolveLinkFieldHref } from '@/lib/utils/resolveLinkFieldHref'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import React from 'react'

export const ContactInfoBlockComponent: React.FC<ContactInfo> = ({
  heading,
  phone,
  email,
  addressLine1,
  addressLine2,
  businessHours,
  ctaButtons,
  backgroundColor,
  border,
}) => {
  const resolvedBackground = backgroundColor ?? 'card'
  const bgClass = backgroundColorToClass(resolvedBackground)
  const borderClass = border === 'none' ? '' : 'border'
  const shadowClass = resolvedBackground === 'card' ? 'shadow-sm' : ''

  return (
    <div className={cn('rounded-2xl p-8 space-y-6', bgClass, borderClass, shadowClass)}>
      <h2 className="text-primary text-2xl font-bold">{heading ?? 'Get in Touch'}</h2>

      <div className="flex items-start gap-3">
        <Phone className="size-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
            Contact Us Today
          </p>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="text-lg font-semibold hover:text-primary transition-colors"
          >
            {phone}
          </a>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Mail className="size-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Email</p>
          <a
            href={`mailto:${email}`}
            className="text-base font-medium hover:text-primary transition-colors"
          >
            {email}
          </a>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Address</p>
          <p className="text-base font-medium">{addressLine1}</p>
          {addressLine2 && <p className="text-sm text-muted-foreground">{addressLine2}</p>}
        </div>
      </div>

      {businessHours && businessHours.length > 0 && (
        <div className="flex items-start gap-3">
          <Clock className="size-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
              Business Hours
            </p>
            {businessHours.map((row, index) => (
              <p key={row.id ?? index} className="text-sm font-medium">
                {row.label}: {row.hours}
              </p>
            ))}
          </div>
        </div>
      )}

      {ctaButtons && ctaButtons.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
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
                className="w-full rounded-full"
                asChild
              >
                <Link href={resolved.href} {...newTabProps}>
                  {btn.link?.label}
                </Link>
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}
