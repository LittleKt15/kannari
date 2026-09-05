import Link from 'next/link'
import { MoveUpRight } from 'lucide-react'
import { mediaURL } from '@/lib/content'
import type { Page } from '@/payload-types'
export function VideoHeroBlock({
  block: b,
}: {
  block: Extract<NonNullable<Page['layout']>[number], { blockType: 'videoHero' }>
}) {
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
      <h1 className={b.heading ? 'relative pt-48 px-8 text-5xl text-center font-bold' : 'sr-only'}>
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
}
