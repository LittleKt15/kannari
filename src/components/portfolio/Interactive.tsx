'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Project } from '@/payload-types'
type Picture = { src: string; alt: string }
function Modal({
  children,
  close,
  label,
}: {
  children: React.ReactNode
  close: () => void
  label: string
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current!
    const before = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
      before?.focus()
    }
  }, [])
  return (
    <dialog
      ref={ref}
      aria-label={label}
      onCancel={close}
      className="portfolio-dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div className="relative w-full max-w-6xl mx-auto">
        <button
          onClick={close}
          aria-label="Close dialog"
          className="absolute right-2 top-2 z-20 p-3 rounded-full bg-black/80 text-white"
        >
          <X />
        </button>
        {children}
      </div>
    </dialog>
  )
}
export function Gallery({ pictures, aspect }: { pictures: Picture[]; aspect: 'square' | 'video' }) {
  const [index, setIndex] = useState<number | null>(null)
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {pictures.map((p, i) => (
          <button
            key={`${p.src}-${i}`}
            onClick={() => setIndex(i)}
            className={`relative ${aspect === 'video' ? 'aspect-video' : 'aspect-square'} overflow-hidden rounded-lg group`}
            aria-label={`Open ${p.alt}`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </button>
        ))}
      </div>
      {index !== null && pictures[index] && (
        <Modal close={() => setIndex(null)} label="Image gallery">
          <div
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setIndex((index + pictures.length - 1) % pictures.length)
              if (e.key === 'ArrowRight') setIndex((index + 1) % pictures.length)
            }}
          >
            <div className="relative w-full aspect-video">
              <Image
                src={pictures[index].src}
                alt={pictures[index].alt}
                fill
                sizes="95vw"
                className="object-contain"
              />
              <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                <button
                  aria-label="Previous image"
                  className="pointer-events-auto bg-black/80 p-3 rounded-full"
                  onClick={() => setIndex((index + pictures.length - 1) % pictures.length)}
                >
                  <ChevronLeft />
                </button>
                <button
                  aria-label="Next image"
                  className="pointer-events-auto bg-black/80 p-3 rounded-full"
                  onClick={() => setIndex((index + 1) % pictures.length)}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-2 overflow-x-auto py-4">
              {pictures.map((p, i) => (
                <button
                  key={i}
                  aria-label={`View image ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={`relative w-12 h-12 shrink-0 ${i === index ? 'ring-2 ring-white' : 'opacity-60'}`}
                >
                  <Image src={p.src} alt="" fill sizes="48px" className="object-cover" />
                </button>
              ))}
            </div>
            <p className="text-center">
              {index + 1} / {pictures.length}
            </p>
          </div>
        </Modal>
      )}
    </>
  )
}
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null)
  return (
    <>
      <div className="flex flex-wrap justify-center gap-4">
        {projects.map(
          (p) =>
            typeof p.image === 'object' &&
            p.image?.url && (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="relative w-full max-w-[605px] aspect-video group overflow-hidden"
                aria-label={`Play ${p.title}`}
              >
                <Image
                  src={p.image.url}
                  alt={p.image.alt || p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex flex-col items-center justify-center">
                  <strong className="text-xl">{p.title}</strong>
                  <span className="mt-2 text-lg">{p.subtitle}</span>
                </span>
              </button>
            ),
        )}
      </div>
      {selected && (
        <Modal close={() => setSelected(null)} label={selected.title}>
          <div className="bg-[#181818] rounded-lg overflow-hidden">
            <iframe
              className="aspect-video w-full"
              src={
                selected.videoType === 'vimeo'
                  ? `https://player.vimeo.com/video/${encodeURIComponent(selected.videoID)}?autoplay=1&title=0&byline=0&portrait=0${selected.vimeoHash ? `&h=${encodeURIComponent(selected.vimeoHash)}` : ''}`
                  : `https://www.youtube.com/embed/${encodeURIComponent(selected.videoID)}?autoplay=1&rel=0`
              }
              title={selected.title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
            <div className="p-4">
              <h2 className="text-2xl font-bold">{selected.title}</h2>
              <p>{selected.subtitle}</p>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
