# Kannari Content Studio

A standalone Next.js portfolio and Payload CMS application. The original `../kannari` project is a reference; it is not needed to run this app.

## Stack

Payload 3.88.0, Next.js 16.3.4, React 19.2.8, TypeScript, Tailwind CSS 3, Neon PostgreSQL, and Vercel Blob. Payload's PostgreSQL adapter owns the Drizzle schema and migration lifecycle. Public Server Components use the Local API with access checks; the admin uses Payload's native APIs. GraphQL is disabled.

## Local setup

1. Install Node.js 24 and run `npm ci`.
2. Copy `.env.example` to `.env` and configure `DATABASE_URL` and a strong random `PAYLOAD_SECRET`. Real credentials must never be committed.
3. Run `npm run db:inspect` before using a new database. This app expects its own database; never reset a shared database.
4. Run `npm run migrate` and then `npm run seed`.
5. Run `npm run dev -- --port 3001` and open http://localhost:3001.
6. Open http://localhost:3001/admin and create the first account. The first account receives the admin role. Subsequent accounts are created by admins. Alternatively, set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (12+ characters), and `ADMIN_NAME`, then run `npm run admin:create`.

Set `NEXT_PUBLIC_SITE_URL` to the actual origin used by the app (including the local port). It controls canonical URLs, the sitemap, and organization metadata. No production deployment or domain switch is performed by the setup scripts.

## Editing

- **Pages:** Home, About, Work, Services, and Contact are seeded. Edit headings, rich text, images, galleries, calls to action, form labels, and SEO. Add/reorder/hide blocks to change the composition while keeping the portfolio design. Create additional pages with a unique slug. `home` maps to `/`; `/home` redirects there.
- **Library:** Manage Projects (Vimeo or YouTube), Services, Clients, and Media. Page relationship fields determine display order.
- **Site Settings:** Admins edit the logo, brand name, navigation, social links, footer, and SEO defaults.
- **Publishing:** Save drafts, inspect version history, and publish when ready. Page Live Preview refreshes after autosave and supports desktop, tablet, and mobile sizes. Preview requires a valid CMS login. Publishing invalidates website caches without a rebuild.
- **Roles:** Editors manage public content and media, including publishing. Admins additionally manage users, site settings, and inquiries. User role escalation is blocked at field level.
- **Inbox:** Inquiries are private to admins. Track new/in-progress/closed status, add notes, and retry failed email notifications.

Media uploads are public portfolio assets, even when referenced from a draft. Do not upload confidential material to this collection.

## Media storage

Use a **Public** Vercel Blob store. The official Payload direct-upload client uses public access; a private-store token will be rejected. Set `BLOB_READ_WRITE_TOKEN` in `.env` and Vercel. The token is server-only; authenticated admin uploads receive scoped upload tokens.

Without a Blob token, development uses the ignored `media/` folder. Production on Vercel fails configuration validation if the Blob token is missing.

If the initial seed ran with local storage:

1. Set the public Blob token.
2. Run `npm run media:sync-blob` from the machine containing `media/`.
3. Stop the app, delete the generated `.next/` directory, then rebuild/restart to clear previously cached local URLs.

The transfer copies original files and generated sizes, preserving filenames and document IDs. It skips already transferred files of the same size and refuses to overwrite a conflicting filename. The seed itself also works directly with Blob when configured before the first import.

`seed/content.json` and `seed/assets/` preserve the source portfolio independently of the old app. `npm run seed` creates missing seed records and leaves existing content unchanged. Re-running the seed restores deleted seed items, so use it intentionally. After CLI seeding, stop the app, delete the generated `.next/` directory, then rebuild/restart. Next.js caches persist across restarts; CLI scripts deliberately skip Next.js revalidation hooks. Content published through the admin automatically invalidates the cache.

## Email and contact endpoint

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, optional `SMTP_FROM`, and `CONTACT_EMAIL` to enable notifications and password-reset email.

`POST /api/contact` accepts firstName, lastName, email, phoneNumber, serviceInterest, otherService, message, and a hidden website honeypot. It validates types/lengths, checks published service choices, and limits each hashed IP to five accepted submissions per ten minutes using an atomic PostgreSQL counter. Inquiries are saved before notification delivery. SMTP failures preserve the inquiry and appear in the inbox; they do not tell the visitor their saved submission failed.

`POST /api/inquiries/:id/retry` is admin-only. Public inquiry CRUD is forbidden. Avoid running contact verification against a live SMTP configuration; the browser test skips email-producing checks when SMTP is configured.

## Migrations and verification

Automatic Drizzle schema push is disabled. After changing collection fields:

```sh
npm run generate:types
npm run generate:importmap
npm run payload -- migrate:create descriptive_name
# Review the generated SQL before applying it.
npm run migrate
npm run typecheck
npm run lint
npm run test:int
npm run build
```

Run `npm run test:e2e` for browser checks. The default uses installed Microsoft Edge and a dev server on port 3001; change the Playwright channel to chromium on another platform and install it with `npx playwright install chromium`. Tests create uniquely named temporary accounts/pages/inquiries and delete only those fixtures. Use a development Neon branch when running them after launch. Screenshots are written to ignored `test-results/`.

Before launch, run the build against the production environment, provision the first real admin, verify Blob uploads and SMTP delivery, then point the Vercel project root at this app. Apply migrations as an explicit release step, not on every request. Keep the old deployment available until the new portfolio has been reviewed.

## Agent guidance

Read `AGENTS.md` and `.agents/skills/payload/SKILL.md` before changing the CMS. The Payload skill was installed by the official scaffolder and applied during implementation. Next.js also supplies version-specific guidance in `node_modules/next/dist/docs/`.

