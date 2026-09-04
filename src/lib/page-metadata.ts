import 'server-only'
import type { Metadata } from 'next'
import { getPage, getSettings, siteURL, mediaURL, previewUser } from './content'
export async function pageMetadata(slug: string): Promise<Metadata> {
  const page = await getPage(slug)
  if (!page) return { title: 'Page not found' }
  const settings = await getSettings()
  const url = `${siteURL()}${slug === 'home' ? '' : `/${slug}`}`
  const title = page.seo?.title || `${page.title} | ${settings.brandName}`
  const description = page.seo?.description || settings.defaultDescription || ''
  const image = mediaURL(page.seo?.image)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: image ? [image] : [] },
    robots: (await previewUser()) ? { index: false, follow: false } : undefined,
  }
}
