import { ApolloProvider } from '@apollo/client'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { SSRProvider } from '@serieslist/ui'
import React from 'react'
import type { PageContext } from 'vike/types'

import { Header, NavSidebar } from '#/components'
import { AuthenticatedUserProvider } from '#/features/auth'
import { PageContextProvider, ThemeProvider, ToastProvider } from '#/providers'

import * as s from './PageShell.css'

import '@serieslist/ui/reset.css'
import '@serieslist/ui/global.css'

export function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode
  pageContext: PageContext
}) {
  return (
    <React.StrictMode>
      <SSRProvider>
        <ApolloProvider client={pageContext.apollo}>
          <PageContextProvider pageContext={pageContext}>
            <ThemeProvider>
              <AuthenticatedUserProvider>
                <TooltipProvider>
                  <ToastProvider>
                    <div>
                      <Header className={s.header} />
                      <NavSidebar className={s.nav} />
                      <main className={s.main}>{children}</main>
                    </div>
                  </ToastProvider>
                </TooltipProvider>
              </AuthenticatedUserProvider>
            </ThemeProvider>
          </PageContextProvider>
        </ApolloProvider>
      </SSRProvider>
    </React.StrictMode>
  )
}
