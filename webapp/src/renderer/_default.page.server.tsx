import { renderToStringWithData } from '@apollo/client/react/ssr'
import React from 'react'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'

import logoUrl from './logo.svg'
import { PageShell } from './PageShell'
import type { PageContextServer } from './types'

export const passToClient = ['pageProps', 'documentProps', 'apolloInitialState']

export async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext
  // This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!Page) {
    throw new Error('My render() hook expects pageContext.Page to be defined')
  }

  const tree = (
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  )
  const pageHtml = await renderToStringWithData(tree)
  const apolloInitialState = pageContext.apollo.extract()

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.exports
  const title = documentProps?.title ?? 'Serieslist'
  const desc = documentProps?.description ?? 'App using Vite + vite-plugin-ssr'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      apolloInitialState,
    },
  }
}
