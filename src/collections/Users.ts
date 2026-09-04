import type { CollectionConfig } from 'payload'
import { adminOnly, adminField } from '../access'
export const Users: CollectionConfig = {
  slug: 'users',
  auth: { maxLoginAttempts: 5, lockTime: 600000 },
  admin: { useAsTitle: 'name', group: 'Administration' },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (
          operation === 'create' &&
          (await req.payload.count({ collection: 'users', req, overrideAccess: true }))
            .totalDocs === 0
        )
          data.role = 'admin'
        return data
      },
    ],
  },
  access: {
    admin: ({ req }) => ['admin', 'editor'].includes(req.user?.role ?? ''),
    create: adminOnly,
    delete: adminOnly,
    read: ({ req }) =>
      req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false,
    update: ({ req }) =>
      req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: ['admin', 'editor'],
      saveToJWT: true,
      access: { create: adminField, update: adminField },
    },
  ],
}
