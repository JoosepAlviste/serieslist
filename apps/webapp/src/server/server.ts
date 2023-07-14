// Note that this file isn't processed by Vite, see https://github.com/brillout/vite-plugin-ssr/issues/562

import './loadDotenv'

import { join } from 'node:path'

import { fastifyCompress } from '@fastify/compress'
// eslint-disable-next-line import/no-named-as-default
import fastifyCookie from '@fastify/cookie'
import { fastifyMiddie } from '@fastify/middie'
import { fastifyStatic } from '@fastify/static'
import { fastify } from 'fastify'
import { renderPage } from 'vite-plugin-ssr/server'

import { config } from '#/config'
import { CurrentUserDocument } from '#/generated/gql/graphql'
import { type Theme } from '#/utils/theme'

import { makeApolloClient } from '../lib/apollo.js'
import { type PageContext } from '../renderer/types.js'

import { root } from './root.js'

const isProduction = process.env.NODE_ENV === 'production'

void startServer()

async function startServer() {
  const app = fastify()

  await app.register(fastifyMiddie)
  await app.register(fastifyCompress)
  await app.register(fastifyCookie)

  if (isProduction) {
    const distPath = join(root, '/dist/client/assets')
    await app.register(fastifyStatic, {
      root: distPath,
      prefix: '/assets/',
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
    const pageContextInit: Partial<PageContext> = {
      urlOriginal: req.url,
      apollo,
      theme,
      currentUser:
        currentUserResponse.data.me.__typename === 'User'
          ? currentUserResponse.data.me
          : undefined,
    }
    const pageContext = await renderPage(pageContextInit)

    const { httpResponse, redirectTo } = pageContext
    if (redirectTo) {
      return reply.redirect(307, redirectTo)
    } else if (!httpResponse) {
      return reply.code(404).type('text/html').send('Not Found')
    }

    const { body, statusCode, contentType } = httpResponse

    return reply.status(statusCode).type(contentType).send(body)
  })

  await app.listen({ port: config.port, host: '0.0.0.0' })

  console.log(`Server running at http://localhost:${config.port}`)
}
