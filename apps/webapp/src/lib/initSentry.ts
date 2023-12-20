import { init, BrowserTracing } from '@sentry/react'

import { config } from '#/config'

init({
  enabled: config.sentry.enabled,
  dsn: config.sentry.dsn,
  environment: config.development ? 'development' : 'production',
  integrations: [
    new BrowserTracing({
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/serieslist\.joosep\.xyz/,
        /^https:\/\/api.serieslist\.joosep\.xyz/,
      ],
    }),
  ],
  tracesSampleRate: 0.1,
})
