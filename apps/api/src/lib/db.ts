import { createDbConnection } from '@serieslist/core-db'

import { log } from './logger'

export const { db } = await createDbConnection({ logger: log })
