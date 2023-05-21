import path from 'node:path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    setupFiles: ['./src/test/testsSetup.ts'],
    coverage: {
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        'src/generated',
        'src/migrations',
        'src/**/__tests__',
        'src/**/*.factory.ts',
      ],
    },
  },
})
