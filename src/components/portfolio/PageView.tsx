import { notFound } from 'next/navigation'
import { getPage, getSettings, getServices, siteURL, previewUser } from '@/lib/content'
import { Blocks } from './Blocks'
import { Preview } from './Preview'
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
      {user && <Preview serverURL={siteURL()} />}
    </main>
  )
}
