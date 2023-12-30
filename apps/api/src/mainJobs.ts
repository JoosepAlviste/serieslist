import { seriesSyncWorker } from '#/features/series/jobs'

import { log } from './lib/logger'

/**
 * The job workers are started in a separate container in order to avoid
 * affecting the performance of the real API (blocking the event loop) when jobs
 * are being executed.
 */
const startQueues = () => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  seriesSyncWorker.run()

  log.info('Started job workers')
}

startQueues()
