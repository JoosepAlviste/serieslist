import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'

import { config } from '@/config'

const { Pool } = pg

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Database {}

export const db = new Kysely<Database>({
  // Use MysqlDialect for MySQL and SqliteDialect for SQLite.
  dialect: new PostgresDialect({
    pool: new Pool({
      host: 'localhost',
      port: config.db.port,
      database: config.db.db,
      user: config.db.user,
      password: config.db.password,
    }),
  }),
})
