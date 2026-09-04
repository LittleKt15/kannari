import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user || !['admin', 'editor'].includes(user.role))
    return new Response('Log into the admin to preview.', { status: 403 })
  const slug = new URL(request.url).searchParams.get('slug') || 'home'
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return new Response('Invalid slug', { status: 400 })
  ;(await draftMode()).enable()
  return Response.redirect(new URL(slug === 'home' ? '/' : `/${slug}`, request.url))
}
