import Image from 'next/image'
import Link from 'next/link'
import { MoveUpRight } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Page, SiteSetting, Project, Service, Client } from '@/payload-types'
import { mediaURL, mediaAlt } from '@/lib/content'
import { Gallery, ProjectGrid } from './Interactive'
import { ContactForm } from './ContactForm'
type LayoutBlock = NonNullable<Page['layout']>[number]
const titleClass =
  'text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400'
function Heading({ text }: { text?: string | null }) {
  return text ? <h2 className={titleClass}>{text}</h2> : null
}
export function Blocks({
  layout,
  settings,
  services,
}: {
  layout: Page['layout']
  settings: SiteSetting
  services: Service[]
}) {
  return (
    <>
      {layout
        ?.filter((block) => !block.hidden)
        .map((block, i) => (
          <Block key={block.id || i} block={block} settings={settings} services={services} />
        ))}
    </>
  )
}
function Block({
  block: b,
  settings,
  services,
}: {
  block: LayoutBlock
  settings: SiteSetting
  services: Service[]
}) {
  switch (b.blockType) {
    case 'videoHero':
      return (
        <section className="relative min-h-screen w-full overflow-hidden bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={mediaURL(b.poster)}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={mediaURL(b.video)} />
          </video>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-x-6 sm:inset-x-16 top-32 bottom-32 pointer-events-none">
            {[
              'top-0 left-0 border-t-2 border-l-2',
              'top-0 right-0 border-t-2 border-r-2',
              'bottom-0 left-0 border-b-2 border-l-2',
              'bottom-0 right-0 border-b-2 border-r-2',
            ].map((c) => (
              <div key={c} className={`absolute w-16 h-16 md:w-20 md:h-20 border-white ${c}`} />
            ))}
            <span className="absolute top-3 right-3 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
              REC
            </span>
          </div>
          <h1
            className={b.heading ? 'relative pt-48 px-8 text-5xl text-center font-bold' : 'sr-only'}
          >
            {b.heading || 'Kan Nari Production'}
          </h1>
          <div className="absolute bottom-10 md:bottom-16 inset-x-6 md:inset-x-16 flex justify-between items-end gap-4">
            {b.links?.map((l, i) => (
              <Link
                key={l.id}
                href={l.url}
                className={`flex items-center gap-3 hover:text-blue-400 ${i ? 'text-xl md:text-2xl' : 'text-3xl md:text-5xl'}`}
              >
                {l.label}
                <MoveUpRight />
              </Link>
            ))}
          </div>
        </section>
      )
    case 'intro':
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
    case 'textImage':
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
            <div className="relative flex-1 min-h-[300px] md:min-h-[600px] order-1 md:order-2">
              <Image
                src={mediaURL(b.image)}
                alt={mediaAlt(b.image)}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-lg"
              />
            </div>
          )}
        </section>
      )
    case 'clientCarousel':
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
    case 'projectGrid':
      return (
        <section className="section px-2 md:px-6">
          <Heading text={b.heading} />
          <ProjectGrid
            projects={(b.projects || []).filter((p): p is Project => typeof p === 'object')}
          />
        </section>
      )
    case 'serviceGrid':
      return (
        <section className="section max-w-6xl mx-auto">
          <Heading text={b.heading} />
          <div className="grid md:grid-cols-3 gap-8">
            {(b.services || [])
              .filter((s): s is Service => typeof s === 'object')
              .map((s) => (
                <div
                  key={s.id}
                  className="border border-gray-700 p-8 rounded-xl bg-[#1f1f1f] hover:border-gray-500"
                >
                  <h3 className="text-2xl font-bold mb-6">{s.title}</h3>
                  {s.description && <p className="mb-4 text-gray-300">{s.description}</p>}
                  <ul className="space-y-3">
                    {s.items?.map((item) => (
                      <li key={item.id} className="text-gray-300 flex gap-3">
                        <span aria-hidden="true">•</span>
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </section>
      )
    case 'gallery':
      return (
        <section className="section max-w-6xl mx-auto">
          <Heading text={b.heading} />
          <Gallery
            aspect={b.aspect || 'square'}
            pictures={(b.images || [])
              .map((item) => ({ src: mediaURL(item.image), alt: mediaAlt(item.image) }))
              .filter((i) => i.src)}
          />
        </section>
      )
    case 'callToAction':
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
    case 'contactForm':
      return (
        <section className="section max-w-3xl mx-auto">
          <Heading text={b.heading} />
          {b.body && (
            <RichText data={b.body} className="rich-text text-center text-gray-300 mb-12" />
          )}
          <ContactForm
            services={services.map((s) => s.title)}
            labels={b.labels}
            successMessage={b.successMessage}
          />
        </section>
      )
  }
}
