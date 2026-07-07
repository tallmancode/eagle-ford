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
              ...NavLinksField({
                name: 'bottomBarLink',
                maxRows: 1,
                relationTo: ['pages'],
                enableUploadLink: true,
              }),
              label: 'Bottom Bar Link',
              admin: {
                isSortable: false,
                description:
                  'Single link shown on the right side of the footer bottom bar (e.g. Privacy Policy).',
                components: {
                  RowLabel: '/lib/fields/navigation/Components/NavLinkRowLabel',
                },
              },
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
          label: 'Columns',
          fields: [
            {
              name: 'columns',
              type: 'blocks',
              maxRows: 6,
              admin: {
                isSortable: true,
                description:
                  'Add up to 6 footer columns. Drag to reorder. Each column type has its own set of fields.',
              },
              blocks: [
                {
                  slug: 'linksColumn',
                  labels: { singular: 'Links Column', plural: 'Links Columns' },
                  fields: [
                    {
                      name: 'heading',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Column heading displayed above the list of links.',
                      },
                    },
                    NavLinksField({
                      name: 'links',
                      maxRows: 20,
                      relationTo: ['pages', 'vehicles'],
                      enableUploadLink: true,
                    }),
                  ],
                },
                {
                  slug: 'socialColumn',
                  labels: { singular: 'Social Column', plural: 'Social Columns' },
                  fields: [
                    {
                      name: 'heading',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Column heading displayed above the social links.',
                      },
                    },
                    SocialAccountsField({ name: 'socials', maxRows: 8 }),
                  ],
                },
                {
                  slug: 'badgeColumn',
                  labels: { singular: 'Badge / Logo Column', plural: 'Badge / Logo Columns' },
                  fields: [
                    {
                      name: 'logoImage',
                      type: 'upload',
                      label: 'Logo',
                      relationTo: 'media',
                      admin: {
                        description: 'Brand logo displayed at the top of the column.',
                      },
                    },
                    {
                      name: 'badgeEnabled',
                      type: 'checkbox',
                      label: 'Show dealership badge',
                      defaultValue: true,
                    },
                    {
                      name: 'badgeImage',
                      type: 'upload',
                      label: 'Full badge image (optional)',
                      relationTo: 'media',
                      admin: {
                        condition: (_, siblingData) => Boolean(siblingData?.badgeEnabled),
                        description: 'When set, overrides the built-in badge layout below.',
                      },
                    },
                    {
                      name: 'badgeTitle',
                      type: 'text',
                      label: 'Badge title',
                      defaultValue: 'EAGLE MOTOR CITY',
                      admin: {
                        condition: (_, siblingData) =>
                          Boolean(siblingData?.badgeEnabled) && !siblingData?.badgeImage,
                      },
                    },
                    {
                      name: 'badgeSubtitle',
                      type: 'text',
                      label: 'Badge subtitle',
                      defaultValue: 'TOP-RATED DEALERSHIP',
                      admin: {
                        condition: (_, siblingData) =>
                          Boolean(siblingData?.badgeEnabled) && !siblingData?.badgeImage,
                      },
                    },
                    {
                      name: 'rating',
                      type: 'number',
                      min: 0,
                      max: 5,
                      defaultValue: 4.7,
                      admin: {
                        step: 0.1,
                        condition: (_, siblingData) =>
                          Boolean(siblingData?.badgeEnabled) && !siblingData?.badgeImage,
                      },
                    },
                    {
                      name: 'googleReviewUrl',
                      type: 'text',
                      label: 'Google review URL',
                      admin: {
                        condition: (_, siblingData) =>
                          Boolean(siblingData?.badgeEnabled) && !siblingData?.badgeImage,
                      },
                    },
                  ],
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
