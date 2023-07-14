import { createBullBoard as createBullBoardBase } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { FastifyAdapter } from '@bull-board/fastify'

import { seriesSyncQueue } from '@/features/series/jobs'

export const createBullBoard = () => {
  const bullBoardServerAdapter = new FastifyAdapter()
  createBullBoardBase({
    queues: [new BullMQAdapter(seriesSyncQueue)],
    serverAdapter: bullBoardServerAdapter,
  })
  bullBoardServerAdapter.setBasePath('/bullmq')

  return {
    bullBoardServerAdapter,
  }
}
