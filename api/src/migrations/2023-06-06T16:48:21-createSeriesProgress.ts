import { sql, type Kysely } from 'kysely'

import { type NotWorthIt } from '@/types/utils'

export async function up(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema
    .createTable('series_progress')
    .addColumn('user_id', 'integer', (col) =>
      col.references('user.id').onDelete('cascade').notNull(),
    )
    .addColumn('series_id', 'integer', (col) =>
      col.references('series.id').onDelete('cascade').notNull(),
    )
    .addColumn('latest_seen_episode_id', 'integer', (col) =>
      col.references('episode.id').onDelete('cascade').notNull(),
    )
    .addColumn('next_episode_id', 'integer', (col) =>
      col.references('episode.id').onDelete('cascade'),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull(),
    )
    .addPrimaryKeyConstraint('series_progress_pk', ['series_id', 'user_id'])
    .execute()
}

export async function down(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema.dropTable('series_progress').execute()
}
