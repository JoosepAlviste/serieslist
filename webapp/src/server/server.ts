// Note that this file isn't processed by Vite, see https://github.com/brillout/vite-plugin-ssr/issues/562

import compression from 'compression'
import express from 'express'
import { renderPage } from 'vite-plugin-ssr'

import { root } from './root.js'

const isProduction = process.env.NODE_ENV === 'production'

void startServer()

// TODO: We are currenty running the production server with `ts-node`. Maybe we
// could have a separate `serverProduction.ts` (or `.js`) that we run for prod.
// Then, we wouldn't probably need TypeScript and `ts-node` as production
// dependencies?
async function startServer() {
  const app = express()

  app.use(compression())

  if (isProduction) {
    const sirv = (await import('sirv')).default
    app.use(sirv(`${root}/dist/client`))
  } else {
    const vite = await import('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true },
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  app.get('*', async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl,
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { body, statusCode, contentType, earlyHints } = httpResponse

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (res.writeEarlyHints) {
      res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
    }

    res.status(statusCode).type(contentType).send(body)
  })

  const port = process.env.PORT ?? 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}