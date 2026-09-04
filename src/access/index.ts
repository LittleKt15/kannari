import type { Access, FieldAccess } from 'payload'
export const adminOnly: Access = ({ req }) => req.user?.role === 'admin'
export const staff: Access = ({ req }) => ['admin', 'editor'].includes(req.user?.role ?? '')
export const adminField: FieldAccess = ({ req }) => req.user?.role === 'admin'
export const published: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }
export const contentAccess = {
  read: published,
  readVersions: staff,
  create: staff,
  update: staff,
  delete: staff,
}
