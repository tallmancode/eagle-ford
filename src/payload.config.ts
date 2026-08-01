import { mongooseAdapter } from '@payloadcms/db-mongodb'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { UsersCollection } from './collections/Users'
import Collections from '@/collections'
import { plugins } from './plugins'
import { defaultLexical } from '@/lib/fields/defaultLexical'
import { getServerSideURL } from './lib/utils/getServerSideURL'
import Globals from '@/globals'
import Blocks from '@/lib/blocks'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { SITE_FAVICON_LINKS } from './constants/siteIcons'
import { forwardMotorCityLeadHandler } from '@/tasks/forwardMotorCityLead'
import { sweepMotorCityLeadsHandler } from '@/tasks/sweepMotorCityLeads'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      views: {
        login: {
          Component: '@/views/Login',
        },
        liveStock: {
          Component: '@/views/LiveStock',
          path: '/data-management/live-stock',
          exact: true,
        },
      },
      afterNavLinks: ['@/components/admin/sidebar/LiveStockNavLink#LiveStockNavLink'],
      beforeLogin: ['@/components/BeforeLogin'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: UsersCollection.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
    meta: {
      title: 'Eagle Ford CMS',
      icons: [...SITE_FAVICON_LINKS],
    },
  },
  graphQL: {
    disable: true,
  },
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  collections: [...Collections, UsersCollection],
  cors: [getServerSideURL()].filter(Boolean),
  globals: Globals,
  blocks: [...Blocks],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  email: nodemailerAdapter({
    defaultFromAddress: 'noreply@eaglemc.co.za',
    defaultFromName: 'Eagle Ford',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      // Port 587 = STARTTLS (secure: false + requireTLS: true)
      // Port 465 = implicit SSL (secure: true)
      secure: Number(process.env.SMTP_PORT ?? 587) === 465,
      requireTLS: Number(process.env.SMTP_PORT ?? 587) !== 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  upload: {
    limits: {
      fileSize: 15000000,
    },
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [
      {
        slug: 'forwardMotorCityLead',
        label: 'Forward form submission → Motor City site-forms',
        retries: 2,
        inputSchema: [
          {
            name: 'formSubmissionId',
            type: 'text',
            required: true,
            admin: {
              description: 'Payload form-submissions document id (also used as extLeadRef)',
            },
          },
        ],
        outputSchema: [
          { name: 'outcome', type: 'text', required: true },
          { name: 'status', type: 'text' },
        ],
        handler: forwardMotorCityLeadHandler,
      },
      {
        slug: 'sweepMotorCityLeads',
        label: 'Sweep pending Motor City lead forwards',
        retries: 1,
        schedule: [
          {
            cron: '*/5 * * * *',
            queue: 'motor-city-leads',
          },
        ],
        outputSchema: [
          { name: 'examined', type: 'number', required: true },
          { name: 'queued', type: 'number', required: true },
        ],
        handler: sweepMotorCityLeadsHandler,
      },
    ],
  },
})
