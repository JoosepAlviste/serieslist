// Note that this file isn't processed by Vite, see https://github.com/vikejs/vike/issues/562

import './loadDotenv'

import { join } from 'node:path'

import { fastifyCompress } from '@fastify/compress'
import fastifyCookie from '@fastify/cookie'
import { fastifyMiddie } from '@fastify/middie'
import { fastifyStatic } from '@fastify/static'
import { fastify, type FastifyRequest } from 'fastify'
import { renderPage } from 'vike/server'
import type { PageContext } from 'vike/types'

import { config } from '#/config'
import { CurrentUserDocument } from '#/generated/gql/graphql'
import type { Theme } from '#/utils/theme'

import { makeApolloClient } from '../lib/apollo.js'

import { log } from './logger'
import { root } from './root.js'

const isProduction = process.env.NODE_ENV === 'production'

void startServer()
if (process.env.NODE_ENV === 'development') {
  const { watchGraphQLSchema } = await import('./watchGraphQLSchema')
  await watchGraphQLSchema()
}

const REQUEST_LOG_IGNORE_PATTERNS = [
  /\.(js|ts|tsx|css|css\?direct|pageContext\.json|mjs|svg|svg\?import&react|svg\?import|ico)$/,
  /@react-refresh$/,
  /@vite\/client$/,
  /:client-routing$/,
  /__x00__virtual/,
]

function shouldRequestBeLogged(req: FastifyRequest) {
  return !REQUEST_LOG_IGNORE_PATTERNS.some((pattern) => req.url.match(pattern))
}

async function startServer() {
  const app = fastify({
    loggerInstance: log,
    // We do our own request logging to avoid logging static asset requests
    disableRequestLogging: true,
  })

  app.addHook('onRequest', (req, _reply, done) => {
    if (shouldRequestBeLogged(req)) {
      req.log.info({ reqId: req.id, req }, 'incoming request')
    }
    done()
  })

  app.addHook('onResponse', (req, reply, done) => {
    if (shouldRequestBeLogged(req)) {
      req.log.info({ reqId: req.id, res: reply }, 'request completed')
    }
    done()
  })

  await app.register(fastifyMiddie)
  await app.register(fastifyCompress)
  await app.register(fastifyCookie)

  if (isProduction) {
    await app.register(fastifyStatic, {
      root: join(root, '/dist/client'),
      prefix: '/',
      decorateReply: false,
      index: false,
      wildcard: false,
    })
  } else {
    const vite = await import('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true },
      })
    ).middlewares
    await app.use(viteDevMiddleware)
  }

  app.get('*', async (req, reply) => {
    const apollo = makeApolloClient({
      ssr: true,
      req,
    })
    const currentUserResponse = await apollo.query({
      query: CurrentUserDocument,
    })

    const theme = req.cookies.theme as Theme | undefined
    const pageContextInit: Pick<
      PageContext,
      'urlOriginal' | 'apollo' | 'theme' | 'currentUser'
    > = {
      urlOriginal: req.url,
      apollo,
      theme,
      currentUser:
        currentUserResponse.data.me.__typename === 'User'
          ? currentUserResponse.data.me
          : undefined,
    }
    const { httpResponse } = await renderPage(pageContextInit)
    if (!httpResponse) {
      return reply.code(404).type('text/html').send('Not Found')
    }

    const { body, statusCode, headers } = httpResponse

    return reply
      .status(statusCode)
      .headers(
        headers.reduce<Record<string, string>>((acc, [name, value]) => {
          acc[name] = value
          return acc
        }, {}),
      )
      .send(body)
  })

  await app.listen({ port: config.port, host: '0.0.0.0' })
}
