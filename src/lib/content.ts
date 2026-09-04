import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { draftMode, headers } from 'next/headers'
import type { Media } from '@/payload-types'
export const siteURL = () => process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
export const mediaURL = (media?: number | Media | null) =>
  typeof media === 'object' && media ? media.url || '' : ''
export const mediaAlt = (media?: number | Media | null) =>
  typeof media === 'object' && media ? media.alt : ''
export async function previewUser() {
  if (!(await draftMode()).isEnabled) return null
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  return user && ['admin', 'editor'].includes(user.role) ? user : null
}
const publicPage = unstable_cache(
  async (slug: string) => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 3,
      draft: false,
      user: null,
      overrideAccess: false,
    })
    return result.docs[0] || null
  },
  ['page'],
  { tags: ['portfolio'] },
)
export async function getPage(slug: string) {
  const user = await previewUser()
  if (!user) return publicPage(slug)
  const payload = await getPayload({ config })
  return (
    (
      await payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 3,
        draft: true,
        user,
        overrideAccess: false,
      })
    ).docs[0] || null
  )
}
export const getSettings = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    return payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
      draft: false,
      user: null,
      overrideAccess: false,
    })
  },
  ['settings'],
  { tags: ['portfolio'] },
)
export const getServices = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    return (
      await payload.find({
        collection: 'services',
        limit: 100,
        draft: false,
        user: null,
        overrideAccess: false,
      })
    ).docs
  },
  ['services'],
  { tags: ['portfolio'] },
)
