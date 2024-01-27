import type { NotWorthIt } from '@serieslist/type-utils'
import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema
    .createTable('user')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('email', 'varchar(255)', (col) => col.unique().notNull())
    .addColumn('is_admin', 'boolean', (col) => col.defaultTo(false))
    .addColumn('password', 'varchar(255)', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull(),
    )
    .execute()
}

export async function down(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema.dropTable('user').execute()
}
