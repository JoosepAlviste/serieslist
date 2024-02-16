import path, { join } from 'path'

import { sentryVitePlugin } from '@sentry/vite-plugin'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { ssr } from 'vike/plugin'
import { loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
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
      svgr({
        svgrOptions: {
          icon: '1em',
          replaceAttrValues: {
            currentColor: 'var(--icon-color)',
          },
        },
      }),
      sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        telemetry: false,
        disable: process.env.NODE_ENV !== 'production',
      }),
      VitePWA({
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon-180x180.png',
          'maskable-icon-512x512.svg',
        ],
        manifest: {
          name: 'Serieslist',
          short_name: 'Serieslist',
          description:
            'Always know which episode to watch next. Keep track of your series and seen episodes.',
          theme_color: '#6366f1',
          icons: [
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
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
