import { defineConfig } from 'drizzle-kit'

import { config } from './src/lib/config'

export default defineConfig({
  schema: './src/schema/index.ts',
  dialect: 'postgresql',
  out: './src/drizzle',
  dbCredentials: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.db,
    ssl: config.db.host !== 'localhost',
  },
})
