import { resolve } from 'node:path'

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    globals: true,
    dir: resolve(__dirname, 'src'),
    environment: 'jsdom',
    coverage: {
      all: true,
    },
  },
})
