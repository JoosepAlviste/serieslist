import path from 'path'

import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), ssr()],
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
    environment: 'happy-dom',
    coverage: {
      all: true,
    },
  },
})
