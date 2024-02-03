import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  unique,
  integer,
  numeric,
  smallint,
  text,
} from 'drizzle-orm/pg-core'

export const series = pgTable(
  'series',
  {
    id: serial('id').primaryKey().notNull(),
    imdbId: varchar('imdb_id', { length: 15 }),
    title: varchar('title', { length: 255 }).notNull(),
    poster: varchar('poster', { length: 255 }),
    startYear: smallint('start_year'),
    endYear: smallint('end_year'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
    runtimeMinutes: smallint('runtime_minutes'),
    plot: text('plot'),
    imdbRating: numeric('imdb_rating'),
    syncedAt: timestamp('synced_at', { withTimezone: true, mode: 'date' }),
    tmdbId: integer('tmdb_id').notNull(),
  },
  (table) => {
    return {
      seriesImdbIdKey: unique('series_imdb_id_key').on(table.imdbId),
      seriesTmdbIdKey: unique('series_tmdb_id_key').on(table.tmdbId),
    }
  },
)

export type Series = InferSelectModel<typeof series>
export type InsertSeries = InferInsertModel<typeof series>
