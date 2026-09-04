import 'dotenv/config'
import pg from 'pg'
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 15000,
})
try {
  await client.connect()
  const { rows } = await client.query(
    "SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog','information_schema') ORDER BY table_schema, table_name",
  )
  console.log(JSON.stringify(rows, null, 2))
} catch {
  console.error('Database connection failed. Check DATABASE_URL and network access.')
  process.exitCode = 1
} finally {
  await client.end()
}
