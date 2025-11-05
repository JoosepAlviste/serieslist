import { init } from '@dash0/sdk-web'

import { config } from '#/config'

if (config.tracing.enabled) {
  init({
    serviceName: 'webapp',
    endpoint: {
      url: config.tracing.url,
      authToken: config.tracing.webAuthToken,
      dataset: config.tracing.dataset,
    },
  })
}
