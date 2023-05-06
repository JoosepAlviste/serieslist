import path from 'path'

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vanillaExtractPlugin(), react(), ssr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  ssr: {
    noExternal: ['@apollo/client'],
  },
  envDir: '..',
  test: {
    globals: true,
    dir: path.resolve(__dirname, 'src'),
    environment: 'jsdom',
    coverage: {
      all: true,
    },
  },
})
