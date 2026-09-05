import { mediaURL, mediaAlt } from '@/lib/content'
import { Gallery } from '../Interactive'
import type { Page } from '@/payload-types'
import { Heading } from './Heading'
export function GalleryBlock({
  block: b,
}: {
  block: Extract<NonNullable<Page['layout']>[number], { blockType: 'gallery' }>
}) {
  const pictures = []
  for (const item of b.images || []) {
    const src = mediaURL(item.image)
    if (src && item.id) pictures.push({ id: item.id, src, alt: mediaAlt(item.image) })
  }
  return (
    <section className="section max-w-6xl mx-auto">
      <Heading text={b.heading} />
      <Gallery aspect={b.aspect || 'square'} pictures={pictures} />
    </section>
  )
}
