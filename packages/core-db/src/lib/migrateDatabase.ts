import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { migrate } from 'drizzle-orm/postgres-js/migrator'

import { createDbConnection } from './createDbConnection'
import { log } from './logger'

const dirname = fileURLToPath(new URL('.', import.meta.url))

export const migrateDatabase = async ({
  migrationFolder,
}: {
  migrationFolder?: string
} = {}) => {
  const { db, pool } = createDbConnection({ logger: log })

  await migrate(db, {
    migrationsFolder: migrationFolder ?? path.join(dirname, '..', 'drizzle'),
  })

  await pool.end()
}
