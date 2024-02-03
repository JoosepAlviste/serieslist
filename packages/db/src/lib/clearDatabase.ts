import { sql } from 'drizzle-orm'

import { createDbConnection } from './createDbConnection'
import { log } from './logger'

export const clearDatabase = async () => {
  const { db, client } = await createDbConnection({ logger: log })

  const tables = await db.execute<{ tablename: string }>(
    sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
  )

  const tablesToTruncate = tables.rows
  for (const { tablename } of tablesToTruncate) {
    await db.execute(
      sql`TRUNCATE TABLE "public"."${sql.raw(tablename)}" CASCADE`,
    )
  }

  // Destroy the connection so that it wouldn't keep the tests running because
  // of a floating promise
  await client.end()
}
