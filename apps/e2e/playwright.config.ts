import { defineConfig, devices } from '@playwright/test'

import { config } from './src/config'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    baseURL: `http://localhost:${config.port}`,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  outputDir: 'test-results/',

  webServer: [
    {
      command: '(cd ../.. && pnpm exec nx start:e2e @serieslist/webapp)',
      port: config.port,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: '(cd ../.. && pnpm exec nx start:e2e @serieslist/api)',
      url: `${config.api.url}/graphql`,
      timeout: 20 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        '(cd ../.. && pnpm exec nx start:e2e @serieslist/tmdb-mock-server)',
      url: config.tmdb.url,
      timeout: 20 * 1000,
      reuseExistingServer: !process.env.CI,
    },
  ],
})
