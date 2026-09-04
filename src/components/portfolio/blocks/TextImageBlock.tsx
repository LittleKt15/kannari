import Image from 'next/image'
import { MoveUpRight } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { mediaURL, mediaAlt } from '@/lib/content'
import type { Page, SiteSetting } from '@/payload-types'
import { Heading } from './Heading'
export function TextImageBlock({
  block: b,
  settings,
}: {
  block: Extract<NonNullable<Page['layout']>[number], { blockType: 'textImage' }>
  settings: SiteSetting
}) {
  return (
    <section
      className={`section max-w-6xl mx-auto flex flex-col md:flex-row gap-8 ${b.imagePosition === 'left' ? 'md:flex-row-reverse' : ''}`}
    >
      <div className="flex-1 order-2 md:order-1">
        <Heading text={b.heading} />
        {b.body && (
          <RichText data={b.body} className="rich-text text-gray-300 text-base sm:text-lg" />
        )}
        {b.showSocials && (
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
            <div className="flex flex-col gap-3">
              {settings.socials?.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 flex items-center gap-3"
                >
                  {s.label}
                  <MoveUpRight size={16} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      {mediaURL(b.image) && (
        <div className="relative flex-none md:flex-1 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] mb-6 md:mb-0 order-1 md:order-2">
          <Image
            src={mediaURL(b.image)}
            alt={mediaAlt(b.image)}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
            loading="eager"
            className="object-cover rounded-lg shadow-lg"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg pointer-events-none"
          />
        </div>
      )}
    </section>
  )
}
