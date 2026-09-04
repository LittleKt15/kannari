import { PageView } from '@/components/portfolio/PageView'
import { pageMetadata } from '@/lib/page-metadata'
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return pageMetadata((await params).slug)
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <PageView slug={(await params).slug} />
}
