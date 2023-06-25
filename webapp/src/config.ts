/**
 * Object with environment variables that works on both the server and the
 * browser. `process` only exists on the server and `import.meta.env` only
 * exists on the client side...
 *
 * New environment variables used here MUST be also defined in the `webapp`
 * Dockerfile with ARG and ENV keywords.
 */
export const config = {
  development:
    typeof process !== 'undefined' ? process.env.DEV : import.meta.env.DEV,

  port: parseInt(
    (typeof process !== 'undefined'
      ? process.env.VITE_APP_PORT
      : import.meta.env.VITE_APP_PORT) ?? '3000',
    10,
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
    host:
      (typeof process !== 'undefined'
        ? process.env.VITE_API_HOST
        : import.meta.env.VITE_API_HOST) ?? 'localhost',
    port:
      (typeof process !== 'undefined'
        ? process.env.VITE_API_PORT
        : import.meta.env.VITE_API_PORT) ?? '3000',
  },
}

console.log('config', config)
