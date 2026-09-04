import { expect, test, vi } from 'vitest'

const state = vi.hoisted(() => ({
  records: new Map<string, Array<Record<string, unknown>>>(),
  settings: {} as Record<string, unknown>,
  queries: [] as string[],
  writes: 0,
  nextID: 1,
}))

vi.mock('../../src/payload.config', () => ({ default: {} }))
vi.mock('payload', () => ({
  getPayload: async () => ({
    find: async ({ collection }: { collection: string }) => {
      state.queries.push(collection)
      return { docs: state.records.get(collection) || [] }
    },
    create: async ({ collection, data }: { collection: string; data: Record<string, unknown> }) => {
      const rows = state.records.get(collection) || []
      const record = { ...data, id: state.nextID++ }
      rows.push(record)
      state.records.set(collection, rows)
      state.writes++
      return record
    },
    findGlobal: async () => state.settings,
    updateGlobal: async ({ data }: { data: Record<string, unknown> }) => {
      state.settings = data
      state.writes++
      return data
    },
    destroy: async () => undefined,
  }),
}))

test('seed batches lookups and preserves edited content on a second run', async () => {
  state.records.clear()
  state.settings = {}
  state.queries = []
  state.writes = 0
  state.nextID = 1
  await import('../../scripts/seed')
  expect(state.queries.sort()).toEqual(['clients', 'media', 'pages', 'projects', 'services'])
  expect(state.records.get('pages')).toHaveLength(5)
  expect(state.records.get('projects')).toHaveLength(8)
  expect(state.records.get('services')).toHaveLength(3)
  for (const collection of ['clients', 'media', 'projects', 'services']) {
    const rows = state.records.get(collection)!
    expect(new Set(rows.map((row) => row.seedKey)).size).toBe(rows.length)
  }

  const page = state.records.get('pages')![0]
  page.title = 'Editor-written title'
  page.layout = [{ blockType: 'intro', heading: 'Do not overwrite' }]
  const before = JSON.stringify([...state.records])
  const writes = state.writes
  state.queries = []
  vi.resetModules()
  await import('../../scripts/seed')
  expect(state.queries.sort()).toEqual(['clients', 'media', 'pages', 'projects', 'services'])
  expect(state.writes).toBe(writes)
  expect(JSON.stringify([...state.records])).toBe(before)
})
