import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access'
import { deliverInquiry } from '../lib/email'
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    group: 'Administration',
    useAsTitle: 'email',
    defaultColumns: ['email', 'serviceInterest', 'status', 'emailStatus', 'createdAt'],
  },
  access: { read: adminOnly, create: () => false, update: adminOnly, delete: adminOnly },
  endpoints: [
    {
      path: '/:id/retry',
      method: 'post',
      handler: async (req) => {
        if (req.user?.role !== 'admin')
          return Response.json({ error: 'Forbidden' }, { status: 403 })
        const id = Number(req.routeParams?.id)
        if (!Number.isInteger(id)) return Response.json({ error: 'Invalid ID' }, { status: 400 })
        await deliverInquiry(req.payload, id)
        return Response.json({ success: true })
      },
    },
  ],
  fields: [
    ...['firstName', 'lastName', 'email', 'phoneNumber', 'serviceInterest'].map((name) => ({
      name,
      type: 'text' as const,
      required: true,
      admin: { readOnly: true },
    })),
    { name: 'otherService', type: 'text', admin: { readOnly: true } },
    { name: 'message', type: 'textarea', required: true, admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      options: ['new', 'in-progress', 'closed'],
      defaultValue: 'new',
    },
    { name: 'notes', type: 'textarea' },
    {
      name: 'emailStatus',
      type: 'select',
      options: ['pending', 'sent', 'failed'],
      defaultValue: 'pending',
      admin: { readOnly: true },
    },
    { name: 'emailError', type: 'text', admin: { readOnly: true } },
    {
      name: 'retryEmail',
      type: 'ui',
      admin: { components: { Field: '/components/admin/RetryEmail#RetryEmail' } },
    },
  ],
}
export const RateLimits: CollectionConfig = {
  slug: 'rate-limits',
  admin: { hidden: true },
  timestamps: false,
  access: { read: () => false, create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'key', type: 'text', unique: true, required: true },
    { name: 'hits', type: 'number', required: true },
    { name: 'expiresAt', type: 'date', required: true },
  ],
}
