import type { app as appType } from '#/server'

export const registerJellyfinIntegrationRoutes = (app: typeof appType) => {
  app.post('/api/jellyfin-webhook', (req) => {
    req.log.info({ request: req.body }, 'incoming jellyfin webhook request')

    return {}
  })
}
