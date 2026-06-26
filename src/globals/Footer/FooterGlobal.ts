import type { GlobalConfig } from 'payload'
import { NavLinksField } from '@/lib/fields/navigation/NavLinksField'
import { isAdmin } from '@/lib/utils/accessUtil'
import { SocialAccountsField } from '@/lib/fields/social-icons'
import { revalidateGlobalFooter } from '@/globals/Footer/hooks/revalidateGlobalFooter'

export const FooterGlobal: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: isAdmin,
  },
  admin: {
    group: 'Layout',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'copyrightText',
              type: 'text',
              admin: {
                description: 'Copyright text shown in the footer bottom bar.',
              },
            },
            {
              name: 'bottomBarLink',
              type: 'group',
              label: 'Bottom Bar Link',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  defaultValue: 'Privacy Policy',
                },
                {
                  name: 'url',
                  type: 'text',
                  admin: {
                    description: 'Link shown on the right side of the footer bottom bar.',
                  },
                },
              ],
            },
            {
              name: 'whatsappUrl',
              type: 'text',
              label: 'WhatsApp URL',
              admin: {
                description:
                  'Full WhatsApp chat URL (e.g. https://wa.me/27123456789). Shows a floating button when set.',
              },
            },
            {
              name: 'newsletter',
              type: 'group',
              label: 'Newsletter',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Show newsletter banner',
                  defaultValue: false,
                },
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Subscribe to our newsletter',
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.enabled),
                  },
                },
                {
                  name: 'placeholder',
                  type: 'text',
                  defaultValue: 'Your email address',
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.enabled),
                  },
                },
                {
                  name: 'buttonLabel',
                  type: 'text',
                  defaultValue: 'Subscribe',
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.enabled),
                  },
                },
                {
                  name: 'form',
                  type: 'relationship',
                  relationTo: 'forms',
                  label: 'Newsletter form',
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.enabled),
                    description:
                      'Single-step form with one email field (field name e.g. email). Submissions appear under Form Submissions.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Quick Links',
          fields: [NavLinksField({ name: 'links', maxRows: 10, relationTo: ['pages'] })],
        },
        {
          label: 'Our Brands',
          fields: [NavLinksField({ name: 'brandLinks', maxRows: 10, relationTo: ['pages'] })],
        },
        {
          label: 'Legal & Disclaimer',
          fields: [NavLinksField({ name: 'legalLinks', maxRows: 10, relationTo: ['pages'] })],
        },
        {
          label: 'Social & Badge',
          fields: [
            SocialAccountsField({ name: 'socials', maxRows: 8 }),
            {
              name: 'dealershipBadge',
              type: 'group',
              label: 'Dealership Badge',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Show dealership badge',
                },
                {
                  name: 'badgeImage',
                  type: 'upload',
                  label: 'Badge image',
                  relationTo: 'media',
                  admin: {
                    description:
                      'Optional full badge image. When set, overrides the built-in badge layout.',
                  },
                },
                {
                  name: 'logoImage',
                  type: 'upload',
                  label: 'Logo',
                  relationTo: 'media',
                  admin: {
                    condition: (_, siblingData) => !siblingData?.badgeImage,
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'EAGLE MOTOR CITY',
                  admin: {
                    condition: (_, siblingData) => !siblingData?.badgeImage,
                  },
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  defaultValue: 'TOP-RATED DEALERSHIP',
                  admin: {
                    condition: (_, siblingData) => !siblingData?.badgeImage,
                  },
                },
                {
                  name: 'rating',
                  type: 'number',
                  min: 0,
                  max: 5,
                  defaultValue: 4.7,
                  admin: {
                    condition: (_, siblingData) => !siblingData?.badgeImage,
                    step: 0.1,
                  },
                },
                {
                  name: 'googleReviewUrl',
                  type: 'text',
                  label: 'Google review URL',
                  admin: {
                    condition: (_, siblingData) => !siblingData?.badgeImage,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobalFooter],
  },
}
