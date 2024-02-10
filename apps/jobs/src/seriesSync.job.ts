import { reSyncSeries } from '@serieslist/feature-series-sync'

import { createQueue, createWorker } from './lib/bullMq'
import { db } from './lib/db'

export const seriesSyncQueue = createQueue('seriesSync')

const SERIES_SYNC_JOB = 'seriesSync'

await seriesSyncQueue.add(
  SERIES_SYNC_JOB,
  {},
  {
    repeat: {
      pattern: '* * * * *',
    },
  },
)

export const seriesSyncWorker = createWorker(
  SERIES_SYNC_JOB,
  async () => {
    await reSyncSeries({ ctx: { db } })
  },
  { autorun: false },
)
