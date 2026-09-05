import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Page } from '@/payload-types'
import { Heading } from './Heading'
export function IntroBlock({
  block: b,
}: {
  block: Extract<NonNullable<Page['layout']>[number], { blockType: 'intro' }>
}) {
  return (
    <section className="section max-w-6xl mx-auto">
      <Heading text={b.heading} />
      {b.body && (
        <RichText
          data={b.body}
          className="rich-text text-center text-gray-300 text-base sm:text-lg"
        />
      )}
    </section>
  )
}
