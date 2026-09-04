import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { siteURL } from '@/lib/content'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'pages',
    overrideAccess: false,
    user: null,
    draft: false,
    depth: 0,
    pagination: false,
  })
  return pages.docs.map((p) => ({
    url: `${siteURL()}${p.slug === 'home' ? '' : `/${p.slug}`}`,
    lastModified: p.updatedAt,
  }))
}
