import type { CollectionConfig } from 'payload'
import { contentAccess } from '../access'
import { blocks } from '../blocks'
import { refreshContent, refreshDelete } from '../hooks/revalidate'
export const Pages: CollectionConfig = {
  slug: 'pages',
  access: contentAccess,
  admin: {
    useAsTitle: 'title',
    group: 'Website',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    preview: (doc) => `/preview?slug=${encodeURIComponent(String(doc.slug))}`,
    livePreview: { url: ({ data }) => `/preview?slug=${encodeURIComponent(String(data.slug))}` },
  },
  versions: { drafts: { autosave: { interval: 1000 } }, maxPerDoc: 30 },
  hooks: { afterChange: [refreshContent], afterDelete: [refreshDelete] },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      validate: (value: string | null | undefined) =>
        (!!value &&
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) &&
          !['admin', 'api', 'preview', 'exit-preview', 'sitemap', 'robots'].includes(value)) ||
        'Use a unique lowercase slug without reserved routes.',
    },
    {
      type: 'tabs',
      tabs: [
        { label: 'Content', fields: [{ name: 'layout', type: 'blocks', blocks, required: true }] },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'description', type: 'textarea', maxLength: 300 },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
