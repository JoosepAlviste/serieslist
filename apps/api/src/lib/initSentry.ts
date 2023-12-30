import * as Sentry from '@sentry/node'

import { config } from '#/config'

Sentry.init({
  enabled: config.sentry.enabled,
  dsn: config.sentry.dsn,
})
