import type { NotWorthIt } from '@serieslist/type-utils'
import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema
    .createTable('seen_episode')
    .addColumn('user_id', 'integer', (col) =>
      col.references('user.id').onDelete('cascade').notNull(),
    )
    .addColumn('episode_id', 'integer', (col) =>
      col.references('episode.id').onDelete('cascade').notNull(),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull(),
    )
    .addPrimaryKeyConstraint('seen_episode_pk', ['episode_id', 'user_id'])
    .execute()
}

export async function down(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema.dropTable('seen_episode').execute()
}
