import { getPayload } from 'payload'
import config from '@payload-config'
import { createHash } from 'node:crypto'
import { sql } from '@payloadcms/db-postgres/drizzle'
import { validateContact } from '@/lib/contact-validation'
import { deliverInquiry } from '@/lib/email'
export async function POST(request: Request) {
  try {
    const body = await request.text()
    if (body.length > 12000) return Response.json({ error: 'Form is too large.' }, { status: 413 })
    const raw = JSON.parse(body)
    if (raw.website) return Response.json({ success: true })
    let data
    try {
      data = validateContact(raw)
    } catch (e) {
      return Response.json({ error: (e as Error).message }, { status: 400 })
    }
    const payload = await getPayload({ config })
    const services = await payload.find({
      collection: 'services',
      overrideAccess: false,
      user: null,
      limit: 100,
      depth: 0,
    })
    if (
      data.serviceInterest !== 'other' &&
      !services.docs.some((s) => s.title === data.serviceInterest)
    )
      return Response.json({ error: 'Select a listed service.' }, { status: 400 })
    const ip =
      request.headers
        .get(process.env.VERCEL ? 'x-vercel-forwarded-for' : 'x-forwarded-for')
        ?.split(',')[0]
        ?.trim() || 'local'
    const key = createHash('sha256').update(`${process.env.PAYLOAD_SECRET}:${ip}`).digest('hex')
    // One atomic counter shared across serverless instances; no in-memory rate limits.
    const result = await payload.db.drizzle.execute(
      sql`INSERT INTO rate_limits (key, hits, expires_at) VALUES (${key}, 1, NOW() + INTERVAL '10 minutes') ON CONFLICT (key) DO UPDATE SET hits = CASE WHEN rate_limits.expires_at < NOW() THEN 1 ELSE rate_limits.hits + 1 END, expires_at = CASE WHEN rate_limits.expires_at < NOW() THEN NOW() + INTERVAL '10 minutes' ELSE rate_limits.expires_at END RETURNING hits`,
    )
    if (Number(result.rows[0]?.hits) > 5)
      return Response.json(
        { error: 'Please wait a few minutes before sending another inquiry.' },
        { status: 429 },
      )
    // Validated, allowlisted contact data only. Direct public inquiry CRUD remains denied.
    // payload-doctor-disable-next-line local-api-override-access
    const inquiry = await payload.create({ collection: 'inquiries', overrideAccess: true, data })
    await deliverInquiry(payload, inquiry.id).catch(() =>
      payload.logger.error('Inquiry saved; notification status update failed.'),
    )
    return Response.json({ success: true }, { status: 201 })
  } catch {
    return Response.json(
      { error: 'We could not save your message. Please try again.' },
      { status: 500 },
    )
  }
}
