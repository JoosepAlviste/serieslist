import { buildEsbuild } from '@serieslist/esbuild'

import pkg from '../package.json'

await buildEsbuild({
  packageJson: pkg,
  entryPoints: ['src/main.ts'],
})
