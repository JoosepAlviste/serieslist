import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'

import { config } from '@/config'
import { type DB } from '@/generated/db'

const { Pool } = pg

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: config.db.host,
      port: config.db.port,
      database: config.db.db,
      user: config.db.user,
      password: config.db.password,
    }),
  }),
  plugins: [new CamelCasePlugin()],
})