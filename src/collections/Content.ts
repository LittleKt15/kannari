import type { CollectionConfig } from 'payload'
import { contentAccess } from '../access'
import { refreshContent, refreshDelete } from '../hooks/revalidate'
import { seedKey } from '../fields/seedKey'
const common = {
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: { afterChange: [refreshContent], afterDelete: [refreshDelete] },
}
export const Projects: CollectionConfig = {
  ...common,
  access: contentAccess,
  slug: 'projects',
  admin: { group: 'Library', useAsTitle: 'title' },
  fields: [
    seedKey,
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'videoType', type: 'select', options: ['vimeo', 'youtube'], required: true },
    {
      name: 'videoID',
      type: 'text',
      required: true,
      validate: (v: string | null | undefined) =>
        (!!v && /^[a-zA-Z0-9_-]+$/.test(v)) || 'Enter the video ID only.',
    },
    // Public embed parameter, not an API credential; the browser needs it for playback.
    // payload-doctor-disable-next-line token-field-readable
    { name: 'vimeoHash', type: 'text' },
  ],
}
export const Services: CollectionConfig = {
  ...common,
  access: contentAccess,
  slug: 'services',
  admin: { group: 'Library', useAsTitle: 'title' },
  fields: [
    seedKey,
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'items', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
  ],
}
export const Clients: CollectionConfig = {
  ...common,
  access: contentAccess,
  slug: 'clients',
  admin: { group: 'Library', useAsTitle: 'name' },
  fields: [
    seedKey,
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    { name: 'url', type: 'text' },
  ],
}
