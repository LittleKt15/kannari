import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { buildConfig } from 'payload'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Projects, Services, Clients } from './collections/Content'
import { Inquiries, RateLimits } from './collections/Inquiries'
import { SiteSettings } from './globals/SiteSettings'
const dirname = path.dirname(fileURLToPath(import.meta.url))
if (process.env.VERCEL_ENV === 'production' && !process.env.BLOB_READ_WRITE_TOKEN)
  throw new Error('Production requires BLOB_READ_WRITE_TOKEN')
export default buildConfig({
  admin: {
    theme: 'dark',
    user: 'users',
    importMap: { baseDir: dirname },
    meta: { titleSuffix: ' | Kannari Studio' },
    components: {
      graphics: { Logo: '/components/admin/Brand#Brand', Icon: '/components/admin/Brand#Icon' },
      beforeDashboard: ['/components/admin/Dashboard#Dashboard'],
    },
    livePreview: {
      collections: ['pages'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Users, Pages, Projects, Services, Clients, Media, Inquiries, RateLimits],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '', max: 5 },
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  telemetry: false,
  graphQL: { disable: true },
  upload: { limits: { fileSize: 50 * 1024 * 1024 } },
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM || process.env.SMTP_USER || '',
        defaultFromName: 'Kannari Studio',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
        },
      })
    : undefined,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      alwaysInsertFields: true,
      collections: { media: { prefix: '', disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: true,
      addRandomSuffix: true,
    }),
  ],
})
