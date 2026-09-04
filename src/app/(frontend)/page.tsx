import { PageView } from '@/components/portfolio/PageView'
import { pageMetadata } from '@/lib/page-metadata'
export const generateMetadata = () => pageMetadata('home')
export default function Home() {
  return <PageView slug="home" />
}
