import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { DialectManager, Generator } from 'kysely-codegen'

import { createDbConnection } from './createDbConnection'
import { log } from './logger'

export const generateDatabaseTypes = async () => {
  const db = createDbConnection({
    logger: log,
  })

  const __dirname = fileURLToPath(new URL('.', import.meta.url))

  await new Generator().generate({
    camelCase: true,
    db,
    dialect: new DialectManager().getDialect('postgres'),
    outFile: path.join(__dirname, '..', 'generated', 'db.ts'),
  })

  await db.destroy()

  log.info('database types generated successfully')
}
