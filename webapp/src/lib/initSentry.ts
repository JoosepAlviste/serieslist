import * as Sentry from '@sentry/react'

import { config } from '@/config'

Sentry.init({
  enabled: config.sentry.enabled,
  dsn: config.sentry.dsn,
  environment: config.development ? 'development' : 'production',
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/serieslist\.joosep\.xyz/,
        /^https:\/\/api.serieslist\.joosep\.xyz/,
      ],
    }),
  ],
  tracesSampleRate: 0.1,
})
