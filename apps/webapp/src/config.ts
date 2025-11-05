/* eslint-disable @typescript-eslint/no-non-null-assertion */

const development =
  typeof process !== 'undefined' ? process.env.DEV : import.meta.env.DEV

/**
 * Object with environment variables that works on both the server and the
 * browser. `process` only exists on the server and `import.meta.env` only
 * exists on the client side...
 *
 * New environment variables used here MUST be also defined in the `webapp`
 * Dockerfile with ARG and ENV keywords.
 */
export const config = {
  development,

  port: parseInt(
    (typeof process !== 'undefined'
      ? process.env.VITE_APP_PORT
      : import.meta.env.VITE_APP_PORT) ?? '3000',
  ),

  api: {
    url:
      (typeof process !== 'undefined'
        ? process.env.VITE_API_URL
        : import.meta.env.VITE_API_URL) ?? '',
    internalUrl:
      (typeof process !== 'undefined'
        ? process.env.VITE_API_INTERNAL_URL
        : import.meta.env.VITE_API_INTERNAL_URL) ?? 'localhost',
  },

  sentry: {
    enabled: !development,
    dsn:
      typeof process !== 'undefined'
        ? process.env.VITE_APP_SENTRY_DSN!
        : import.meta.env.VITE_APP_SENTRY_DSN,
  },

  tracing: {
    enabled: !development,
    webAuthToken:
      typeof process !== 'undefined'
        ? process.env.VITE_OTEL_AUTH_TOKEN!
        : import.meta.env.VITE_OTEL_AUTH_TOKEN!,
    url:
      (typeof process !== 'undefined'
        ? process.env.VITE_OTEL_ENDPOINT
        : import.meta.env.VITE_OTEL_ENDPOINT) ?? '',
    dataset:
      (typeof process !== 'undefined'
        ? process.env.VITE_OTEL_DATASET
        : import.meta.env.VITE_OTEL_DATASET) ?? '',
  },
}
