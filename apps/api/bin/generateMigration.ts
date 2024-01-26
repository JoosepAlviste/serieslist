import { generateMigration } from '@serieslist/db/dev'

await generateMigration({ name: process.argv[2] })
