import { createDbConnection } from '@serieslist/db'

import { log } from './logger'

export const { db } = await createDbConnection({ logger: log })
