import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'
import { type Logger } from 'pino'

import { type DB } from '../generated/db'

import { config } from './config'

const { Pool } = pg

export const createDbConnection = ({ logger }: { logger: Logger }) => {
  const db = new Kysely<DB>({
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
    log(event) {
      if (config.debug.logSqlQueries && event.level === 'query') {
        logger.info(
          {
            sql: event.query.sql,
            parameters: event.query.parameters,
            duration: event.queryDurationMillis,
          },
          'SQL query executed',
        )
      }
    },
  })

  return db
}
