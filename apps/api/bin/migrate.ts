import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { migrateDatabase } from '@serieslist/core-db'

const dirname = fileURLToPath(new URL('.', import.meta.url))
const prodMigrationFolder = join(dirname, '..', 'drizzle')

await migrateDatabase({
  migrationFolder:
    process.env.NODE_ENV === 'production' ? prodMigrationFolder : undefined,
})
