import Link from 'next/link'
import { MoveUpRight } from 'lucide-react'
import type { Page } from '@/payload-types'
import { Heading } from './Heading'
export function CallToActionBlock({
  block: b,
}: {
  block: Extract<NonNullable<Page['layout']>[number], { blockType: 'callToAction' }>
}) {
  return (
    <section className="section text-center">
      <Heading text={b.heading} />
      <p className="mb-6">{b.description}</p>
      {b.link?.url && (
        <Link
          href={b.link.url}
          className="inline-flex items-center gap-3 text-2xl hover:text-blue-400"
        >
          {b.link.label}
          <MoveUpRight />
        </Link>
      )}
    </section>
  )
}
