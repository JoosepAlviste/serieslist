import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { pgTable, timestamp, integer, primaryKey } from 'drizzle-orm/pg-core'

import { episode } from './episode'
import { series } from './series'
import { user } from './user'

export const seriesProgress = pgTable(
  'series_progress',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    seriesId: integer('series_id')
      .notNull()
      .references(() => series.id, { onDelete: 'cascade' }),
    latestSeenEpisodeId: integer('latest_seen_episode_id')
      .notNull()
      .references(() => episode.id, { onDelete: 'cascade' }),
    nextEpisodeId: integer('next_episode_id').references(() => episode.id, {
      onDelete: 'cascade',
    }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      seriesProgressPk: primaryKey({
        columns: [table.userId, table.seriesId],
        name: 'series_progress_pk',
      }),
    }
  },
)

export type SeriesProgress = InferSelectModel<typeof seriesProgress>
export type InsertSeriesProgress = InferInsertModel<typeof seriesProgress>
