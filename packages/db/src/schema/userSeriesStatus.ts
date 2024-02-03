import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
  pgTable,
  timestamp,
  integer,
  primaryKey,
  pgEnum,
} from 'drizzle-orm/pg-core'

import { UserSeriesStatusStatus } from '../constants'

import { series } from './series'
import { user } from './user'

export const userSeriesStatusStatus = pgEnum('user_series_status_status', [
  UserSeriesStatusStatus.Completed,
  UserSeriesStatusStatus.OnHold,
  UserSeriesStatusStatus.PlanToWatch,
  UserSeriesStatusStatus.InProgress,
])

export const userSeriesStatus = pgTable(
  'user_series_status',
  {
    seriesId: integer('series_id')
      .notNull()
      .references(() => series.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    status: userSeriesStatusStatus('status').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userSeriesStatusPk: primaryKey({
        columns: [table.seriesId, table.userId],
        name: 'user_series_status_pk',
      }),
    }
  },
)

export type UserSeriesStatus = InferSelectModel<typeof userSeriesStatus>
export type InsertUserSeriesStatus = InferInsertModel<typeof userSeriesStatus>
