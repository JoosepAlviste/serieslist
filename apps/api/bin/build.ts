import { cp } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildEsbuild } from '@serieslist/core-esbuild'

import pkg from '../package.json'

const dirname = fileURLToPath(new URL('.', import.meta.url))

await buildEsbuild({
  packageJson: pkg,
  entryPoints: ['src/main.ts', 'src/mainJobs.ts', 'bin/migrate.ts'],
  tsconfig: 'tsconfig.build.json',
  external: ['pg-native'],
})

// Copy migrations to `dist` so that they can be run in production
const migrationsDir = join(
  dirname,
  '..',
  '..',
  '..',
  'packages',
  'core-db',
  'src',
  'drizzle',
)
const migrationsDestination = join(dirname, '..', 'dist', 'drizzle')
await cp(migrationsDir, migrationsDestination, { recursive: true })
