import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPage, getSettings, getServices, mediaURL, siteURL, previewUser } from '@/lib/content'
import { Blocks } from './Blocks'
import { Preview } from './Preview'
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
export async function PageView({ slug }: { slug: string }) {
  const [page, settings, services, user] = await Promise.all([
    getPage(slug),
    getSettings(),
    getServices(),
    previewUser(),
  ])
  if (!page) notFound()
  const hero = page.layout?.find((b) => !b.hidden)?.blockType === 'videoHero'
  return (
    <main id="main" className={hero ? '' : 'pt-32 min-h-screen'}>
      {!hero && <h1 className="sr-only">{page.title}</h1>}
      <Blocks layout={page.layout} settings={settings} services={services} />
      {user && <Preview />}
    </main>
  )
}
