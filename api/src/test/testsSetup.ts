import { sql } from 'kysely'
import { beforeAll } from 'vitest'

import { db } from '@/lib/db'

const clearDatabase = async () => {
  const tables = await sql<{
    tablename: string
  }>`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`.execute(db)

  const tablesToTruncate = tables.rows.filter(
    (table) => !table.tablename.startsWith('kysely_'),
  )
  for (const { tablename } of tablesToTruncate) {
    await sql`TRUNCATE TABLE "public"."${sql.raw(tablename)}" CASCADE`.execute(
      db,
    )
  }
}

beforeAll(async () => {
  await clearDatabase()
})
