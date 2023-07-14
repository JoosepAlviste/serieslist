import { sql, type Kysely } from 'kysely'

import { UserSeriesStatus } from '@/features/series'
import { type NotWorthIt } from '@/types/utils'

export async function up(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema
    .createType('user_series_status_status')
    .asEnum([
      UserSeriesStatus.InProgress,
      UserSeriesStatus.PlanToWatch,
      UserSeriesStatus.OnHold,
      UserSeriesStatus.Completed,
    ])
    .execute()

  await db.schema
    .createTable('user_series_status')
    .addColumn('series_id', 'integer', (col) =>
      col.references('series.id').onDelete('cascade').notNull(),
    )
    .addColumn('user_id', 'integer', (col) =>
      col.references('user.id').onDelete('cascade').notNull(),
    )
    .addColumn('status', sql`user_series_status_status`, (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull(),
    )
    .addPrimaryKeyConstraint('user_series_status_pk', ['series_id', 'user_id'])
    .execute()
}

export async function down(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema.dropTable('user_series_status').execute()
  await db.schema.dropType('user_series_status_status').execute()
}
