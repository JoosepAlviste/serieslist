/**
 * Object with environment variables that works on both the server and the
 * browser.
 */
const env = typeof process !== 'undefined' ? process.env : import.meta.env

export const config = {
  port: parseInt(env.VITE_APP_PORT ?? '3000', 10),

  api: {
    url: env.VITE_API_URL ?? '',
    host: env.VITE_API_HOST ?? 'localhost',
    port: env.VITE_API_PORT ?? '3000',
  },
}
