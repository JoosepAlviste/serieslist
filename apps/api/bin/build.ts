import { buildEsbuild } from '@serieslist/esbuild'

import pkg from '../package.json'

await buildEsbuild({
  packageJson: pkg,
  entryPoints: [
    'src/main.ts',
    'src/mainJobs.ts',
    'bin/migrate.ts',
    'src/migrations/**/*.ts',
  ],
  tsconfig: 'tsconfig.build.json',
  external: ['pg-native'],
})
