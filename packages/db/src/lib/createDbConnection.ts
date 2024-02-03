import { DefaultLogger, type LogWriter } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import type { Logger } from 'pino'

import * as schema from '../schema'

import { config } from './config'

const { Client } = pg

export const createDbConnection = async ({ logger }: { logger: Logger }) => {
  const client = new Client({
    host: config.db.host,
    ssl: config.db.host !== 'localhost',
    port: config.db.port,
    database: config.db.db,
    user: config.db.user,
    password: config.db.password,
  })

  await client.connect()

  class SerieslistLogWriter implements LogWriter {
    write(message: string) {
      logger.info(message)
    }
  }

  const dbLogger = new DefaultLogger({ writer: new SerieslistLogWriter() })
  const db = drizzle(client, {
    logger: dbLogger,
    schema,
  })

  return { db, client }
}
