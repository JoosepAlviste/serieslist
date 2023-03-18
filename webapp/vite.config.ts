import react from '@vitejs/plugin-react'
import path from 'path'
import ssr from 'vite-plugin-ssr/plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), ssr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'happy-dom',
    coverage: {
      all: true,
    },
  },
})
