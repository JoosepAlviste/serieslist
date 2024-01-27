import type { NotWorthIt } from '@serieslist/type-utils'
import { sql, type Kysely } from 'kysely'

import { UserSeriesStatusStatus } from '../constants'

export async function up(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema
    .createType('user_series_status_status')
    .asEnum([
      UserSeriesStatusStatus.InProgress,
      UserSeriesStatusStatus.PlanToWatch,
      UserSeriesStatusStatus.OnHold,
      UserSeriesStatusStatus.Completed,
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
