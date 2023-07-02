import pino from 'pino'

import { config } from '@/config'

export const log = pino({
  level: 'info',
  transport:
    config.environment === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
})
