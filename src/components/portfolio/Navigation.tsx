'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import type { SiteSetting } from '@/payload-types'
export function Navigation({ settings, logo }: { settings: SiteSetting; logo: string }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', scroll)
    return () => window.removeEventListener('scroll', scroll)
  }, [])
  return (
    <nav
      className={`fixed w-full z-40 py-4 transition-all ${open || scrolled ? 'bg-[#181818]/90 backdrop-blur-sm' : 'bg-transparent'}`}
      aria-label="Main navigation"
    >
      <div className="px-6 sm:px-10 md:px-16 flex flex-wrap items-center justify-between">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Image
            src={logo || '/logo.svg'}
            alt=""
            width={96}
            height={96}
            className="h-24 w-auto"
            priority
          />
          <span className="text-[#1485BF] text-xl lg:text-2xl font-bold">{settings.brandName}</span>
        </Link>
        <button
          className="lg:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="site-links"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
        >
          {open ? <X /> : <Menu />}
        </button>
        <div
          id="site-links"
          className={`${open ? 'flex' : 'hidden'} lg:flex w-full lg:w-auto flex-col lg:flex-row gap-6 lg:gap-8 items-end py-4`}
        >
          {settings.navigation?.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              onClick={() => setOpen(false)}
              className="text-lg font-medium hover:text-blue-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
