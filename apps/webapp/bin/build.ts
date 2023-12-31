import { buildEsbuild } from '@serieslist/esbuild'

import pkg from '../package.json'

await buildEsbuild({
  packageJson: pkg,
  entryPoints: ['src/server/server.ts'],
  outdir: 'dist/prodServer',
  tsconfig: 'tsconfig.server.json',
})
