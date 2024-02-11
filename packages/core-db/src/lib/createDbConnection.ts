import { DefaultLogger, type LogWriter } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import type { Logger } from 'pino'

import * as schema from '../schema'

import { config } from './config'

const { Pool } = pg

export const createDbConnection = ({ logger }: { logger: Logger }) => {
  const pool = new Pool({
    host: config.db.host,
    ssl: config.db.host !== 'localhost',
    port: config.db.port,
    database: config.db.db,
    user: config.db.user,
    password: config.db.password,
  })

  class SerieslistLogWriter implements LogWriter {
    write(message: string) {
      logger.info(message)
    }
  }

  const dbLogger = new DefaultLogger({ writer: new SerieslistLogWriter() })

  const db = drizzle(pool, {
    logger: config.debug.logSqlQueries ? dbLogger : false,
    schema,
  })

  return { db, pool }
}
