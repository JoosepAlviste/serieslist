import {
  type Processor,
  Queue,
  Worker,
  type RedisOptions,
  type WorkerOptions,
  type QueueOptions,
} from 'bullmq'

import { config } from '#/config'

const redisConnection: RedisOptions = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
}

export const createQueue = (name: string, opts: QueueOptions = {}) =>
  new Queue(name, { connection: redisConnection, ...opts })

export const createWorker = (
  name: string,
  processor: Processor,
  opts: WorkerOptions = {},
) => new Worker(name, processor, { connection: redisConnection, ...opts })
