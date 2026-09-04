import type { CollectionConfig } from 'payload'
import path from 'node:path'
import { staff } from '../access'
export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Library', useAsTitle: 'alt' },
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
    {
      name: 'seedKey',
      type: 'text',
      unique: true,
      index: true,
      admin: { hidden: true },
      access: { update: () => false },
    },
  ],
}
