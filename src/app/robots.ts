import type { MetadataRoute } from 'next'
import { siteURL } from '@/lib/content'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/preview', '/exit-preview'],
    },
    sitemap: `${siteURL()}/sitemap.xml`,
  }
}
