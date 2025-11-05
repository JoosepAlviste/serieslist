import { buildEsbuild } from '@serieslist/core-esbuild'

import pkg from '../package.json'

await buildEsbuild({
  packageJson: pkg,
  entryPoints: ['src/server/server.ts', 'src/server/tracing.ts'],
  outdir: 'dist/prodServer',
  tsconfig: 'tsconfig.server.json',
})
