// Note that this file isn't processed by Vite, see https://github.com/brillout/vite-plugin-ssr/issues/562

import './loadDotenv'

import compression from 'compression'
import express from 'express'
import { renderPage } from 'vite-plugin-ssr'

import { config } from '@/config'

import { makeApolloClient } from '../lib/apollo.js'
import { type PageContext } from '../renderer/types.js'

import { root } from './root.js'

const isProduction = process.env.NODE_ENV === 'production'

void startServer()

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
    const apollo = makeApolloClient({
      ssr: true,
    })

    const pageContextInit: Partial<PageContext> = {
      urlOriginal: req.originalUrl,
      apollo,
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

  app.listen(config.port)
  console.log(`Server running at http://localhost:${config.port}`)
}
