import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
  pgTable,
  boolean,
  serial,
  varchar,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

export const user = pgTable(
  'user',
  {
    id: serial('id').primaryKey().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    isAdmin: boolean('is_admin').default(false),
    password: varchar('password', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userEmailKey: unique('user_email_key').on(table.email),
    }
  },
)

export type User = InferSelectModel<typeof user>
export type InsertUser = InferInsertModel<typeof user>
