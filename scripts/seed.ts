import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import path from 'node:path'
import data from '../seed/content.json'
import type { Page } from '../src/payload-types'
const payload = await getPayload({ config })
const context = { skipRevalidation: true }
const media = new Map<string, number>()
async function upload(src: string, alt: string) {
  if (media.has(src)) return media.get(src)!
  const existing = await payload.find({
    collection: 'media',
    where: { seedKey: { equals: src } },
    limit: 1,
    overrideAccess: true,
  })
  const doc =
    existing.docs[0] ||
    (await payload.create({
      collection: 'media',
      overrideAccess: true,
      filePath: path.resolve('seed/assets', `.${src}`),
      data: { alt, seedKey: src },
      context,
    }))
  media.set(src, doc.id)
  return doc.id
}
function rich(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      version: 1,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        version: 1,
        direction: 'ltr',
        format: '',
        indent: 0,
        children: [
          { type: 'text', version: 1, text, format: 0, detail: 0, mode: 'normal', style: '' },
        ],
      })),
    },
  }
}
try {
  const clients: number[][] = []
  for (const group of [data.logos1, data.logos2]) {
    const ids: number[] = []
    for (const item of group) {
      const found = await payload.find({
        collection: 'clients',
        where: { seedKey: { equals: item.name } },
        overrideAccess: true,
        limit: 1,
      })
      const doc =
        found.docs[0] ||
        (await payload.create({
          collection: 'clients',
          overrideAccess: true,
          context,
          data: {
            name: item.name,
            seedKey: item.name,
            logo: await upload(item.url, item.name),
            _status: 'published',
          },
        }))
      ids.push(doc.id)
    }
    clients.push(ids)
  }
  const projects: number[] = []
  for (const item of data.projects) {
    const found = await payload.find({
      collection: 'projects',
      where: { seedKey: { equals: item.id } },
      overrideAccess: true,
      limit: 1,
    })
    const doc =
      found.docs[0] ||
      (await payload.create({
        collection: 'projects',
        overrideAccess: true,
        context,
        data: {
          seedKey: item.id,
          title: item.title,
          subtitle: item.subtitle,
          image: await upload(item.imageSrc, item.title),
          videoType: item.videoType as 'vimeo' | 'youtube',
          videoID: item.vimeoId || item.youtubeId!,
          vimeoHash: item.vimeoHash,
          _status: 'published',
        },
      }))
    projects.push(doc.id)
  }
  const services: number[] = []
  for (const item of data.services) {
    const found = await payload.find({
      collection: 'services',
      where: { seedKey: { equals: item.category } },
      overrideAccess: true,
      limit: 1,
    })
    const doc =
      found.docs[0] ||
      (await payload.create({
        collection: 'services',
        overrideAccess: true,
        context,
        data: {
          seedKey: item.category,
          title: item.category,
          items: item.items.map((label) => ({ label })),
          _status: 'published',
        },
      }))
    services.push(doc.id)
  }
  const gallery = async (items: { src: string; alt: string }[]) => {
    const result = []
    for (const i of items) result.push({ image: await upload(i.src, i.alt) })
    return result
  }
  const pages: { title: string; slug: string; layout: Page['layout'] }[] = [
    {
      title: 'Home',
      slug: 'home',
      layout: [
        {
          blockType: 'videoHero',
          video: await upload('/Interview_Demo.mp4', 'Interview demo reel'),
          links: [
            { label: 'View Work', url: '/work' },
            { label: 'About Us', url: '/about' },
          ],
        },
        {
          blockType: 'intro',
          heading: 'Welcome to Kan Nari Production!',
          body: rich(data.homeText),
        },
        {
          blockType: 'clientCarousel',
          rows: [
            { direction: 'left', clients: clients[0] },
            { direction: 'right', clients: clients[1] },
          ],
        },
      ],
    },
    {
      title: 'About',
      slug: 'about',
      layout: [
        {
          blockType: 'textImage',
          heading: 'About Us',
          body: rich(data.aboutText),
          image: await upload('/about.jpg', 'Win Khant Maung'),
          showSocials: true,
          imagePosition: 'right',
        },
        { blockType: 'gallery', aspect: 'square', images: await gallery(data.aboutGallery) },
      ],
    },
    {
      title: 'Work',
      slug: 'work',
      layout: [{ blockType: 'projectGrid', heading: 'Our Work', projects }],
    },
    {
      title: 'Services',
      slug: 'services',
      layout: [
        {
          blockType: 'intro',
          heading: 'What We Can Offer',
          body: rich(['Services', data.servicesText]),
        },
        { blockType: 'serviceGrid', services },
        { blockType: 'gallery', aspect: 'video', images: await gallery(data.serviceGallery) },
      ],
    },
    {
      title: 'Contact',
      slug: 'contact',
      layout: [
        {
          blockType: 'contactForm',
          heading: 'Get In Touch',
          body: rich(data.contactText),
          successMessage: 'Thank you! Your message has been received.',
        },
      ],
    },
  ]
  for (const page of pages) {
    const found = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      overrideAccess: true,
      limit: 1,
    })
    if (!found.docs.length)
      await payload.create({
        collection: 'pages',
        overrideAccess: true,
        context,
        data: { ...page, _status: 'published' },
      })
  }
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
  if (!settings.navigation?.length)
    await payload.updateGlobal({
      slug: 'site-settings',
      overrideAccess: true,
      context,
      data: {
        brandName: 'Kan Nari',
        logo: await upload('/logo.svg', 'Kan Nari logo'),
        navigation: pages.map((p) => ({
          label: p.title,
          url: p.slug === 'home' ? '/' : `/${p.slug}`,
        })),
        socials: [
          { label: 'Facebook', url: 'https://www.facebook.com/kannari.co' },
          { label: 'Instagram', url: 'https://www.instagram.com/kannari.co' },
          { label: 'Vimeo', url: 'https://vimeo.com/winkhantmg' },
          { label: 'LinkedIn', url: 'https://www.linkedin.com/in/winkhantmg' },
        ],
        footerHeading: 'Book A Call',
        footerDescription: 'Frame Your Ideas: Schedule a Free 15-Minute Consultation',
        footerLink: '/contact',
        credit: 'Powered By Loose Cannon Solutions',
        defaultTitle: 'Kannari - Professional Video Production & Creative Services',
        defaultDescription:
          'Based in the Greater Washington Area, Kannari Production specializes in videography, crafting compelling visual narratives for businesses, causes, and creative visions.',
        _status: 'published',
      },
    })
  console.log(
    `Portfolio seeded: 5 pages, ${projects.length} projects, 21 clients, 3 services. Existing records preserved.`,
  )
} finally {
  await payload.destroy()
}
