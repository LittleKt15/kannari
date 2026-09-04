import 'dotenv/config'
import { getPayload } from 'payload'
import { list, put } from '@vercel/blob'
import config from '../src/payload.config'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('Set BLOB_READ_WRITE_TOKEN first.')
const payload = await getPayload({ config })
try {
  const media = await payload.find({
    collection: 'media',
    overrideAccess: true,
    pagination: false,
    depth: 0,
  })
  const existing = new Map<string, number>()
  let cursor: string | undefined
  do {
    const result = await list({ cursor, token: process.env.BLOB_READ_WRITE_TOKEN })
    for (const b of result.blobs) existing.set(b.pathname, b.size)
    cursor = result.hasMore ? result.cursor : undefined
  } while (cursor)
  const files = media.docs.flatMap((m) => [
    { filename: m.filename, mimeType: m.mimeType },
    ...Object.values(m.sizes || {}),
  ])
  let copied = 0
  let skipped = 0
  for (let offset = 0; offset < files.length; offset += 4) {
    await Promise.all(
      files.slice(offset, offset + 4).map(async (f) => {
        if (!f?.filename) return
        const local = path.resolve('media', f.filename)
        if (!local.startsWith(path.resolve('media') + path.sep))
          throw new Error('Invalid media path')
        const buffer = await readFile(local)
        if (existing.has(f.filename)) {
          if (existing.get(f.filename) !== buffer.length)
            throw new Error(`Blob name conflict: ${f.filename}. No file was overwritten.`)
          skipped++
          return
        }
        await put(f.filename, buffer, {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: false,
          contentType: f.mimeType || undefined,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        })
        copied++
      }),
    )
    console.log(`Media transfer: ${copied} uploaded, ${skipped} already present.`)
  }
  console.log(
    'Blob transfer complete; document IDs and filenames preserved. Restart the app to clear cached local URLs.',
  )
} finally {
  await payload.destroy()
}
