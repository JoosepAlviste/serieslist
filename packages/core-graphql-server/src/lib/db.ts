import { createDbConnection } from '@serieslist/core-db'

import { log } from './logger'

export const { db } = createDbConnection({ logger: log })
