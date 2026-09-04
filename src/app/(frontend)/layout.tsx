import React from 'react'
import Link from 'next/link'
import { Raleway } from 'next/font/google'
import { MoveUpRight } from 'lucide-react'
import { Navigation } from '@/components/portfolio/Navigation'
import { getSettings, mediaURL, siteURL } from '@/lib/content'
import './globals.css'
const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway', display: 'swap' })
export async function generateMetadata() {
  const s = await getSettings()
  return {
    metadataBase: new URL(siteURL()),
    title: s.defaultTitle,
    description: s.defaultDescription,
    icons: { icon: '/logo.svg' },
  }
}
export default async function Layout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <html lang="en" className={raleway.variable}>
      <body className="bg-[#181818] text-white font-raleway">
        <a href="#main" className="sr-only focus:not-sr-only fixed z-50 bg-black p-4">
          Skip to content
        </a>
        <Navigation settings={settings} logo={mediaURL(settings.logo)} />
        {children}
        <footer className="px-6 py-12 text-center">
          <Link
            href={settings.footerLink || '/contact'}
            className="inline-flex items-center gap-4 text-[2.5rem] hover:text-blue-400"
          >
            <span>{settings.footerHeading}</span>
            <MoveUpRight size={32} />
          </Link>
          <p className="mt-6 text-lg">{settings.footerDescription}</p>
          <div className="flex justify-center flex-wrap gap-6 mt-12">
            {settings.socials?.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400"
              >
                {s.label}
              </a>
            ))}
          </div>
          <p className="mt-8 text-sm text-gray-300">
            {settings.creditURL ? (
              <a href={settings.creditURL}>{settings.credit}</a>
            ) : (
              settings.credit
            )}{' '}
            &copy; {new Date().getFullYear()}
          </p>
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: settings.brandName,
              url: siteURL(),
              logo: mediaURL(settings.logo),
              sameAs: settings.socials?.map((s) => s.url),
            }).replace(/</g, '\\u003c'),
          }}
        />
      </body>
    </html>
  )
}
