import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
  pgTable,
  serial,
  varchar,
  unique,
  integer,
  numeric,
  smallint,
  date,
} from 'drizzle-orm/pg-core'

import { season } from './season'

export const episode = pgTable(
  'episode',
  {
    id: serial('id').primaryKey().notNull(),
    imdbId: varchar('imdb_id', { length: 15 }),
    seasonId: integer('season_id')
      .notNull()
      .references(() => season.id, { onDelete: 'cascade' }),
    number: smallint('number').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    releasedAt: date('released_at', { mode: 'date' }),
    imdbRating: numeric('imdb_rating'),
    tmdbId: integer('tmdb_id').notNull(),
  },
  (table) => {
    return {
      episodeImdbIdKey: unique('episode_imdb_id_key').on(table.imdbId),
      episodeTmdbIdKey: unique('episode_tmdb_id_key').on(table.tmdbId),
    }
  },
)

export type Episode = InferSelectModel<typeof episode>
export type InsertEpisode = InferInsertModel<typeof episode>
