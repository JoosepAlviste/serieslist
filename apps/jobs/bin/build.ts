import { buildEsbuild } from '@serieslist/core-esbuild'

import pkg from '../package.json'

await buildEsbuild({
  packageJson: pkg,
  entryPoints: ['src/main.ts', 'src/tracing.ts'],
  external: ['pg-native'],
})
