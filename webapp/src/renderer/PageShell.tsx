import { ApolloProvider } from '@apollo/client'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import React from 'react'

import { Header, NavSidebar } from '@/components'
import { AuthenticatedUserProvider } from '@/features/auth'
import { PageContextProvider, ToastProvider } from '@/providers'

import * as s from './PageShell.css'
import type { PageContext } from './types'

import './reset.css'
import './global.css'

export function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode
  pageContext: PageContext
}) {
  return (
    <React.StrictMode>
      <ApolloProvider client={pageContext.apollo}>
        <PageContextProvider pageContext={pageContext}>
          <AuthenticatedUserProvider>
            <TooltipProvider>
              <ToastProvider>
                <div className={s.pageContainer}>
                  <Header className={s.header} />
                  <NavSidebar className={s.nav} />
                  <main className={s.main}>{children}</main>
                </div>
              </ToastProvider>
            </TooltipProvider>
          </AuthenticatedUserProvider>
        </PageContextProvider>
      </ApolloProvider>
    </React.StrictMode>
  )
}
