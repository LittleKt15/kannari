import type { TextField } from 'payload'

// Internal identity for idempotent imports. Only trusted Local API operations
// using overrideAccess: true may read or change it, including for admins.
export const seedKey: TextField = {
  name: 'seedKey',
  type: 'text',
  unique: true,
  admin: { hidden: true },
  access: { read: () => false, create: () => false, update: () => false },
}
