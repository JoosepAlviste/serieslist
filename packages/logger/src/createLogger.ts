import pino, { type Logger } from 'pino'

/**
 * Create a new logger instance with the given name. The name is always
 * outputted in the logs.
 */
export const createLogger = ({ name }: { name: string }) => {
  return pino({
    level: 'info',
    name,
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
    return true
  }

  const envToLogger: Record<string, Logger | boolean | undefined> = {
    development: logger,
    production: logger,
    test: false,
  }

  return envToLogger[process.env.NODE_ENV] ?? true
}
