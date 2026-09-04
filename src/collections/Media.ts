import type { CollectionConfig } from 'payload'
import path from 'node:path'
import { staff } from '../access'
import { seedKey } from '../fields/seedKey'
export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Library', useAsTitle: 'alt' },
  // Portfolio files are public, including draft uploads; all mutations require staff.
  // payload-doctor-disable-next-line open-access-function
  access: { read: () => true, create: staff, update: staff, delete: staff },
  upload: {
    staticDir: path.resolve('media'),
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 900 },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'textarea' },
    { ...seedKey, index: true },
  ],
}
