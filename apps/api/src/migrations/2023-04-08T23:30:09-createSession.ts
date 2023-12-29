import { type NotWorthIt } from '@serieslist/type-utils'
import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema
    .createTable('session')
    .addColumn('token', 'varchar(255)', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) => col.references('user.id'))
    .addColumn('ip', 'varchar(55)')
    .addColumn('user_agent', 'varchar(255)')
    .addColumn('is_valid', 'boolean', (col) => col.defaultTo(true))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull(),
    )
    .execute()
}

export async function down(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema.dropTable('session').execute()
}
