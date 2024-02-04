import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
  pgTable,
  serial,
  varchar,
  unique,
  integer,
  smallint,
} from 'drizzle-orm/pg-core'

import { series } from './series'

export const season = pgTable(
  'season',
  {
    id: serial('id').primaryKey().notNull(),
    seriesId: integer('series_id')
      .notNull()
      .references(() => series.id, { onDelete: 'cascade' }),
    number: smallint('number').notNull(),
    tmdbId: integer('tmdb_id').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
  },
  (table) => {
    return {
      seasonTmdbIdKey: unique('season_tmdb_id_key').on(table.tmdbId),
    }
  },
)

export type Season = InferSelectModel<typeof season>
export type InsertSeason = InferInsertModel<typeof season>
