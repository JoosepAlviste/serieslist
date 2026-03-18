import type { app as appType } from '#/server'

export const registeJellyfinIntegrationRoutes = (app: typeof appType) => {
  app.post('/api/jellyfin-webhook', (req) => {
    req.log.info({ request: req.body }, 'incoming jellyfin webhook request')

    return {}
  })
}
