import { createDbConnection } from '@serieslist/db'

import { log } from './logger'

export const db = createDbConnection({ logger: log })
