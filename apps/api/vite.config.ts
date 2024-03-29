import path from 'node:path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    alias: {
      '#': path.resolve(__dirname, 'src'),
    },
    setupFiles: ['./src/test/testsSetup.ts'],
    globalSetup: './src/test/testsGlobalSetup.ts',
    coverage: {
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        'src/test/testsSetup.ts',
        'src/test/testsGlobalSetup.ts',
        'src/generated',
        'src/**/__tests__',
        'src/**/*.factory.ts',
      ],
    },
  },
})
