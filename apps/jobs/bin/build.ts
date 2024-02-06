import { buildEsbuild } from '@serieslist/core-esbuild'

import pkg from '../package.json'

await buildEsbuild({
  packageJson: pkg,
  entryPoints: ['src/main.ts'],
  external: ['pg-native'],
})
