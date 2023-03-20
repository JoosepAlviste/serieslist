#!/usr/bin/env sh

tee -a src/migrations/$(date +"%Y-%m-%dT%T")-$1.ts <<EOF
import { sql, type Kysely } from 'kysely'

import { type Kysely } from 'kysely'

export async function up(db: Kysely<NotWorthIt>): Promise<void> {

}

export async function down(db: Kysely<NotWorthIt>): Promise<void> {

}
EOF
