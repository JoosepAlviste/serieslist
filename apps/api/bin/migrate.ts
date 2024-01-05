import { promises as fs } from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { FileMigrationProvider, Migrator } from 'kysely'

import { db } from '#/lib/db'

const dirname = fileURLToPath(new URL('.', import.meta.url))
const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(dirname, '../src/migrations'),
  }),
})

const { error, results } = await migrator.migrateToLatest()

if (!results?.length) {
  console.log('nothing to migrate')
}

results?.forEach((it) => {
  if (it.status === 'Success') {
    console.log(`migration "${it.migrationName}" was executed successfully`)
  } else if (it.status === 'Error') {
    console.error(`failed to execute migration "${it.migrationName}"`)
  }
})

if (error) {
  console.error('failed to migrate')
  console.error(error)
  process.exit(1)
}

await db.destroy()