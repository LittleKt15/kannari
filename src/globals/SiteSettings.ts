import type { GlobalConfig } from 'payload'
import { adminOnly, published } from '../access'
import { linkFields } from '../blocks'
import { refreshSettings } from '../hooks/revalidate'
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Website' },
  access: { read: published, readVersions: adminOnly, update: adminOnly },
  versions: { drafts: true, max: 20 },
  hooks: { afterChange: [refreshSettings] },
  fields: [
    { name: 'brandName', type: 'text', required: true, defaultValue: 'Kan Nari' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'navigation', type: 'array', fields: linkFields },
    { name: 'socials', type: 'array', fields: linkFields },
    { name: 'footerHeading', type: 'text', defaultValue: 'Book A Call' },
    { name: 'footerDescription', type: 'textarea' },
    { name: 'footerLink', type: 'text', defaultValue: '/contact' },
    { name: 'credit', type: 'text' },
    { name: 'creditURL', type: 'text' },
    { name: 'defaultTitle', type: 'text' },
    { name: 'defaultDescription', type: 'textarea' },
  ],
}
