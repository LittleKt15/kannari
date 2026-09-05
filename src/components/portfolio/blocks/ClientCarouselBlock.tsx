import Image from 'next/image'
import { mediaURL } from '@/lib/content'
import type { Page, Client } from '@/payload-types'
import { Heading } from './Heading'
export function ClientCarouselBlock({
  block: b,
}: {
  block: Extract<NonNullable<Page['layout']>[number], { blockType: 'clientCarousel' }>
}) {
  return (
    <section className="py-10 bg-white text-black overflow-hidden">
      <Heading text={b.heading} />
      {b.rows?.map((row) => {
        const clients = (row.clients || []).filter((c): c is Client => typeof c === 'object')
        return (
          <div key={row.id} className="logo-window max-w-6xl mx-auto overflow-hidden">
            <div className={`logo-track ${row.direction === 'right' ? 'reverse' : ''}`}>
              {[0, 1].map((copy) => (
                <div className="logo-set" key={copy} aria-hidden={copy === 1}>
                  {clients.map(
                    (c) =>
                      mediaURL(c.logo) && (
                        <div
                          key={c.id}
                          className="relative shrink-0 w-[140px] h-[100px] md:w-[168px] md:h-[120px]"
                        >
                          {c.url ? (
                            <a href={c.url} tabIndex={copy ? -1 : undefined}>
                              <Image
                                src={mediaURL(c.logo)}
                                alt={c.name}
                                fill
                                sizes="168px"
                                className="object-contain p-6"
                              />
                            </a>
                          ) : (
                            <Image
                              src={mediaURL(c.logo)}
                              alt={c.name}
                              fill
                              sizes="168px"
                              className="object-contain p-6"
                            />
                          )}
                        </div>
                      ),
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}
