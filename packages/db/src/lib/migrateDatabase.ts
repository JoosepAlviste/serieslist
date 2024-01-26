import { promises as fs } from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { FileMigrationProvider, Migrator } from 'kysely'

import { createDbConnection } from './createDbConnection'
import { log } from './logger'

const dirname = fileURLToPath(new URL('.', import.meta.url))

export const migrateDatabase = async ({
  migrationFolder,
}: {
  migrationFolder?: string
} = {}) => {
  const db = createDbConnection({ logger: log })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder:
        migrationFolder ?? path.join(dirname, '..', 'migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  if (!results?.length) {
    log.info('nothing to migrate')
  }

  results?.forEach((it) => {
    if (it.status === 'Success') {
      log.info(
        { migration: it.migrationName },
        'migration was executed successfully',
      )
    } else if (it.status === 'Error') {
      log.error({ migration: it.migrationName }, 'failed to execute migration')
    }
  })

  if (error) {
    log.error(error, 'failed to migrate')
    process.exit(1)
  }

  await db.destroy()
}
