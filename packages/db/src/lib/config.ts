/* eslint-disable @typescript-eslint/no-non-null-assertion */

export const config = {
  debug: {
    logSqlQueries: process.env.API_LOG_SQL_QUERIES === 'true',
  },

  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT!, 10),
    db: process.env.DB_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
}
