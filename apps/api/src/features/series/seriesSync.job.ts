import { createQueue, createWorker } from '#/lib/bullMq'
import { db } from '#/lib/db'

export const seriesSyncQueue = createQueue('seriesSync')

const SERIES_SYNC_JOB = 'seriesSync'

await seriesSyncQueue.add(
  SERIES_SYNC_JOB,
  {},
  {
    repeat: {
      pattern: '0 4 * * *',
    },
  },
)

export const seriesSyncWorker = createWorker(
  SERIES_SYNC_JOB,
  async () => {
    const { reSyncSeries } = await import('./series.service')

    await reSyncSeries({ ctx: { db } })
  },
  { autorun: false },
)
