/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const config = {
  port: parseInt(process.env.VITE_APP_PORT!),
  api: {
    url: process.env.VITE_API_URL!,
  },
}
