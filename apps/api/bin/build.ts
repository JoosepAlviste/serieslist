import { readdir, rename } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildEsbuild } from '@serieslist/esbuild'

import pkg from '../package.json'

await buildEsbuild({
  packageJson: pkg,
  entryPoints: ['src/main.ts', 'src/mainJobs.ts', 'bin/migrate.ts'],
  tsconfig: 'tsconfig.build.json',
  external: ['pg-native'],
})

await buildEsbuild({
  packageJson: pkg,
  entryPoints: ['../../packages/db/src/migrations/**/*.ts'],
  outdir: 'dist/src/migrations',
  tsconfig: 'tsconfig.build.json',
})

// Esbuild replaces all colons in filenames with underscores, but we already
// have existing migrations with colons. Rename them back. New migrations
// should be generated with dashes instead of colons.

const dirname = fileURLToPath(new URL('.', import.meta.url))
const migrationsDir = join(dirname, '..', 'dist', 'src', 'migrations')
const fileNames = await readdir(migrationsDir)

for (const fileName of fileNames) {
  const newFileName = fileName.replaceAll('_', ':')
  await rename(join(migrationsDir, fileName), join(migrationsDir, newFileName))
}
