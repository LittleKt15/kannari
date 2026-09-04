import { test, expect } from '@playwright/test'
import { getPayload, type Payload } from 'payload'
import config from '../../src/payload.config'
import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { list, del } from '@vercel/blob'
import type { User } from '../../src/payload-types'
let payload: Payload
let admin: User
let editor: User
let draftID: number
let token: string
const marker = `verify-${randomUUID()}`
const password = randomUUID() + 'Aa!9'
const context = { skipRevalidation: true }
test.beforeAll(async () => {
  payload = await getPayload({ config })
  admin = await payload.create({
    collection: 'users',
    overrideAccess: true,
    data: {
      name: 'Verification Admin',
      email: `${marker}-admin@example.invalid`,
      password,
      role: 'admin',
    },
  })
  editor = await payload.create({
    collection: 'users',
    overrideAccess: true,
    data: {
      name: 'Verification Editor',
      email: `${marker}-editor@example.invalid`,
      password,
      role: 'editor',
    },
  })
  token = (await payload.login({ collection: 'users', data: { email: editor.email, password } }))
    .token!
  draftID = (
    await payload.create({
      collection: 'pages',
      overrideAccess: true,
      context,
      data: {
        title: 'Verification draft',
        slug: marker,
        layout: [{ blockType: 'intro', heading: 'Private draft heading' }],
        _status: 'draft',
      },
    })
  ).id
})
test.afterAll(async () => {
  if (!payload) return
  if (draftID)
    await payload.delete({ collection: 'pages', id: draftID, overrideAccess: true, context })
  await payload.delete({
    collection: 'media',
    where: { alt: { equals: marker } },
    overrideAccess: true,
  })
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const leftovers = await list({ prefix: marker })
    if (leftovers.blobs.length) await del(leftovers.blobs.map((b) => b.url))
  }
  await payload.delete({
    collection: 'inquiries',
    where: { email: { equals: `${marker}@example.invalid` } },
    overrideAccess: true,
  })
  for (const user of [editor, admin])
    if (user) await payload.delete({ collection: 'users', id: user.id, overrideAccess: true })
  await payload.destroy()
})
test('public portfolio, mobile navigation, and gallery selection', async ({ page, request }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  for (const route of ['/', '/about', '/work', '/services', '/contact']) {
    // Check HTTP separately: a navigation interrupted by dev-server refresh can return null.
    const response = await request.get(route)
    expect(response.status(), `HTTP status for ${route}`).toBe(200)
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(new URL(route, 'http://localhost:3001').href)
    await expect(page.locator('main')).toBeVisible()
  }
  await page.goto('/about')
  const pictures = page.getByRole('button', { name: /^Open Behind/ })
  await pictures.nth(4).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog')).toContainText('5 / 32')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await pictures.nth(1).click()
  await expect(page.getByRole('dialog')).toContainText('2 / 32')
  await page.keyboard.press('Escape')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('navigation').getByRole('link', { name: 'Contact' }).click()
  await expect(page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible()
  await page.screenshot({ path: 'test-results/contact-mobile.png', fullPage: true })
  expect(errors).toEqual([])
})
test('REST permissions, draft privacy, and publish invalidation', async ({ request }) => {
  expect((await request.get('/api/inquiries')).status()).toBe(403)
  expect((await request.post('/api/pages', { data: { title: 'unauthorized' } })).status()).toBe(403)
  expect((await request.get(`/api/pages/${draftID}?draft=true`)).status()).toBe(404)
  expect((await request.get('/preview?slug=home')).status()).toBe(403)
  const auth = { Authorization: `JWT ${token}` }
  expect((await request.get('/api/inquiries', { headers: auth })).status()).toBe(403)
  expect(
    (
      await request.post('/api/users', {
        headers: auth,
        data: { email: 'forbidden@example.invalid', password },
      })
    ).status(),
  ).toBe(403)
  expect(
    (
      await request.post('/api/globals/site-settings', {
        headers: auth,
        data: { brandName: 'forbidden' },
      })
    ).status(),
  ).toBe(403)
  await request.patch(`/api/users/${editor.id}`, { headers: auth, data: { role: 'admin' } })
  expect((await payload.findByID({ collection: 'users', id: editor.id })).role).toBe('editor')
  const update = await request.patch(`/api/pages/${draftID}`, {
    headers: auth,
    data: { _status: 'published' },
  })
  expect(update.ok(), await update.text()).toBeTruthy()
  expect((await request.get(`/${marker}`)).status()).toBe(200)
  await expect((await request.get(`/${marker}`)).text()).resolves.toContain('Private draft heading')
  const edit = await request.patch(`/api/pages/${draftID}?draft=true`, {
    headers: auth,
    data: { layout: [{ blockType: 'intro', heading: 'Unpublished revision' }] },
  })
  expect(edit.ok()).toBeTruthy()
  const publicRead = await request.get(`/api/pages/${draftID}?draft=true`)
  expect(await publicRead.text()).not.toContain('Unpublished revision')
})
test('seed identifiers stay private and immutable through REST', async ({ request }) => {
  const ids: number[] = []
  try {
    const seeded = await payload.create({
      collection: 'services',
      overrideAccess: true,
      context,
      data: { title: marker, seedKey: marker, _status: 'published' },
    })
    ids.push(seeded.id)
    const publicRead = await request.get(`/api/services/${seeded.id}`)
    expect(publicRead.ok()).toBeTruthy()
    expect(await publicRead.json()).not.toHaveProperty('seedKey')
    const headers = { Authorization: `JWT ${token}` }
    const changed = await request.patch(`/api/services/${seeded.id}`, {
      headers,
      data: { title: `${marker}-edited`, seedKey: `${marker}-tampered` },
    })
    expect(changed.ok(), await changed.text()).toBeTruthy()
    expect(await changed.json()).not.toHaveProperty('seedKey')
    const stored = await payload.findByID({
      collection: 'services',
      id: seeded.id,
      overrideAccess: true,
    })
    expect(stored.seedKey).toBe(marker)
    expect(stored.title).toBe(`${marker}-edited`)
    const created = await request.post('/api/services', {
      headers,
      data: { title: `${marker}-created`, seedKey: `${marker}-injected`, _status: 'draft' },
    })
    const body = await created.json()
    if (body.doc?.id) ids.push(body.doc.id)
    expect(created.ok()).toBeTruthy()
    const saved = await payload.findByID({
      collection: 'services',
      id: body.doc.id,
      overrideAccess: true,
    })
    expect(saved.seedKey ?? null).toBeNull()
    for (const collection of ['projects', 'services', 'clients']) {
      expect((await request.post(`/api/${collection}`, { data: { title: marker } })).status()).toBe(
        403,
      )
    }
  } finally {
    for (const id of ids)
      await payload.delete({ collection: 'services', id, overrideAccess: true, context })
  }
})

test('admin dashboard and editable page controls', async ({ page }) => {
  await page.goto('/admin/login')
  await page.locator('input[name="email"]').fill(admin.email)
  await page.locator('input[name="password"]').fill(password)
  await page.getByRole('button', { name: 'Login', exact: true }).click()
  await expect(page.getByRole('heading', { name: /Welcome back/ })).toBeVisible({ timeout: 60000 })
  await page.screenshot({ path: 'test-results/admin-dashboard.png', fullPage: true })
  await page.getByRole('link', { name: /^\/about/ }).click()
  await expect(page.locator('input[name="title"]')).toHaveValue('About')
  await expect(page.getByText('Content', { exact: true }).first()).toBeVisible()
  const preview = await page.goto('/preview?slug=about')
  expect(preview?.status()).toBe(200)
  await expect(page.getByRole('button', { name: 'Preview mode · Exit' })).toBeVisible()
})
test('contact persists when SMTP is absent, validates, and throttles', async ({ request }) => {
  test.skip(
    Boolean(process.env.SMTP_HOST),
    'Do not send real email notifications during verification.',
  )
  const data = {
    firstName: 'Verification',
    lastName: 'Only',
    email: `${marker}@example.invalid`,
    phoneNumber: '123456',
    serviceInterest: 'other',
    otherService: 'Testing',
    message: 'Automated verification; safe to remove.',
    website: '',
  }
  expect(
    (await request.post('/api/contact', { data: { ...data, email: 'invalid' } })).status(),
  ).toBe(400)
  const headers = { 'x-forwarded-for': marker }
  const response = await request.post('/api/contact', { data, headers })
  expect(response.status(), await response.text()).toBe(201)
  const saved = await payload.find({
    collection: 'inquiries',
    where: { email: { equals: data.email } },
    overrideAccess: true,
  })
  expect(saved.docs[0].emailStatus).toBe('failed')
  for (let i = 0; i < 4; i++)
    expect((await request.post('/api/contact', { data, headers })).status()).toBe(201)
  expect((await request.post('/api/contact', { data, headers })).status()).toBe(429)
})

test('authenticated large media uploads go directly to Blob', async ({ page }) => {
  test.skip(!process.env.BLOB_READ_WRITE_TOKEN, 'Requires a public Blob store')
  await page.goto('/admin/login')
  await page.locator('input[name="email"]').fill(admin.email)
  await page.locator('input[name="password"]').fill(password)
  await page.getByRole('button', { name: 'Login', exact: true }).click()
  await expect(page.getByRole('heading', { name: /Welcome back/ })).toBeVisible()
  await page.goto('/admin/collections/media/create')
  await page
    .locator('input[type="file"]')
    .first()
    .setInputFiles({
      name: `${marker}.png`,
      mimeType: 'image/png',
      buffer: await readFile('seed/assets/still_frames/vlcsnap-2025-04-09-18h05m43s758.png'),
    })
  await page.locator('input[name="alt"]').fill(marker)
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/collections\/media\/\d+/, { timeout: 90000 })
  const saved = await payload.find({
    collection: 'media',
    where: { alt: { equals: marker } },
    overrideAccess: true,
  })
  expect(saved.docs[0].filesize).toBeGreaterThan(4.5 * 1024 * 1024)
  expect(saved.docs[0].url).toContain('public.blob.vercel-storage.com')
})
