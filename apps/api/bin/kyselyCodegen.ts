import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { DialectManager, Generator } from 'kysely-codegen'

import { db } from '#/lib/db'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

void new Generator().generate({
  camelCase: true,
  db,
  dialect: new DialectManager().getDialect('postgres'),
  outFile: path.join(__dirname, '../src/generated/db.ts'),
})
