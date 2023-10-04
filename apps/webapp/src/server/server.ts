// Note that this file isn't processed by Vite, see https://vikejs/vike/issues/562

import './loadDotenv'

import { join } from 'node:path'

import { fastifyCompress } from '@fastify/compress'
// eslint-disable-next-line import/no-named-as-default
import fastifyCookie from '@fastify/cookie'
import { fastifyMiddie } from '@fastify/middie'
import { fastifyStatic } from '@fastify/static'
import { fastify } from 'fastify'
import { renderPage } from 'vike/server'
import { type PageContext } from 'vike/types'

import { config } from '#/config'
import { CurrentUserDocument } from '#/generated/gql/graphql'
import { type Theme } from '#/utils/theme'

import { makeApolloClient } from '../lib/apollo.js'

import { root } from './root.js'

const isProduction = process.env.NODE_ENV === 'production'

void startServer()

async function startServer() {
  const app = fastify()

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

  console.log(`Server running at http://localhost:${config.port}`)
}
