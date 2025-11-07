import {
  ATTR_HTTP_REQUEST_METHOD,
  ATTR_URL_FULL,
  ATTR_URL_SCHEME,
  ATTR_USER_AGENT_ORIGINAL,
  ATTR_HTTP_RESPONSE_STATUS_CODE,
} from '@opentelemetry/semantic-conventions'
import pino, { type Logger } from 'pino'

type RequestShape = {
  protocol: string
  hostname: string
  originalUrl: string
  method: string
  headers: { 'user-agent'?: string }
}

const customReqSerializer = (req: RequestShape) => {
  if (!req.hostname || !req.originalUrl || !req.protocol) {
    return req
  }

  const url = new URL(`${req.protocol}://${req.hostname}${req.originalUrl}`)

  return {
    [ATTR_HTTP_REQUEST_METHOD]: req.method,
    [ATTR_URL_FULL]: url,
    [ATTR_URL_SCHEME]: req.protocol,
    [ATTR_USER_AGENT_ORIGINAL]: req.headers['user-agent'],
  }
}

type ResponseShape = {
  statusCode: number
}

const customResSerializer = (res: ResponseShape) => ({
  [ATTR_HTTP_RESPONSE_STATUS_CODE]: res.statusCode,
})

/**
 * Create a new logger instance with the given name. The name is always
 * outputted in the logs.
 */
export const createLogger = ({ name }: { name: string }) => {
  return pino({
    level: process.env.NODE_ENV === 'test' ? 'silent' : 'debug',
    name,
    serializers: {
      req: customReqSerializer,
      res: customResSerializer,
    },
    formatters: {
      level: (label) => {
        return {
          level: label,
        }
      },
    },
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  })
}

/**
 * Get the logger configuration for Fastify based on the environment.
 */
export const getLoggerByEnvironment = (logger: Logger) => {
  if (!process.env.NODE_ENV) {
    return logger
  }

  const envToLogger: Record<string, Logger | undefined> = {
    development: logger,
    production: logger,
    test: undefined,
  }

  return envToLogger[process.env.NODE_ENV]
}
