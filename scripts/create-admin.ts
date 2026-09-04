import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
const {
  ADMIN_EMAIL: email,
  ADMIN_PASSWORD: password,
  ADMIN_NAME: name = 'Kannari Admin',
} = process.env
if (!email || !password || password.length < 12)
  throw new Error(
    'Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in your environment.',
  )
const payload = await getPayload({ config })
const existing = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
  overrideAccess: true,
})
if (!existing.docs.length) {
  await payload.create({
    collection: 'users',
    data: { email, password, name, role: 'admin' },
    overrideAccess: true,
  })
  console.log('Administrator created.')
} else console.log('Account already exists; left unchanged.')
await payload.destroy()
