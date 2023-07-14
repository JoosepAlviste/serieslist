import path, { join } from 'path'

import { sentryVitePlugin } from '@sentry/vite-plugin'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import ssr from 'vite-plugin-ssr/plugin'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vitest/config'

export default ({ mode }: { mode: string }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, join(process.cwd(), '../..'), ''),
  }

  return defineConfig({
    clearScreen: false,
    build: {
      sourcemap: true,
    },
    plugins: [
      vanillaExtractPlugin({
        // Avoid class names not matching from SSR and hydration
        emitCssInSsr: true,
      }),
      react(),
      ssr(),
      svgr(),
      sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        telemetry: false,
      }),
    ],
    resolve: {
      alias: {
        '#': path.resolve(__dirname, 'src'),
      },
    },
    ssr: {
      noExternal: ['@apollo/client'],
    },
    envDir: '../../',
    test: {
      globals: true,
      dir: path.resolve(__dirname, 'src'),
      environment: 'jsdom',
      coverage: {
        all: true,
      },
      setupFiles: ['./src/lib/testsSetup.ts'],
    },
  })
}
