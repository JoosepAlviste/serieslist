import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
  boolean,
  pgTable,
  varchar,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core'

import { user } from './user'

export const session = pgTable('session', {
  token: varchar('token', { length: 255 }).primaryKey().notNull(),
  userId: integer('user_id').references(() => user.id),
  ip: varchar('ip', { length: 55 }),
  userAgent: varchar('user_agent', { length: 255 }),
  isValid: boolean('is_valid').default(true),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
})

export type Session = InferSelectModel<typeof session>
export type InsertSession = InferInsertModel<typeof session>
