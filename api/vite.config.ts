import path from 'node:path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    setupFiles: ['./src/test/testsSetup.ts'],
  },
})
