import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { pgTable, timestamp, integer, primaryKey } from 'drizzle-orm/pg-core'

import { episode } from './episode'
import { user } from './user'

export const seenEpisode = pgTable(
  'seen_episode',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    episodeId: integer('episode_id')
      .notNull()
      .references(() => episode.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      seenEpisodePk: primaryKey({
        columns: [table.userId, table.episodeId],
        name: 'seen_episode_pk',
      }),
    }
  },
)

export type SeenEpisode = InferSelectModel<typeof seenEpisode>
export type InsertSeenEpisode = InferInsertModel<typeof seenEpisode>
